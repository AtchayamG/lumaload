import { describe, it, expect } from "vitest";
import demoData from "@/data/demo-days.json";
import { runAnalysisPipeline } from "@/lib/pipeline/orchestrator";
import { DeterministicProvider } from "@/lib/ai/deterministic";
import { DaySubmissionSchema } from "@/lib/contracts/day";

describe("Analysis Pipeline End-to-End", () => {
  const maya = demoData.personas.find((p) => p.id === "maya-day-5")!;

  it("runs full 7-stage pipeline on Maya fixture with deterministic provider", async () => {
    const submission = DaySubmissionSchema.parse({
      symptoms: maya.symptoms,
      context: maya.context,
      events: maya.events,
      dangerSignsSelected: [],
    });

    const result = await runAnalysisPipeline(submission, new DeterministicProvider());

    expect(result.status).toBe("degraded"); // degraded because deterministic fallback ran
    expect(result.safety.dangerSignsDetected).toBe(false);
    expect(result.safety.restrictedEventIds).toContain("maya-ev-8"); // football
    expect(result.activityLoads.length).toBe(maya.events.length);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
    expect(result.recommendations.length).toBeLessThanOrEqual(5);

    // Assert trace contains 7 stages
    const stageNames = result.trace.map((s) => s.name);
    expect(stageNames).toContain("sanitize");
    expect(stageNames).toContain("safety_check");
    expect(stageNames).toContain("structure_activities");
    expect(stageNames).toContain("retrieve_evidence");
    expect(stageNames).toContain("compose_plan");
    expect(stageNames).toContain("verify_plan");
    expect(stageNames).toContain("build_trace");

    // Assert every recommendation cites valid evidence
    for (const rec of result.recommendations) {
      expect(rec.evidenceIds.length).toBeGreaterThan(0);
    }
  });

  it("halts immediately on danger signs and skips downstream stages", async () => {
    const dangerPersona = demoData.personas.find((p) => p.id === "danger-sign-demo")!;
    const submission = DaySubmissionSchema.parse({
      symptoms: dangerPersona.symptoms,
      context: dangerPersona.context,
      events: dangerPersona.events,
      dangerSignsSelected: dangerPersona.dangerSigns,
    });

    const result = await runAnalysisPipeline(submission, new DeterministicProvider());

    expect(result.status).toBe("emergency_halt");
    expect(result.safety.dangerSignsDetected).toBe(true);
    expect(result.recommendations).toHaveLength(0);

    const safetyStage = result.trace.find((s) => s.name === "safety_check");
    expect(safetyStage?.status).toBe("halted");

    const skippedStages = result.trace.filter((s) => s.status === "skipped");
    expect(skippedStages.length).toBeGreaterThanOrEqual(4);
  });
});
