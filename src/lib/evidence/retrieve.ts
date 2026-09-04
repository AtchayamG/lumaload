import { DayEvent, Symptoms } from "@/lib/contracts/day";
import { EvidenceRecord } from "@/lib/contracts/evidence";
import { getAllEvidence } from "./registry";

export interface EvidenceScoreMatch {
  record: EvidenceRecord;
  score: number;
  matchedThemes: string[];
}

/**
 * Retrieves the top N most relevant evidence chunks based on the user's
 * symptom profile and submitted day events.
 */
export function retrieveRelevantEvidence(
  events: DayEvent[],
  symptoms: Symptoms,
  limit: number = 8
): EvidenceRecord[] {
  const allRecords = getAllEvidence();
  const scoredMatches: EvidenceScoreMatch[] = [];

  // Extract target themes from events
  const eventCategories = new Set(events.map((e) => e.category));
  const eventEnvironments = new Set(events.flatMap((e) => e.environment));
  const hasScreens = eventEnvironments.has("screen") || eventCategories.has("laptop_work") || eventCategories.has("video_meeting");
  const hasSchool = eventCategories.has("lecture_class") || events.some((e) => /class|lecture|school|study/i.test(e.label));
  const hasSports = eventCategories.has("contact_sport") || eventCategories.has("light_exercise");
  const hasCrowds = eventEnvironments.has("crowded") || eventEnvironments.has("loud");

  for (const record of allRecords) {
    let score = 1.0; // Base score for verified evidence
    const matchedThemes: string[] = [];

    // Tag matching against symptoms
    if (symptoms.lightNoise >= 5 && (record.tags.includes("sensory") || record.tags.includes("environment"))) {
      score += 3.0;
      matchedThemes.push("symptom_light_noise");
    }

    if (symptoms.fogginess >= 5 && (record.tags.includes("cognitive") || record.tags.includes("pacing"))) {
      score += 2.5;
      matchedThemes.push("symptom_fogginess");
    }

    if (symptoms.fatigue >= 5 && (record.tags.includes("physical") || record.tags.includes("pacing") || record.tags.includes("capacity"))) {
      score += 2.5;
      matchedThemes.push("symptom_fatigue");
    }

    if ((symptoms.mood >= 5 || symptoms.anxiety >= 5) && (record.tags.includes("mood") || record.tags.includes("anxiety") || record.tags.includes("capacity"))) {
      score += 3.5;
      matchedThemes.push("symptom_emotional_mood");
    }

    if (symptoms.sleepQuality <= 4 && (record.tags.includes("sleep") || record.tags.includes("capacity"))) {
      score += 3.0;
      matchedThemes.push("symptom_sleep_disruption");
    }

    // Tag matching against event context
    if (hasScreens && (record.tags.includes("screen") || record.allowedUses.includes("screen_breaks"))) {
      score += 3.0;
      matchedThemes.push("context_screen_exposure");
    }

    if (hasSchool && (record.tags.includes("school") || record.allowedUses.includes("cognitive_accommodation"))) {
      score += 2.5;
      matchedThemes.push("context_academic_school");
    }

    if (hasSports && (record.tags.includes("restricted") || record.tags.includes("clinician"))) {
      score += 4.0;
      matchedThemes.push("context_sport_boundary");
    }

    if (hasCrowds && (record.tags.includes("sensory") || record.allowedUses.includes("environment_modification"))) {
      score += 2.0;
      matchedThemes.push("context_sensory_crowding");
    }

    // Core pacing guidelines always receive a baseline relevance boost
    if (record.allowedUses.includes("pacing") || record.allowedUses.includes("gradual_activity")) {
      score += 1.5;
      matchedThemes.push("core_pacing");
    }

    scoredMatches.push({ record, score, matchedThemes });
  }

  // Sort descending by relevance score
  scoredMatches.sort((a, b) => b.score - a.score);

  return scoredMatches.slice(0, limit).map((m) => m.record);
}
