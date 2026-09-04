import {
  ActivityCategory,
  DayEvent,
  EnvironmentFactor,
  RiskClass,
  Symptoms,
} from "@/lib/contracts/day";
import { getCategoryPrior } from "./priors";
import { classifyActivityRisk } from "@/lib/safety/restrictedActivities";

export interface CalculatedLoad {
  cognitive: number;
  sensory: number;
  physical: number;
  riskClass: RiskClass;
  reasonCodes: string[];
  confidence: number;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function calculateDurationMultiplier(durationMinutes: number): number {
  const raw = 1 + (durationMinutes - 45) / 180;
  return clamp(raw, 0.7, 1.6);
}

export function applyEnvironmentModifiers(
  base: { cognitive: number; sensory: number; physical: number },
  environment: EnvironmentFactor[]
): {
  cognitive: number;
  sensory: number;
  physical: number;
  reasonCodes: string[];
} {
  let cognitive = base.cognitive;
  let sensory = base.sensory;
  let physical = base.physical;
  const reasonCodes: string[] = [];

  for (const env of environment) {
    switch (env) {
      case "screen":
        cognitive += 0.4;
        sensory += 0.4;
        reasonCodes.push("env_screen_boost");
        break;
      case "crowded":
        sensory += 0.4;
        reasonCodes.push("env_crowded_boost");
        break;
      case "loud":
        sensory += 0.4;
        reasonCodes.push("env_loud_boost");
        break;
      case "bright":
        sensory += 0.4;
        reasonCodes.push("env_bright_boost");
        break;
      case "travel":
        sensory += 0.4;
        physical += 0.4;
        reasonCodes.push("env_travel_boost");
        break;
      case "quiet":
        sensory = Math.max(0, sensory - 0.3);
        reasonCodes.push("env_quiet_reduction");
        break;
      case "outdoors":
        // fresh air / gentle outdoor environment
        break;
    }
  }

  return { cognitive, sensory, physical, reasonCodes };
}

export function applySymptomSensitivity(
  load: { cognitive: number; sensory: number; physical: number },
  symptoms: Symptoms
): {
  cognitive: number;
  sensory: number;
  physical: number;
  reasonCodes: string[];
} {
  let cognitive = load.cognitive;
  let sensory = load.sensory;
  let physical = load.physical;
  const reasonCodes: string[] = [];

  if (symptoms.fogginess >= 6) {
    cognitive *= 1.2;
    reasonCodes.push("symptom_fogginess_sensitised");
  }

  if (symptoms.lightNoise >= 6) {
    sensory *= 1.25;
    reasonCodes.push("symptom_lightnoise_sensitised");
  }

  if (symptoms.fatigue >= 6) {
    physical *= 1.2;
    reasonCodes.push("symptom_fatigue_sensitised");
  }

  return {
    cognitive: clamp(Math.round(cognitive * 10) / 10, 0, 5),
    sensory: clamp(Math.round(sensory * 10) / 10, 0, 5),
    physical: clamp(Math.round(physical * 10) / 10, 0, 5),
    reasonCodes,
  };
}

export function computeEventLoad(
  event: DayEvent,
  symptoms: Symptoms
): CalculatedLoad {
  const prior = getCategoryPrior(event.category);
  const riskClass = classifyActivityRisk(event.category, event.label);
  const durMult = calculateDurationMultiplier(event.durationMinutes);

  // Step 1: Base prior with duration multiplier
  let cog = prior.cognitive * durMult;
  let sen = prior.sensory * durMult;
  let phy = prior.physical * durMult;

  const reasonCodes: string[] = [`prior_${event.category}`];
  if (durMult !== 1) {
    reasonCodes.push(durMult > 1 ? "duration_extended" : "duration_short");
  }

  // Step 2: Environment factor additions
  const envResult = applyEnvironmentModifiers(
    { cognitive: cog, sensory: sen, physical: phy },
    event.environment
  );
  cog = envResult.cognitive;
  sen = envResult.sensory;
  phy = envResult.physical;
  reasonCodes.push(...envResult.reasonCodes);

  // Step 3: Symptom sensitivities & clamp to 0-5
  const symResult = applySymptomSensitivity(
    { cognitive: cog, sensory: sen, physical: phy },
    symptoms
  );
  reasonCodes.push(...symResult.reasonCodes);

  return {
    cognitive: symResult.cognitive,
    sensory: symResult.sensory,
    physical: symResult.physical,
    riskClass,
    reasonCodes,
    confidence: 0.88,
  };
}
