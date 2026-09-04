import { GoogleGenAI } from "@google/genai";
import { ActivityLoad, DayEvent, RecoveryContext, Symptoms } from "@/lib/contracts/day";
import { EvidenceRecord } from "@/lib/contracts/evidence";
import { Recommendation, RecommendationSchema } from "@/lib/contracts/plan";
import {
  AIProvider,
  ComposePlanResult,
  StructureActivitiesResult,
  VerifyClaimResult,
} from "./provider";
import { DeterministicProvider } from "./deterministic";
import {
  buildComposePlanPrompt,
  buildStructureActivitiesPrompt,
  buildVerifierCheckPrompt,
} from "./prompts";
import { z } from "zod";

/**
 * LOGGING PRIVACY NOTICE:
 * Log only request id, stage name, status, duration, error class, and model name.
 * NEVER log symptoms, event labels, prompts, or raw model responses.
 */
function safeLog(stage: string, status: string, durationMs: number, errorClass?: string) {
  // Safe anonymous execution metric logging only
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[Pipeline Log] stage=${stage} status=${status} duration=${durationMs}ms${
        errorClass ? ` error=${errorClass}` : ""
      }`
    );
  }
}

const MODEL_NAME = "gemini-3.8-flash";
const TIMEOUT_MS = 20000;

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
        console.warn("Failed to initialize GoogleGenAI client, using fallback:", (e as Error).name);
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
      const res = await this.callWithTimeout(
        this.client.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        })
      );

      const duration = Date.now() - start;
      const text = res.text;
      if (!text) throw new Error("Empty model response for structure activities");

      const parsed = JSON.parse(text);
      const loadsArray = Array.isArray(parsed) ? parsed : parsed.activities || parsed.loads;

      if (!Array.isArray(loadsArray)) {
        throw new Error("Model response did not contain array of activity loads");
      }

      // Map back and validate
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
        modelUsed: MODEL_NAME,
        usedFallback: false,
      };
    } catch (err) {
      const duration = Date.now() - start;
      safeLog("structure_activities", "fallback", duration, (err as Error).name);
      return this.fallbackProvider.structureActivities(events, symptoms);
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

      const res = await this.callWithTimeout(
        this.client.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        })
      );

      const duration = Date.now() - start;
      const text = res.text;
      if (!text) throw new Error("Empty model response for compose plan");

      const parsed = JSON.parse(text);
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
        modelUsed: MODEL_NAME,
        usedFallback: false,
      };
    } catch (err) {
      const duration = Date.now() - start;
      safeLog("compose_plan", "fallback", duration, (err as Error).name);
      return this.fallbackProvider.composePlan(
        events,
        symptoms,
        context,
        capacityBaseline,
        retrievedEvidence
      );
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
      const res = await this.callWithTimeout(
        this.client.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        }),
        8000
      );

      const text = res.text;
      if (!text) throw new Error("Empty verifier response");
      const parsed = JSON.parse(text);

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
}
