import fs from "fs";
import path from "path";
import { DaySubmission } from "@/lib/contracts/day";
import { AnalysisResponse } from "@/lib/contracts/plan";
import demoDays from "@/data/demo-days.json";

// Import precomputed JSON directly so Next.js bundler includes it cleanly
import mayaPrecomputed from "@/data/precomputed/maya-day-5.json";
import quietPrecomputed from "@/data/precomputed/quieter-tuesday.json";
import dangerPrecomputed from "@/data/precomputed/danger-sign-demo.json";

const PRECOMPUTED_MAP: Record<string, any> = {
  "maya-day-5": mayaPrecomputed,
  "quieter-tuesday": quietPrecomputed,
  "danger-sign-demo": dangerPrecomputed,
};

function normalizeDay(submission: DaySubmission): string {
  // Extract key signatures
  const eventSig = submission.events
    .map((e) => `${e.label}:${e.category}:${e.startMinutes}:${e.durationMinutes}`)
    .sort()
    .join("|");
  const symptomSig = Object.entries(submission.symptoms)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${eventSig}##${symptomSig}`;
}

export function findMatchingPrecomputed(
  submission: DaySubmission,
  forceLive = false
): AnalysisResponse | null {
  if (forceLive) return null;

  const targetSig = normalizeDay(submission);

  for (const persona of demoDays.personas) {
    const personaSubmission: DaySubmission = {
      symptoms: persona.symptoms as any,
      context: persona.context as any,
      dangerSignsSelected: persona.dangerSigns || [],
      events: persona.events as any,
    };

    if (normalizeDay(personaSubmission) === targetSig) {
      const entry = PRECOMPUTED_MAP[persona.id];
      if (entry && entry.response) {
        const response: AnalysisResponse = JSON.parse(JSON.stringify(entry.response));

        const detail = entry.modelUsed
          ? `Demo day analysed with ${entry.modelUsed}. Re-run live to call the model now.`
          : "Demo day precomputed with deterministic rules engine (model quota exhausted during build). Re-run live to call the model now.";

        // Prepend served_from_precomputed trace stage
        const cacheStage = {
          name: "served_from_precomputed",
          status: "ok" as const,
          startedAt: Date.now() - 2,
          durationMs: 2,
          kind: "retrieval" as const,
          detail,
        };

        response.modelUsed = entry.modelUsed ?? null;
        response.trace = [cacheStage, ...response.trace];
        return response;
      }
    }
  }

  return null;
}