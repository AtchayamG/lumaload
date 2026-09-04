import { ActivityLoad, DayEvent, Symptoms } from "@/lib/contracts/day";
import { CapacityAnalysis, PressurePoint } from "@/lib/contracts/plan";
import { computeEventLoad } from "./heuristics";
import {
  calculateCapacityBaseline,
  detectPressurePoints,
  TimePointDemand,
} from "./capacity";

export interface DayLoadProfile {
  activityLoads: ActivityLoad[];
  timeline: TimePointDemand[];
  capacity: CapacityAnalysis;
}

export const TIMELINE_START_MINUTES = 360; // 06:00
export const TIMELINE_END_MINUTES = 1380; // 23:00
export const SAMPLE_INTERVAL_MINUTES = 5;

export function aggregateDayLoad(
  events: DayEvent[],
  symptoms: Symptoms
): DayLoadProfile {
  // Step 1: Calculate load for each discrete event
  const activityLoads: ActivityLoad[] = events.map((event) => {
    const calc = computeEventLoad(event, symptoms);
    return {
      eventId: event.id,
      cognitive: calc.cognitive,
      sensory: calc.sensory,
      physical: calc.physical,
      reasonCodes: calc.reasonCodes,
      riskClass: calc.riskClass,
      confidence: calc.confidence,
      source: "deterministic_prior",
    };
  });

  const loadByEventId = new Map(activityLoads.map((l) => [l.eventId, l]));

  // Step 2: Sample timeline every 5 minutes from 06:00 to 23:00
  const timeline: TimePointDemand[] = [];

  for (
    let t = TIMELINE_START_MINUTES;
    t <= TIMELINE_END_MINUTES;
    t += SAMPLE_INTERVAL_MINUTES
  ) {
    let cog = 0;
    let sen = 0;
    let phy = 0;

    for (const event of events) {
      const eventEnd = event.startMinutes + event.durationMinutes;
      if (t >= event.startMinutes && t < eventEnd) {
        const load = loadByEventId.get(event.id);
        if (load) {
          cog += load.cognitive;
          sen += load.sensory;
          phy += load.physical;
        }
      }
    }

    const totalDemand = cog + sen + phy;
    timeline.push({
      timeMinutes: t,
      cognitive: Math.round(cog * 10) / 10,
      sensory: Math.round(sen * 10) / 10,
      physical: Math.round(phy * 10) / 10,
      totalDemand: Math.round(totalDemand * 10) / 10,
    });
  }

  // Step 3: Capacity Baseline & Pressure points
  const baseline = calculateCapacityBaseline(symptoms);
  const pressurePoints = detectPressurePoints(timeline, baseline);

  return {
    activityLoads,
    timeline,
    capacity: {
      baseline,
      pressurePoints,
    },
  };
}
