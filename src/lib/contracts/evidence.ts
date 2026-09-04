import { z } from "zod";

export const EvidenceSourceInfoSchema = z.object({
  organization: z.string(),
  title: z.string(),
  url: z.string().url(),
});

export type EvidenceSourceInfo = z.infer<typeof EvidenceSourceInfoSchema>;

export const EvidenceRecordSchema = z.object({
  id: z.string(),
  sourceKey: z.string(),
  title: z.string(),
  organization: z.string(),
  url: z.string().url(),
  claim: z.string(),
  allowedUses: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  lastReviewed: z.string().optional(),
});

export type EvidenceRecord = z.infer<typeof EvidenceRecordSchema>;

export const RawEvidenceChunkSchema = z.object({
  id: z.string(),
  sourceKey: z.string(),
  title: z.string(),
  claim: z.string(),
  allowedUses: z.array(z.string()).min(1),
  tags: z.array(z.string()),
});

export type RawEvidenceChunk = z.infer<typeof RawEvidenceChunkSchema>;

export const EvidenceRegistryFileSchema = z.object({
  $comment: z.string().optional(),
  lastReviewed: z.string(),
  sources: z.record(z.string(), EvidenceSourceInfoSchema),
  chunks: z.array(RawEvidenceChunkSchema),
});

export type EvidenceRegistryFile = z.infer<typeof EvidenceRegistryFileSchema>;
