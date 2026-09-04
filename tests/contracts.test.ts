import { describe, it, expect } from "vitest";
import demoData from "@/data/demo-days.json";
import {
  SymptomsSchema,
  RecoveryContextSchema,
  DayEventSchema,
  ActivityLoadSchema,
  RecommendationSchema,
  AnalysisResponseSchema,
  TraceStageSchema,
} from "@/lib/contracts";
import { getAllEvidence } from "@/lib/evidence/registry";

describe("Zod Contracts & Schemas", () => {
  it("validates valid symptoms and rejects out-of-bounds values", () => {
    const valid = {
      headache: 4,
      dizziness: 2,
      lightNoise: 5,
      fogginess: 4,
      fatigue: 3,
      mood: 6,
      anxiety: 6,
      sleepQuality: 3,
    };
    expect(SymptomsSchema.safeParse(valid).success).toBe(true);

    const invalidMax = { ...valid, headache: 11 };
    expect(SymptomsSchema.safeParse(invalidMax).success).toBe(false);

    const invalidMin = { ...valid, fatigue: -1 };
    expect(SymptomsSchema.safeParse(invalidMin).success).toBe(false);

    const invalidFloat = { ...valid, mood: 5.5 };
    expect(SymptomsSchema.safeParse(invalidFloat).success).toBe(false);
  });

  it("validates recovery context and defaults feelingUnableToCope to false", () => {
    const validContext = {
      daysSinceInjury: 5,
      setting: "school" as const,
      clinicianSeen: true,
    };
    const parsed = RecoveryContextSchema.parse(validContext);
    expect(parsed.feelingUnableToCope).toBe(false);

    const invalidSetting = { ...validContext, setting: "vacation" };
    expect(RecoveryContextSchema.safeParse(invalidSetting).success).toBe(false);
  });

  it("validates DayEventSchema and environments", () => {
    const validEvent = {
      id: "ev-1",
      label: "Morning lecture",
      startMinutes: 540,
      durationMinutes: 90,
      category: "lecture_class" as const,
      environment: ["screen" as const],
    };
    expect(DayEventSchema.safeParse(validEvent).success).toBe(true);

    const invalidDuration = { ...validEvent, durationMinutes: 2 };
    expect(DayEventSchema.safeParse(invalidDuration).success).toBe(false);
  });

  it("validates all personas in demo-days.json", () => {
    expect(demoData.personas.length).toBeGreaterThanOrEqual(2);

    const maya = demoData.personas.find((p) => p.id === "maya-day-5");
    expect(maya).toBeDefined();
    if (!maya) return;

    expect(SymptomsSchema.safeParse(maya.symptoms).success).toBe(true);
    expect(RecoveryContextSchema.safeParse(maya.context).success).toBe(true);
    for (const ev of maya.events) {
      expect(DayEventSchema.safeParse(ev).success).toBe(true);
    }
  });

  it("Maya fixture round-trips through AnalysisResponseSchema", () => {
    const maya = demoData.personas.find((p) => p.id === "maya-day-5")!;
    const allEvidence = getAllEvidence();

    const mockResponse = {
      status: "ok" as const,
      safety: {
        dangerSignsDetected: false,
        dangerSignsSelected: [],
        restrictedEventIds: ["maya-ev-8"],
        distressSignpostShown: false,
      },
      capacity: {
        baseline: 0.65,
        pressurePoints: [
          {
            startMinutes: 630,
            endMinutes: 960,
            severity: "high" as const,
          },
        ],
      },
      activityLoads: maya.events.map((ev) => ({
        eventId: ev.id,
        cognitive: 3,
        sensory: 3,
        physical: ev.category === "contact_sport" ? 5 : 1,
        reasonCodes: ["base_prior"],
        riskClass:
          ev.category === "contact_sport"
            ? ("restricted" as const)
            : ("normal_daily_activity" as const),
        confidence: 0.9,
        source: "deterministic_prior" as const,
      })),
      recommendations: [
        {
          id: "rec-1",
          action: "Split the 120-minute study block with a 20-minute quiet rest break",
          rationale: "Unbroken cognitive screen load coincides with an afternoon capacity dip.",
          targetEventIds: ["maya-ev-6"],
          demandReduced: ["cognitive" as const, "sensory" as const],
          confidence: "high" as const,
          evidenceIds: ["cdc-school-003", "cdc-recovery-002"],
          whatWeInferred: "Extended library screen work increases headache and fogginess.",
          whatWeDoNotKnow: "Whether the assignment deadline allows rescheduling.",
        },
      ],
      evidence: allEvidence.slice(0, 5),
      verification: {
        grounded: true,
        boundaryPassed: true,
        unsupportedClaimsRemoved: [],
        bannedLanguageRemoved: [],
      },
      trace: [
        {
          name: "sanitize",
          status: "ok" as const,
          startedAt: 1000,
          durationMs: 4,
          kind: "deterministic" as const,
          detail: "Sanitized 8 event labels; 0 sensitive tokens removed.",
          itemsIn: 8,
          itemsOut: 8,
        },
      ],
      modelUsed: "gemini-3.8-flash",
    };

    const parsed = AnalysisResponseSchema.safeParse(mockResponse);
    expect(parsed.success).toBe(true);
  });
});
