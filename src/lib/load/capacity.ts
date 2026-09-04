import { Symptoms } from "@/lib/contracts/day";
import { PressurePoint, PressurePointSeverity } from "@/lib/contracts/plan";

export function clamp01(val: number): number {
  return Math.max(0, Math.min(1, val));
}

/**
 * Computes the Capacity Baseline (range 0.5 to 1.0) based on mood, anxiety, sleep, fatigue, fogginess.
 * The mental-health arm of LumaLoad.
 */
export function calculateCapacityBaseline(symptoms: Symptoms): number {
  const raw =
    1 -
    0.1 * (symptoms.fatigue / 10) -
    0.1 * (symptoms.fogginess / 10) -
    0.1 * (symptoms.mood / 10) -
    0.1 * (symptoms.anxiety / 10) -
    0.1 * ((10 - symptoms.sleepQuality) / 10);

  const clamped = clamp01(raw);
  return Math.round(clamped * 100) / 100;
}

export interface TimePointDemand {
  timeMinutes: number;
  cognitive: number;
  sensory: number;
  physical: number;
  totalDemand: number;
}

/**
 * Detects pressure point windows where totalDemand(t)/5 > capacity for >= 30 continuous minutes.
 * Severity classified by margin = (totalDemand/5) - capacity:
 *   < 0.15 => mild
 *   < 0.30 => notable
 *   >= 0.30 => high
 */
export function detectPressurePoints(
  timeline: TimePointDemand[],
  capacity: number
): PressurePoint[] {
  if (timeline.length === 0) return [];

  const points: PressurePoint[] = [];
  let inWindow = false;
  let windowStart = 0;
  let windowEnd = 0;
  let maxMargin = 0;

  for (let i = 0; i < timeline.length; i++) {
    const pt = timeline[i];
    const demandRatio = pt.totalDemand / 5;
    const isAbove = demandRatio > capacity;

    if (isAbove) {
      const margin = demandRatio - capacity;
      if (!inWindow) {
        inWindow = true;
        windowStart = pt.timeMinutes;
        windowEnd = pt.timeMinutes;
        maxMargin = margin;
      } else {
        windowEnd = pt.timeMinutes;
        if (margin > maxMargin) {
          maxMargin = margin;
        }
      }
    } else {
      if (inWindow) {
        const duration = windowEnd - windowStart;
        if (duration >= 30) {
          let severity: PressurePointSeverity = "high";
          if (maxMargin < 0.15) {
            severity = "mild";
          } else if (maxMargin < 0.3) {
            severity = "notable";
          }
          points.push({
            startMinutes: windowStart,
            endMinutes: windowEnd,
            severity,
          });
        }
        inWindow = false;
        maxMargin = 0;
      }
    }
  }

  // Final window at end of timeline
  if (inWindow) {
    const duration = windowEnd - windowStart;
    if (duration >= 30) {
      let severity: PressurePointSeverity = "high";
      if (maxMargin < 0.15) {
        severity = "mild";
      } else if (maxMargin < 0.3) {
        severity = "notable";
      }
      points.push({
        startMinutes: windowStart,
        endMinutes: windowEnd,
        severity,
      });
    }
  }

  return points;
}
