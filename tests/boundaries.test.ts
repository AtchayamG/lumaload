import { describe, it, expect } from "vitest";
import {
  classifyActivityRisk,
  isRestrictedEvent,
} from "@/lib/safety/restrictedActivities";
import {
  validateRecommendationBoundaries,
  assertNoRestrictedTargets,
} from "@/lib/safety/boundaries";
import { DayEvent } from "@/lib/contracts/day";
import { Recommendation } from "@/lib/contracts/plan";

describe("Clinical Boundaries & Restricted Activities", () => {
  it("always classifies contact_sport and driving as restricted", () => {
    expect(classifyActivityRisk("contact_sport")).toBe("restricted");
    expect(classifyActivityRisk("driving")).toBe("restricted");
    expect(isRestrictedEvent("contact_sport")).toBe(true);
    expect(isRestrictedEvent("driving")).toBe(true);
  });

  it("classifies light_exercise as clinician_guided", () => {
    expect(classifyActivityRisk("light_exercise")).toBe("clinician_guided");
  });

  it("classifies normal daily activities as normal_daily_activity", () => {
    expect(classifyActivityRisk("reading")).toBe("normal_daily_activity");
    expect(classifyActivityRisk("short_walk")).toBe("normal_daily_activity");
    expect(classifyActivityRisk("quiet_rest")).toBe("normal_daily_activity");
    expect(classifyActivityRisk("meal")).toBe("normal_daily_activity");
  });

  it("identifies restricted activities by sensitive keyword patterns", () => {
    expect(isRestrictedEvent("short_walk", "Five-a-side football")).toBe(true);
    expect(isRestrictedEvent("reading", "Highway driving")).toBe(true);
    expect(isRestrictedEvent("laptop_work", "Solo swimming")).toBe(true);
    expect(isRestrictedEvent("errand_shopping", "Bouldering session")).toBe(true);
  });

  it("rejects any recommendation that targets a restricted event", () => {
    const events: DayEvent[] = [
      {
        id: "ev-sport",
        label: "Five-a-side football",
        startMinutes: 1080,
        durationMinutes: 60,
        category: "contact_sport",
        environment: [],
      },
      {
        id: "ev-study",
        label: "Study block",
        startMinutes: 840,
        durationMinutes: 120,
        category: "laptop_work",
        environment: ["screen"],
      },
    ];

    const invalidRec: Recommendation = {
      id: "rec-bad",
      action: "Shorten football practice to 30 minutes",
      rationale: "Gradual return to activity",
      targetEventIds: ["ev-sport"],
      demandReduced: ["physical"],
      confidence: "high",
      evidenceIds: ["cdc-recovery-002"],
      whatWeInferred: "Less physical effort",
      whatWeDoNotKnow: "Match intensity",
    };

    const eventsById = new Map(events.map((e) => [e.id, e]));
    const result = validateRecommendationBoundaries(invalidRec, eventsById);
    expect(result.valid).toBe(false);
    expect(result.violations[0].reason).toContain("restricted");

    expect(() => assertNoRestrictedTargets([invalidRec], events)).toThrow(
      /Boundary assertion failed/
    );
  });

  it("allows recommendations targeting normal daily activities", () => {
    const events: DayEvent[] = [
      {
        id: "ev-study",
        label: "Study block",
        startMinutes: 840,
        durationMinutes: 120,
        category: "laptop_work",
        environment: ["screen"],
      },
    ];

    const validRec: Recommendation = {
      id: "rec-good",
      action: "Take a 15-minute screen break halfway through the study block",
      rationale: "Reduces continuous cognitive load.",
      targetEventIds: ["ev-study"],
      demandReduced: ["cognitive", "sensory"],
      confidence: "high",
      evidenceIds: ["cdc-school-003"],
      whatWeInferred: "Long screen use exacerbates fogginess",
      whatWeDoNotKnow: "Deadline flexibility",
    };

    const eventsById = new Map(events.map((e) => [e.id, e]));
    const result = validateRecommendationBoundaries(validRec, eventsById);
    expect(result.valid).toBe(true);
    expect(result.violations).toHaveLength(0);

    expect(() => assertNoRestrictedTargets([validRec], events)).not.toThrow();
  });
});
