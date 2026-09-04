import { DayEvent, RiskClass } from "@/lib/contracts/day";
import { Recommendation } from "@/lib/contracts/plan";
import { isRestrictedEvent } from "./restrictedActivities";

export interface BoundaryViolation {
  recommendationId: string;
  targetEventId: string;
  reason: string;
}

export function validateRecommendationBoundaries(
  recommendation: Recommendation,
  eventsById: Map<string, DayEvent>
): { valid: boolean; violations: BoundaryViolation[] } {
  const violations: BoundaryViolation[] = [];

  for (const eventId of recommendation.targetEventIds) {
    const event = eventsById.get(eventId);
    if (!event) {
      violations.push({
        recommendationId: recommendation.id,
        targetEventId: eventId,
        reason: `Target event ${eventId} does not exist in submitted day.`,
      });
      continue;
    }

    if (isRestrictedEvent(event.category, event.label)) {
      violations.push({
        recommendationId: recommendation.id,
        targetEventId: eventId,
        reason: `Target event "${event.label}" (${event.category}) is classified as restricted and cannot be scheduled or modified by AI recommendations.`,
      });
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function assertNoRestrictedTargets(
  recommendations: Recommendation[],
  events: DayEvent[]
): void {
  const eventsById = new Map<string, DayEvent>(events.map((e) => [e.id, e]));

  for (const rec of recommendations) {
    const result = validateRecommendationBoundaries(rec, eventsById);
    if (!result.valid) {
      throw new Error(
        `Boundary assertion failed: recommendation ${rec.id} targets restricted activity: ${result.violations.map((v) => v.reason).join("; ")}`
      );
    }
  }
}
