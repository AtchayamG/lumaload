import { z } from "zod";

export const ActivityCategoryEnum = z.enum([
  "quiet_rest",
  "sleep",
  "short_walk",
  "reading",
  "laptop_work",
  "lecture_class",
  "video_meeting",
  "commute_transit",
  "errand_shopping",
  "social_quiet",
  "social_crowded",
  "light_exercise",
  "household_chores",
  "meal",
  "screen_leisure",
  "driving",
  "contact_sport",
]);

export type ActivityCategory = z.infer<typeof ActivityCategoryEnum>;

export const EnvironmentFactorEnum = z.enum([
  "screen",
  "crowded",
  "loud",
  "bright",
  "travel",
  "outdoors",
  "quiet",
]);

export type EnvironmentFactor = z.infer<typeof EnvironmentFactorEnum>;

export const SymptomsSchema = z.object({
  headache: z.number().int().min(0).max(10),
  dizziness: z.number().int().min(0).max(10),
  lightNoise: z.number().int().min(0).max(10),
  fogginess: z.number().int().min(0).max(10),
  fatigue: z.number().int().min(0).max(10),
  mood: z.number().int().min(0).max(10), // irritability / low mood
  anxiety: z.number().int().min(0).max(10),
  sleepQuality: z.number().int().min(0).max(10), // 0 = slept very poorly
});

export type Symptoms = z.infer<typeof SymptomsSchema>;

export const RecoverySettingEnum = z.enum(["school", "work", "both", "other"]);
export type RecoverySetting = z.infer<typeof RecoverySettingEnum>;

export const RecoveryContextSchema = z.object({
  daysSinceInjury: z.number().int().min(0).max(365).nullable(),
  setting: RecoverySettingEnum,
  clinicianSeen: z.boolean(),
  feelingUnableToCope: z.boolean().default(false),
});

export type RecoveryContext = z.infer<typeof RecoveryContextSchema>;

export const DayEventSchema = z.object({
  id: z.string(),
  label: z.string().max(80),
  startMinutes: z.number().int().min(0).max(1439),
  durationMinutes: z.number().int().min(5).max(720),
  category: ActivityCategoryEnum,
  environment: z.array(EnvironmentFactorEnum).default([]),
});

export type DayEvent = z.infer<typeof DayEventSchema>;

export const RiskClassEnum = z.enum([
  "normal_daily_activity",
  "clinician_guided",
  "restricted",
]);

export type RiskClass = z.infer<typeof RiskClassEnum>;

export const ActivityLoadSchema = z.object({
  eventId: z.string(),
  cognitive: z.number().min(0).max(5),
  sensory: z.number().min(0).max(5),
  physical: z.number().min(0).max(5),
  reasonCodes: z.array(z.string()),
  riskClass: RiskClassEnum,
  confidence: z.number().min(0).max(1),
  source: z.enum(["model", "deterministic_prior"]),
});

export type ActivityLoad = z.infer<typeof ActivityLoadSchema>;

export const DaySubmissionSchema = z.object({
  symptoms: SymptomsSchema,
  context: RecoveryContextSchema,
  dangerSignsSelected: z.array(z.string()).default([]),
  events: z.array(DayEventSchema).min(1),
});

export type DaySubmission = z.infer<typeof DaySubmissionSchema>;
