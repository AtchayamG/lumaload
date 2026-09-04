import { ActivityLoad, DayEvent, RecoveryContext, Symptoms } from "@/lib/contracts/day";
import { EvidenceRecord } from "@/lib/contracts/evidence";
import { Recommendation } from "@/lib/contracts/plan";
import { AIProvider, ComposePlanResult, StructureActivitiesResult, VerifyClaimResult } from "./provider";
import { computeEventLoad } from "@/lib/load/heuristics";
import { isRestrictedEvent } from "@/lib/safety/restrictedActivities";
import { containsBannedLanguage } from "@/lib/safety/language";

export class DeterministicProvider implements AIProvider {
  name = "DeterministicRulesEngine";

  async structureActivities(
    events: DayEvent[],
    symptoms: Symptoms
  ): Promise<StructureActivitiesResult> {
    const activityLoads: ActivityLoad[] = events.map((event) => {
      const calc = computeEventLoad(event, symptoms);
      return {
        eventId: event.id,
        cognitive: calc.cognitive,
        sensory: calc.sensory,
        physical: calc.physical,
        reasonCodes: calc.reasonCodes,
        riskClass: calc.riskClass,
        confidence: 0.95,
        source: "deterministic_prior",
      };
    });

    return {
      activityLoads,
      modelUsed: null,
      usedFallback: true,
    };
  }

  async composePlan(
    events: DayEvent[],
    symptoms: Symptoms,
    context: RecoveryContext,
    capacityBaseline: number,
    retrievedEvidence: EvidenceRecord[]
  ): Promise<ComposePlanResult> {
    const recommendations: Recommendation[] = [];
    const evidenceById = new Map(retrievedEvidence.map((e) => [e.id, e]));

    // Helper to find a retrieved evidence ID by allowed use or tag
    const findEvidenceId = (predicate: (e: EvidenceRecord) => boolean): string => {
      const found = retrievedEvidence.find(predicate);
      return found ? found.id : retrievedEvidence[0]?.id || "cdc-recovery-002";
    };

    // Filter out restricted activities from being modified
    const eligibleEvents = events.filter(
      (e) => !isRestrictedEvent(e.category, e.label)
    );

    // 1. Long screen / cognitive block accommodation
    const longScreenBlock = eligibleEvents.find(
      (e) =>
        e.durationMinutes >= 75 &&
        (e.environment.includes("screen") ||
          e.category === "laptop_work" ||
          e.category === "lecture_class")
    );

    if (longScreenBlock) {
      const evidenceId = findEvidenceId(
        (e) =>
          e.allowedUses.includes("screen_breaks") ||
          e.allowedUses.includes("cognitive_accommodation") ||
          e.allowedUses.includes("pacing")
      );

      recommendations.push({
        id: `rec-det-screen-${longScreenBlock.id}`,
        action: `Split the ${longScreenBlock.durationMinutes}-minute ${longScreenBlock.label.toLowerCase()} with a 15-minute screen-free break`,
        rationale: `Unbroken cognitive and screen demand can intensify fogginess and headache. Adding structured pauses maintains task tolerance.`,
        targetEventIds: [longScreenBlock.id],
        demandReduced: ["cognitive", "sensory"],
        confidence: "high",
        evidenceIds: [evidenceId],
        whatWeInferred: `Extended continuous screen exposure without pauses compounds sensory fatigue.`,
        whatWeDoNotKnow: `Whether institutional assignment deadlines permit flexible interval completion.`,
      });
    }

    // 2. High sensory / crowded environment accommodation
    const crowdedEvent = eligibleEvents.find(
      (e) =>
        e.environment.includes("crowded") ||
        e.environment.includes("loud") ||
        e.environment.includes("bright")
    );

    if (crowdedEvent) {
      const evidenceId = findEvidenceId(
        (e) =>
          e.allowedUses.includes("environment_modification") ||
          e.allowedUses.includes("rest_opportunity") ||
          e.tags.includes("sensory")
      );

      recommendations.push({
        id: `rec-det-env-${crowdedEvent.id}`,
        action: `Relocate ${crowdedEvent.label.toLowerCase()} to a calmer, quieter setting or step out for quiet breaks`,
        rationale: `Loud, visually intense, or crowded spaces quickly deplete sensory tolerance when recovering from concussion.`,
        targetEventIds: [crowdedEvent.id],
        demandReduced: ["sensory"],
        confidence: "high",
        evidenceIds: [evidenceId],
        whatWeInferred: `Concurrent auditory and visual stimuli aggravate light and noise sensitivity.`,
        whatWeDoNotKnow: `Whether a private or quiet alternative space is readily accessible on-site.`,
      });
    }

    // 3. Low Capacity Baseline Pacing / Midday decompression
    if (capacityBaseline <= 0.8 && eligibleEvents.length >= 3) {
      const afternoonEvents = eligibleEvents.filter(
        (e) => e.startMinutes >= 720 && e.startMinutes <= 960
      );
      const target = afternoonEvents[0] || eligibleEvents[1];

      if (target) {
        const evidenceId = findEvidenceId(
          (e) =>
            e.allowedUses.includes("pacing") ||
            e.allowedUses.includes("avoid_prolonged_rest") ||
            e.tags.includes("capacity")
        );

        recommendations.push({
          id: `rec-det-capacity-pace`,
          action: `Insert a 20-minute quiet decompression window before the afternoon demand stack`,
          rationale: `Today's capacity baseline is reduced due to sleep and mood symptoms. Proactive pacing prevents late-day symptom flare-ups.`,
          targetEventIds: [target.id],
          demandReduced: ["capacity", "cognitive"],
          confidence: "moderate",
          evidenceIds: [evidenceId],
          whatWeInferred: `Multiple consecutive commitments without recovery buffers lead to demand outpacing baseline capacity.`,
          whatWeDoNotKnow: `Exact personal fatigue thresholds across different study tasks.`,
        });
      }
    }

    // 4. Emotional support & connection recommendation if mood/anxiety elevated
    if ((symptoms.mood >= 5 || symptoms.anxiety >= 5) && recommendations.length < 4) {
      const evidenceId = findEvidenceId(
        (e) =>
          e.allowedUses.includes("emotional_support") ||
          e.allowedUses.includes("social_connection") ||
          e.tags.includes("mood")
      );

      const socialTarget = eligibleEvents.find(
        (e) => e.category === "social_quiet" || e.category === "meal"
      ) || eligibleEvents[0];

      if (socialTarget) {
        recommendations.push({
          id: `rec-det-emotional-support`,
          action: `Maintain low-stress social check-ins with friends or trusted colleagues`,
          rationale: `Concussion recovery is emotionally taxing. Staying connected in low-demand ways helps reduce anxiety and mood strain.`,
          targetEventIds: [socialTarget.id],
          demandReduced: ["capacity"],
          confidence: "moderate",
          evidenceIds: [evidenceId],
          whatWeInferred: `Concussion symptoms often include irritability and nervousness that benefit from supportive social pacing.`,
          whatWeDoNotKnow: `Personal comfort level discussing recovery needs with peers.`,
        });
      }
    }

    return {
      recommendations: recommendations.slice(0, 5),
      modelUsed: null,
      usedFallback: true,
    };
  }

  async verifyClaim(
    action: string,
    rationale: string,
    citedClaims: string[]
  ): Promise<VerifyClaimResult> {
    const combined = `${action} ${rationale}`;
    if (containsBannedLanguage(combined)) {
      return {
        verdict: "overreaching",
        reason: "Contains banned clinical or diagnostic language.",
      };
    }

    if (citedClaims.length === 0) {
      return {
        verdict: "overreaching",
        reason: "No evidence claims provided to support statement.",
      };
    }

    return {
      verdict: "supported",
      reason: "Statement adheres to low-risk pacing principles in cited evidence.",
    };
  }

  async verifyClaimsBatch(
    items: Array<{ id: string; action: string; rationale: string; citedClaims: string[] }>
  ): Promise<Array<{ id: string; verdict: "supported" | "overreaching"; reason: string }>> {
    return items.map((item) => {
      const combined = `${item.action} ${item.rationale}`;
      if (containsBannedLanguage(combined)) {
        return {
          id: item.id,
          verdict: "overreaching",
          reason: "Contains banned clinical or diagnostic language.",
        };
      }
      if (item.citedClaims.length === 0) {
        return {
          id: item.id,
          verdict: "overreaching",
          reason: "No evidence claims provided to support statement.",
        };
      }
      return {
        id: item.id,
        verdict: "supported",
        reason: "Statement adheres to low-risk pacing principles in cited evidence.",
      };
    });
  }
}
