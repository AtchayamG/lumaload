import { z } from "zod";
import { ActivityLoadSchema } from "./day";
import { EvidenceRecordSchema } from "./evidence";
import { TraceStageSchema } from "./trace";

export const DemandReducedEnum = z.enum([
  "cognitive",
  "sensory",
  "physical",
  "capacity",
]);

export type DemandReduced = z.infer<typeof DemandReducedEnum>;

export const ConfidenceLevelEnum = z.enum(["high", "moderate", "low"]);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelEnum>;

export const RecommendationSchema = z.object({
  id: z.string(),
  action: z.string().max(220), // imperative, plain language
  rationale: z.string().max(400),
  targetEventIds: z.array(z.string()),
  demandReduced: z.array(DemandReducedEnum).min(1),
  confidence: ConfidenceLevelEnum,
  evidenceIds: z.array(z.string()).min(1), // MUST be non-empty
  whatWeInferred: z.string().max(300),
  whatWeDoNotKnow: z.string().max(300),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

export const PressurePointSeverityEnum = z.enum(["mild", "notable", "high"]);
export type PressurePointSeverity = z.infer<typeof PressurePointSeverityEnum>;

export const PressurePointSchema = z.object({
  startMinutes: z.number(),
  endMinutes: z.number(),
  severity: PressurePointSeverityEnum,
});

export type PressurePoint = z.infer<typeof PressurePointSchema>;

export const CapacityAnalysisSchema = z.object({
  baseline: z.number().min(0).max(1),
  pressurePoints: z.array(PressurePointSchema),
});

export type CapacityAnalysis = z.infer<typeof CapacityAnalysisSchema>;

export const SafetyAnalysisSchema = z.object({
  dangerSignsDetected: z.boolean(),
  dangerSignsSelected: z.array(z.string()),
  restrictedEventIds: z.array(z.string()),
  distressSignpostShown: z.boolean(),
});

export type SafetyAnalysis = z.infer<typeof SafetyAnalysisSchema>;

export const VerificationResultSchema = z.object({
  grounded: z.boolean(),
  boundaryPassed: z.boolean(),
  unsupportedClaimsRemoved: z.array(z.string()),
  bannedLanguageRemoved: z.array(z.string()),
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;

export const AnalysisResponseSchema = z.object({
  status: z.enum(["ok", "emergency_halt", "degraded"]),
  safety: SafetyAnalysisSchema,
  capacity: CapacityAnalysisSchema,
  activityLoads: z.array(ActivityLoadSchema),
  recommendations: z.array(RecommendationSchema).max(5),
  evidence: z.array(EvidenceRecordSchema),
  verification: VerificationResultSchema,
  trace: z.array(TraceStageSchema),
  modelUsed: z.string().nullable(), // null when deterministic fallback ran
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;
