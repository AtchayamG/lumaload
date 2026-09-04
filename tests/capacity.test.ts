import { describe, it, expect } from "vitest";
import demoData from "@/data/demo-days.json";
import { Symptoms, DayEventSchema } from "@/lib/contracts/day";
import { calculateCapacityBaseline } from "@/lib/load/capacity";
import { aggregateDayLoad } from "@/lib/load/aggregate";

describe("Capacity Engine & Pressure Points", () => {
  it("capacity monotonically decreases as symptoms worsen", () => {
    const baseSymptoms: Symptoms = {
      headache: 0,
      dizziness: 0,
      lightNoise: 0,
      fogginess: 0,
      fatigue: 0,
      mood: 0,
      anxiety: 0,
      sleepQuality: 10,
    };

    const initialCapacity = calculateCapacityBaseline(baseSymptoms);
    expect(initialCapacity).toBe(1.0);

    let prevCapacity = initialCapacity;

    // Incrementally increase fatigue
    for (let f = 1; f <= 10; f++) {
      const current = calculateCapacityBaseline({ ...baseSymptoms, fatigue: f });
      expect(current).toBeLessThanOrEqual(prevCapacity);
      prevCapacity = current;
    }

    // High symptom load
    const severeSymptoms: Symptoms = {
      headache: 8,
      dizziness: 8,
      lightNoise: 8,
      fogginess: 8,
      fatigue: 8,
      mood: 8,
      anxiety: 8,
      sleepQuality: 2,
    };
    const severeCapacity = calculateCapacityBaseline(severeSymptoms);
    expect(severeCapacity).toBeLessThan(0.7);
    expect(severeCapacity).toBeGreaterThanOrEqual(0.5);
  });

  it("detects pressure points on the Maya fixture including at least two high pressure points", () => {
    const maya = demoData.personas.find((p) => p.id === "maya-day-5");
    expect(maya).toBeDefined();
    if (!maya) return;

    const events = maya.events.map((e) => DayEventSchema.parse(e));
    const result = aggregateDayLoad(events, maya.symptoms);

    expect(result.capacity.baseline).toBeGreaterThanOrEqual(0.6);
    expect(result.capacity.baseline).toBeLessThanOrEqual(0.85);

    // Pressure points detected
    expect(result.capacity.pressurePoints.length).toBeGreaterThanOrEqual(2);

    const highPressurePoints = result.capacity.pressurePoints.filter(
      (p) => p.severity === "high"
    );
    expect(highPressurePoints.length).toBeGreaterThanOrEqual(2);

    // Confirm that afternoon cluster includes pressure points
    const afternoonPressurePoints = result.capacity.pressurePoints.filter(
      (p) => p.startMinutes >= 600 && p.endMinutes <= 1020
    );
    expect(afternoonPressurePoints.length).toBeGreaterThanOrEqual(1);
  });

  it("quieter Tuesday fixture produces fewer and lower severity pressure points", () => {
    const quiet = demoData.personas.find((p) => p.id === "quieter-tuesday");
    expect(quiet).toBeDefined();
    if (!quiet) return;

    const events = quiet.events.map((e) => DayEventSchema.parse(e));
    const result = aggregateDayLoad(events, quiet.symptoms);
    expect(result.capacity.baseline).toBeGreaterThanOrEqual(0.9);

    const highPoints = result.capacity.pressurePoints.filter(
      (p) => p.severity === "high"
    );
    expect(highPoints).toHaveLength(0);
  });
});
