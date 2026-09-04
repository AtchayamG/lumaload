import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Precomputed Fixture Model Provenance & Quality Guard", () => {
  const precomputedDir = path.join(process.cwd(), "src/data/precomputed");
  const files = fs.readdirSync(precomputedDir).filter((f) => f.endsWith(".json"));

  it("verifies all precomputed fixtures have genuine provenance and zero fabricated model attributions", () => {
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const filePath = path.join(precomputedDir, file);
      const fixture = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const { fixtureId, modelUsed, response } = fixture;

      expect(response).toBeDefined();
      expect(response.trace).toBeInstanceOf(Array);

      // If modelUsed is non-null, ensure no deterministic engines produced it and no hardcoded 150ms durations
      if (modelUsed !== null) {
        for (const stage of response.trace) {
          const detail = (stage.detail || "").toLowerCase();

          // No trace stage detail may contain "deterministic rules engine" or "deterministic category priors"
          expect(detail).not.toContain("deterministic rules engine");
          expect(detail).not.toContain("deterministic category priors");

          // No model-kind stage may have a hardcoded 150ms duration
          if (stage.kind === "model") {
            expect(stage.durationMs).not.toBe(150);
            expect(stage.durationMs).toBeGreaterThan(0);
          }
        }
      } else {
        // When modelUsed is null, ensure NO stage (executed or skipped) is stamped as "model"
        for (const stage of response.trace) {
          expect(stage.kind).not.toBe("model");
        }
      }
    }
  });

  it("ensures every precomputed fixture either has >= 1 recommendation or explicitly encodes a designed state", () => {
    for (const file of files) {
      const filePath = path.join(precomputedDir, file);
      const fixture = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const { fixtureId, response } = fixture;

      if (response.status === "emergency_halt") {
        expect(response.recommendations).toHaveLength(0);
        expect(response.safety.dangerSignsDetected).toBe(true);
      } else {
        // Must either have >= 1 recommendation or explicitly encode a valid no-changes-needed state
        const hasRecommendations =
          Array.isArray(response.recommendations) && response.recommendations.length >= 1;
        const encodesNoChangesNeeded =
          response.status === "no_changes_needed" || response.noChangesNeeded === true;

        expect(hasRecommendations || encodesNoChangesNeeded).toBe(true);
      }
    }
  });
});
