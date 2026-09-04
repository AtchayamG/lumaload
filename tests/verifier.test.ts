import { describe, it, expect } from "vitest";
import { verifyPlan } from "@/lib/pipeline/stages/verifyPlan";
import { Recommendation } from "@/lib/contracts/plan";
import { DayEvent } from "@/lib/contracts/day";
import { DeterministicProvider } from "@/lib/ai/deterministic";

describe("Responsible AI Multi-Layer Verifier", () => {
  const provider = new DeterministicProvider();

  const baseEvents: DayEvent[] = [
    {
      id: "ev-study",
      label: "Library study session",
      startMinutes: 840,
      durationMinutes: 120,
      category: "laptop_work",
      environment: ["screen"],
    },
    {
      id: "ev-sport",
      label: "Evening football",
      startMinutes: 1080,
      durationMinutes: 60,
      category: "contact_sport",
      environment: [],
    },
  ];

  it("deletes a recommendation with an unknown/hallucinated evidence id", async () => {
    const badRec: Recommendation = {
      id: "rec-fake-evidence",
      action: "Take breaks every 20 minutes",
      rationale: "Reduces strain",
      targetEventIds: ["ev-study"],
      demandReduced: ["cognitive"],
      confidence: "high",
      evidenceIds: ["fake-citation-999"], // Does not exist
      whatWeInferred: "Less strain",
      whatWeDoNotKnow: "Deadline",
    };

    const result = await verifyPlan([badRec], baseEvents, provider);
    expect(result.verifiedRecommendations).toHaveLength(0);
    expect(result.verification.unsupportedClaimsRemoved.length).toBeGreaterThan(0);
    expect(result.verification.unsupportedClaimsRemoved[0]).toContain(
      "fake-citation-999"
    );
  });

  it("deletes a recommendation with zero evidence ids", async () => {
    const badRec: Recommendation = {
      id: "rec-no-evidence",
      action: "Rest often",
      rationale: "Rest helps",
      targetEventIds: ["ev-study"],
      demandReduced: ["cognitive"],
      confidence: "low",
      evidenceIds: [], // Empty
      whatWeInferred: "Inference",
      whatWeDoNotKnow: "Unknown",
    };

    const result = await verifyPlan([badRec], baseEvents, provider);
    expect(result.verifiedRecommendations).toHaveLength(0);
    expect(result.verification.unsupportedClaimsRemoved.length).toBeGreaterThan(0);
    expect(result.verification.unsupportedClaimsRemoved[0]).toContain("no evidence");
  });

  it("deletes a recommendation containing 'you are safe to return to sport' and records phrase in bannedLanguageRemoved", async () => {
    const bannedRec: Recommendation = {
      id: "rec-banned-phrase",
      action: "Because symptoms are mild, you are safe to return to sport next week.",
      rationale: "Gradual progression.",
      targetEventIds: ["ev-study"],
      demandReduced: ["physical"],
      confidence: "high",
      evidenceIds: ["cdc-recovery-002"],
      whatWeInferred: "Readiness",
      whatWeDoNotKnow: "Doctor note",
    };

    const result = await verifyPlan([bannedRec], baseEvents, provider);
    expect(result.verifiedRecommendations).toHaveLength(0);
    expect(result.verification.bannedLanguageRemoved).toContain(
      "return to sport"
    );
    expect(result.verification.boundaryPassed).toBe(false);
    expect(result.verification.unsupportedClaimsRemoved[0]).toContain(
      "prohibited clinical phrase"
    );
  });

  it("deletes a recommendation that impermissibly targets a restricted event", async () => {
    const restrictedRec: Recommendation = {
      id: "rec-target-restricted",
      action: "Run light football drills for 30 minutes",
      rationale: "Physical recovery",
      targetEventIds: ["ev-sport"], // Football is contact_sport -> restricted
      demandReduced: ["physical"],
      confidence: "high",
      evidenceIds: ["cdc-sports-002"],
      whatWeInferred: "Activity tolerance",
      whatWeDoNotKnow: "Supervision",
    };

    const result = await verifyPlan([restrictedRec], baseEvents, provider);
    expect(result.verifiedRecommendations).toHaveLength(0);
    expect(result.verification.unsupportedClaimsRemoved[0]).toContain(
      "restricted activity"
    );
  });

  it("approves a properly grounded, compliant recommendation", async () => {
    const validRec: Recommendation = {
      id: "rec-valid",
      action: "Split the 120-minute study session with a 15-minute quiet rest break",
      rationale: "Structured pauses prevent cognitive fatigue escalation.",
      targetEventIds: ["ev-study"],
      demandReduced: ["cognitive", "sensory"],
      confidence: "high",
      evidenceIds: ["cdc-school-003", "cdc-recovery-002"],
      whatWeInferred: "Continuous screen reading compounds fogginess.",
      whatWeDoNotKnow: "Whether course deadlines allow split study blocks.",
    };

    const result = await verifyPlan([validRec], baseEvents, provider);
    expect(result.verifiedRecommendations).toHaveLength(1);
    expect(result.verification.unsupportedClaimsRemoved).toHaveLength(0);
    expect(result.verification.grounded).toBe(true);
    expect(result.verification.boundaryPassed).toBe(true);
  });
});
