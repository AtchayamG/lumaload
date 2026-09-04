import { z } from "zod";

export const TraceStageStatusEnum = z.enum([
  "ok",
  "skipped",
  "halted",
  "failed",
  "fallback",
]);

export type TraceStageStatus = z.infer<typeof TraceStageStatusEnum>;

export const TraceStageKindEnum = z.enum(["deterministic", "model", "retrieval"]);

export type TraceStageKind = z.infer<typeof TraceStageKindEnum>;

export const TraceStageSchema = z.object({
  name: z.string(),
  status: TraceStageStatusEnum,
  startedAt: z.number(),
  durationMs: z.number(),
  kind: TraceStageKindEnum,
  detail: z.string(),
  itemsIn: z.number().optional(),
  itemsOut: z.number().optional(),
});

export type TraceStage = z.infer<typeof TraceStageSchema>;
