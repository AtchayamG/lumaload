import { DayEvent } from "@/lib/contracts/day";
import { Recommendation, VerificationResult } from "@/lib/contracts/plan";
import { getEvidenceById } from "@/lib/evidence/registry";
import { findBannedPhrases } from "@/lib/safety/language";
import { isRestrictedEvent } from "@/lib/safety/restrictedActivities";
import { AIProvider, VerifyBatchItem } from "@/lib/ai/provider";

export interface VerifyPlanOutput {
  verifiedRecommendations: Recommendation[];
  verification: VerificationResult;
}

const DEMAND_ALLOWED_USES: Record<string, string[]> = {
  cognitive: [
    "cognitive_accommodation",
    "screen_breaks",
    "pacing",
    "workload_reduction",
    "gradual_activity",
    "avoid_prolonged_rest",
    "rest_opportunity",
  ],
  sensory: [
    "environment_modification",
    "sensory_pacing",
    "screen_breaks",
    "pacing",
    "rest_opportunity",
    "sleep_hygiene",
    "avoid_prolonged_rest",
  ],
  physical: [
    "pacing",
    "rest_opportunity",
    "light_physical_activity",
    "symptom_limited_activity",
    "gradual_activity",
    "avoid_prolonged_rest",
  ],
  capacity: [
    "emotional_support",
    "capacity_awareness",
    "sleep_hygiene",
    "social_connection",
    "seek_care",
    "pacing",
    "rest_opportunity",
    "avoid_prolonged_rest",
    "gradual_activity",
  ],
};

export async function verifyPlan(
  recommendations: Recommendation[],
  events: DayEvent[],
  provider: AIProvider
): Promise<VerifyPlanOutput> {
  const candidateRecommendations: Recommendation[] = [];
  const unsupportedClaimsRemoved: string[] = [];
  const bannedLanguageRemoved: string[] = [];
  const eventMap = new Map(events.map((e) => [e.id, e]));

  for (const rec of recommendations) {
    const combinedText = `${rec.action} ${rec.rationale}`;

    // Gate 1: Non-empty evidenceIds
    if (!rec.evidenceIds || rec.evidenceIds.length === 0) {
      unsupportedClaimsRemoved.push(
        `Purged recommendation "${rec.action}": no evidence citation IDs provided.`
      );
      continue;
    }

    // Gate 2: Every evidenceId must exist in the static registry
    const citedChunks = rec.evidenceIds.map((id) => getEvidenceById(id));
    const missingIndex = citedChunks.findIndex((c) => !c);
    if (missingIndex !== -1) {
      const invalidId = rec.evidenceIds[missingIndex];
      unsupportedClaimsRemoved.push(
        `Purged recommendation "${rec.action}": cited unknown or hallucinated evidence ID "${invalidId}".`
      );
      continue;
    }

    // Gate 3: Allowed-use theme intersection
    const validChunks = citedChunks.filter(Boolean) as NonNullable<(typeof citedChunks)[0]>[];
    const recDemands = rec.demandReduced;
    const compatibleUses = new Set(
      recDemands.flatMap((d) => DEMAND_ALLOWED_USES[d] || [])
    );

    const hasAllowedUseIntersection = validChunks.every((chunk) =>
      chunk.allowedUses.some((use) => compatibleUses.has(use))
    );

    if (!hasAllowedUseIntersection) {
      unsupportedClaimsRemoved.push(
        `Purged recommendation "${rec.action}": cited evidence permitted uses do not intersect recommendation demand domain.`
      );
      continue;
    }

    // Gate 4: Banned language assertion
    const bannedMatches = findBannedPhrases(combinedText);
    if (bannedMatches.length > 0) {
      bannedLanguageRemoved.push(...bannedMatches);
      unsupportedClaimsRemoved.push(
        `Purged recommendation "${rec.action}": contains prohibited clinical phrase(s): ${bannedMatches.join(", ")}.`
      );
      continue;
    }

    // Gate 5: No target event may have riskClass === "restricted"
    let targetsRestricted = false;
    for (const targetId of rec.targetEventIds) {
      const targetEvent = eventMap.get(targetId);
      if (targetEvent && isRestrictedEvent(targetEvent.category, targetEvent.label)) {
        targetsRestricted = true;
        break;
      }
    }

    if (targetsRestricted) {
      unsupportedClaimsRemoved.push(
        `Purged recommendation "${rec.action}": impermissibly targeted restricted activity.`
      );
      continue;
    }

    // Gate 6: Target event IDs must all exist in the submitted day
    const allTargetsExist = rec.targetEventIds.every((id) => eventMap.has(id));
    if (!allTargetsExist) {
      unsupportedClaimsRemoved.push(
        `Purged recommendation "${rec.action}": references event IDs not present in submitted day.`
      );
      continue;
    }

    // Candidate passed Gates 1-6
    candidateRecommendations.push(rec);
  }

  // Gate 7: BATCH model verifier check (single model call for all candidates)
  const finalVerified: Recommendation[] = [];

  if (candidateRecommendations.length > 0) {
    const batchItems: VerifyBatchItem[] = candidateRecommendations.map((rec) => {
      const citedChunks = rec.evidenceIds
        .map((id) => getEvidenceById(id))
        .filter(Boolean) as NonNullable<ReturnType<typeof getEvidenceById>>[];
      return {
        id: rec.id,
        action: rec.action,
        rationale: rec.rationale,
        citedClaims: citedChunks.map((c) => c.claim),
      };
    });

    const evaluations = await provider.verifyClaimsBatch(batchItems);
    const evalMap = new Map(evaluations.map((ev) => [ev.id, ev]));

    for (const rec of candidateRecommendations) {
      const ev = evalMap.get(rec.id);
      if (ev?.verdict === "overreaching") {
        unsupportedClaimsRemoved.push(
          `Purged recommendation "${rec.action}": claim overreaches cited clinical evidence (${ev.reason}).`
        );
      } else {
        finalVerified.push(rec);
      }
    }
  }

  const grounded = unsupportedClaimsRemoved.length === 0;
  const boundaryPassed = bannedLanguageRemoved.length === 0;

  return {
    verifiedRecommendations: finalVerified,
    verification: {
      grounded,
      boundaryPassed,
      unsupportedClaimsRemoved,
      bannedLanguageRemoved,
    },
  };
}
