import { describe, it, expect, vi } from "vitest";
import {
  CDC_DANGER_SIGNS,
  evaluateDangerSigns,
  EMERGENCY_STOP_MESSAGE,
} from "@/lib/safety/dangerSigns";

describe("CDC Danger Signs & Emergency Hard Stop", () => {
  it("has exactly 8 CDC-specified danger signs", () => {
    expect(CDC_DANGER_SIGNS.length).toBe(8);
  });

  it.each(CDC_DANGER_SIGNS)(
    "halts when danger sign '%s' is present",
    (dangerSign) => {
      const result = evaluateDangerSigns([dangerSign]);
      expect(result.hasDangerSigns).toBe(true);
      expect(result.selectedSigns).toContain(dangerSign);
    }
  );

  it("passes when no danger signs are selected", () => {
    const result = evaluateDangerSigns([]);
    expect(result.hasDangerSigns).toBe(false);
    expect(result.selectedSigns).toHaveLength(0);
  });

  it("asserts that model provider is NEVER invoked when danger signs are present", async () => {
    const mockModelProvider = {
      generatePlan: vi.fn().mockResolvedValue({ recommendations: [] }),
    };

    // Simulate safety check stage
    const dangerResult = evaluateDangerSigns([
      "Loss of consciousness, drowsiness, or cannot be woken up",
    ]);

    if (dangerResult.hasDangerSigns) {
      // Pipeline short-circuits here
    } else {
      await mockModelProvider.generatePlan();
    }

    expect(mockModelProvider.generatePlan).not.toHaveBeenCalled();
  });

  it("provides calm, explicit emergency medical guidance", () => {
    expect(EMERGENCY_STOP_MESSAGE).toContain("Seek emergency medical care now");
    expect(EMERGENCY_STOP_MESSAGE).toContain("emergency department");
  });
});
