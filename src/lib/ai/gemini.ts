import { GoogleGenAI } from "@google/genai";
import { ActivityLoad, DayEvent, RecoveryContext, Symptoms } from "@/lib/contracts/day";
import { EvidenceRecord } from "@/lib/contracts/evidence";
import { Recommendation, RecommendationSchema } from "@/lib/contracts/plan";
import {
  AIProvider,
  ComposePlanResult,
  StructureActivitiesResult,
  VerifyBatchItem,
  VerifyBatchResultItem,
  VerifyClaimResult,
} from "./provider";
import { DeterministicProvider } from "./deterministic";
import {
  buildBatchVerifierPrompt,
  buildComposePlanPrompt,
  buildStructureActivitiesPrompt,
  buildVerifierCheckPrompt,
} from "./prompts";

/**
 * Global cache of working model ID across lambda invocations
 */
export let cachedWorkingModel: string | null = "gemini-2.5-flash";

export function setCachedWorkingModel(model: string | null): void {
  cachedWorkingModel = model;
}

export function getCachedWorkingModel(): string | null {
  return cachedWorkingModel;
}

export const MODEL_CASCADE = [
  "gemini-3.8-flash",
  "gemini-2.5-flash",
];

const TIMEOUT_MS = 5000;
const VERIFIER_TIMEOUT_MS = 4000;

function extractErrorString(err: unknown): string {
  const e = err as { name?: string; message?: string; status?: number; code?: number };
  const parts: string[] = [];
  if (e.name) parts.push(e.name);
  if (e.status || e.code) parts.push(`(code ${e.status || e.code})`);
  if (e.message) parts.push(`: ${e.message}`);
  return parts.join(" ") || "Unknown error";
}

function cleanAndParseJson(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const noTrailing = cleaned.replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(noTrailing);
    } catch {
      const firstBracket = noTrailing.indexOf("[");
      const firstBrace = noTrailing.indexOf("{");
      if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
        const lastBracket = noTrailing.lastIndexOf("]");
        if (lastBracket > firstBracket) {
          return JSON.parse(noTrailing.slice(firstBracket, lastBracket + 1));
        }
      } else if (firstBrace !== -1) {
        const lastBrace = noTrailing.lastIndexOf("}");
        if (lastBrace > firstBrace) {
          return JSON.parse(noTrailing.slice(firstBrace, lastBrace + 1));
        }
      }
      throw err;
    }
  }
}

/**
 * LOGGING PRIVACY NOTICE:
 * Log only request id, stage name, status, duration, error class, and model name.
 * NEVER log symptoms, event labels, prompts, or raw model responses.
 */
function safeLog(stage: string, status: string, durationMs: number, errorDetail?: string) {
  console.log(
    `[Pipeline Log] stage=${stage} status=${status} duration=${durationMs}ms${
      errorDetail ? ` error=${errorDetail}` : ""
    }`
  );
}

export class GeminiProvider implements AIProvider {
  name = "GeminiProvider";
  private fallbackProvider: DeterministicProvider;
  private client: GoogleGenAI | null = null;

  constructor() {
    this.fallbackProvider = new DeterministicProvider();
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        this.client = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn("Failed to initialize GoogleGenAI client:", (e as Error).message);
        this.client = null;
      }
    }
  }

  private async callWithTimeout<T>(promise: Promise<T>, timeoutMs = TIMEOUT_MS): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
  }

  /**
   * Executes a model call using the cascade: tries cached working model first,
   * or iterates down MODEL_CASCADE until one succeeds.
   */
  private async executeWithModelCascade(
    contents: string,
    timeoutMs = TIMEOUT_MS
  ): Promise<{ text: string; modelUsed: string }> {
    if (!this.client) {
      throw new Error("Gemini client not initialized");
    }

    const candidateList = cachedWorkingModel
      ? [cachedWorkingModel, ...MODEL_CASCADE.filter((m) => m !== cachedWorkingModel)]
      : MODEL_CASCADE;

    let lastError: unknown = null;

    for (const model of candidateList) {
      try {
        const res = await this.callWithTimeout(
          this.client.models.generateContent({
            model,
            contents,
            config: {
              responseMimeType: "application/json",
            },
          }),
          timeoutMs
        );

        if (res.text) {
          cachedWorkingModel = model;
          return { text: res.text, modelUsed: model };
        }
      } catch (err) {
        lastError = err;
        safeLog("cascade_candidate_failed", "error", 0, `${model}: ${extractErrorString(err)}`);
        if (model === cachedWorkingModel) {
          cachedWorkingModel = null;
        }
        // Continue cascade to next candidate
      }
    }

    throw lastError || new Error("All cascade models failed");
  }

  async structureActivities(
    events: DayEvent[],
    symptoms: Symptoms
  ): Promise<StructureActivitiesResult> {
    if (!this.client) {
      return this.fallbackProvider.structureActivities(events, symptoms);
    }

    const start = Date.now();
    try {
      const prompt = buildStructureActivitiesPrompt(events, symptoms);
      const { text, modelUsed } = await this.executeWithModelCascade(prompt, TIMEOUT_MS);
      const duration = Date.now() - start;

      const parsed = cleanAndParseJson(text);
      const loadsArray = Array.isArray(parsed) ? parsed : parsed.activities || parsed.loads;

      if (!Array.isArray(loadsArray)) {
        throw new Error("Model response did not contain array of activity loads");
      }

      const eventMap = new Map(events.map((e) => [e.id, e]));
      const activityLoads: ActivityLoad[] = loadsArray
        .filter((item) => eventMap.has(item.eventId))
        .map((item) => ({
          eventId: item.eventId,
          cognitive: Math.max(0, Math.min(5, Number(item.cognitive) || 1)),
          sensory: Math.max(0, Math.min(5, Number(item.sensory) || 1)),
          physical: Math.max(0, Math.min(5, Number(item.physical) || 1)),
          reasonCodes: Array.isArray(item.reasonCodes) ? item.reasonCodes : ["model_classified"],
          riskClass:
            item.riskClass === "restricted" || item.riskClass === "clinician_guided"
              ? item.riskClass
              : "normal_daily_activity",
          confidence: Math.max(0.1, Math.min(1.0, Number(item.confidence) || 0.85)),
          source: "model" as const,
        }));

      safeLog("structure_activities", "ok", duration);
      return {
        activityLoads,
        modelUsed,
        usedFallback: false,
      };
    } catch (err) {
      const duration = Date.now() - start;
      const errorDetail = extractErrorString(err);
      safeLog("structure_activities", "fallback", duration, errorDetail);
      const fallbackResult = await this.fallbackProvider.structureActivities(events, symptoms);
      return {
        ...fallbackResult,
        errorDetail,
      };
    }
  }

  async composePlan(
    events: DayEvent[],
    symptoms: Symptoms,
    context: RecoveryContext,
    capacityBaseline: number,
    retrievedEvidence: EvidenceRecord[]
  ): Promise<ComposePlanResult> {
    if (!this.client) {
      return this.fallbackProvider.composePlan(
        events,
        symptoms,
        context,
        capacityBaseline,
        retrievedEvidence
      );
    }

    const start = Date.now();
    try {
      const prompt = buildComposePlanPrompt(
        events,
        symptoms,
        context,
        capacityBaseline,
        retrievedEvidence
      );

      const { text, modelUsed } = await this.executeWithModelCascade(prompt, TIMEOUT_MS);
      const duration = Date.now() - start;

      const parsed = cleanAndParseJson(text);
      const recsArray = Array.isArray(parsed) ? parsed : parsed.recommendations;

      if (!Array.isArray(recsArray)) {
        throw new Error("Model response did not contain recommendations array");
      }

      const validRecs: Recommendation[] = [];
      for (const raw of recsArray) {
        const candidate = {
          id: raw.id || `rec-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          action: String(raw.action || "").slice(0, 220),
          rationale: String(raw.rationale || "").slice(0, 400),
          targetEventIds: Array.isArray(raw.targetEventIds) ? raw.targetEventIds : [],
          demandReduced: Array.isArray(raw.demandReduced) ? raw.demandReduced : ["cognitive"],
          confidence:
            raw.confidence === "high" || raw.confidence === "low"
              ? raw.confidence
              : "moderate",
          evidenceIds: Array.isArray(raw.evidenceIds) ? raw.evidenceIds : [],
          whatWeInferred: String(raw.whatWeInferred || "").slice(0, 300),
          whatWeDoNotKnow: String(raw.whatWeDoNotKnow || "").slice(0, 300),
        };

        const parsedRec = RecommendationSchema.safeParse(candidate);
        if (parsedRec.success) {
          validRecs.push(parsedRec.data);
        }
      }

      if (validRecs.length === 0) {
        throw new Error("No recommendations passed Zod schema parse");
      }

      safeLog("compose_plan", "ok", duration);
      return {
        recommendations: validRecs.slice(0, 5),
        modelUsed,
        usedFallback: false,
      };
    } catch (err) {
      const duration = Date.now() - start;
      const errorDetail = extractErrorString(err);
      safeLog("compose_plan", "fallback", duration, errorDetail);
      const fallbackResult = await this.fallbackProvider.composePlan(
        events,
        symptoms,
        context,
        capacityBaseline,
        retrievedEvidence
      );
      return {
        ...fallbackResult,
        errorDetail,
      };
    }
  }

  async verifyClaim(
    action: string,
    rationale: string,
    citedClaims: string[]
  ): Promise<VerifyClaimResult> {
    if (!this.client || citedClaims.length === 0) {
      return this.fallbackProvider.verifyClaim(action, rationale, citedClaims);
    }

    try {
      const prompt = buildVerifierCheckPrompt(action, rationale, citedClaims);
      const { text } = await this.executeWithModelCascade(prompt, VERIFIER_TIMEOUT_MS);
      const parsed = cleanAndParseJson(text);

      if (parsed.verdict === "overreaching" || parsed.verdict === "supported") {
        return {
          verdict: parsed.verdict,
          reason: parsed.reason || "Model verification judgment.",
        };
      }
      return { verdict: "supported", reason: "Defaulted to supported." };
    } catch {
      return this.fallbackProvider.verifyClaim(action, rationale, citedClaims);
    }
  }

  async verifyClaimsBatch(
    items: VerifyBatchItem[]
  ): Promise<VerifyBatchResultItem[]> {
    if (!this.client || items.length === 0) {
      return this.fallbackProvider.verifyClaimsBatch(items);
    }

    const start = Date.now();
    try {
      const prompt = buildBatchVerifierPrompt(items);
      const { text } = await this.executeWithModelCascade(prompt, VERIFIER_TIMEOUT_MS);
      const duration = Date.now() - start;

      const parsed = cleanAndParseJson(text);
      const evaluations = parsed.evaluations;

      if (!Array.isArray(evaluations)) {
        throw new Error("Batch verifier response did not contain evaluations array");
      }

      const evalMap = new Map<string, { verdict: "supported" | "overreaching"; reason: string }>();
      for (const ev of evaluations) {
        if (ev.id && (ev.verdict === "supported" || ev.verdict === "overreaching")) {
          evalMap.set(ev.id, {
            verdict: ev.verdict,
            reason: String(ev.reason || "Model verification judgment"),
          });
        }
      }

      safeLog("verify_plan_batch", "ok", duration);
      return items.map((item) => {
        const found = evalMap.get(item.id);
        if (found) {
          return { id: item.id, ...found };
        }
        return { id: item.id, verdict: "supported", reason: "Defaulted to supported." };
      });
    } catch (err) {
      const duration = Date.now() - start;
      safeLog("verify_plan_batch", "fallback", duration, extractErrorString(err));
      return this.fallbackProvider.verifyClaimsBatch(items);
    }
  }
}
