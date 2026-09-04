import rawEvidenceData from "@/data/evidence.json";
import {
  EvidenceRecord,
  EvidenceRegistryFile,
  EvidenceRegistryFileSchema,
  EvidenceSourceInfo,
} from "@/lib/contracts/evidence";

const parsedData: EvidenceRegistryFile = EvidenceRegistryFileSchema.parse(rawEvidenceData);

const evidenceRecords: EvidenceRecord[] = parsedData.chunks.map((chunk) => {
  const source = parsedData.sources[chunk.sourceKey];
  if (!source) {
    throw new Error(`Evidence chunk ${chunk.id} references unknown sourceKey: ${chunk.sourceKey}`);
  }
  return {
    id: chunk.id,
    sourceKey: chunk.sourceKey,
    title: chunk.title,
    organization: source.organization,
    url: source.url,
    claim: chunk.claim,
    allowedUses: chunk.allowedUses,
    tags: chunk.tags,
    lastReviewed: parsedData.lastReviewed,
  };
});

const recordsById = new Map<string, EvidenceRecord>(
  evidenceRecords.map((rec) => [rec.id, rec])
);

export function getAllEvidence(): EvidenceRecord[] {
  return evidenceRecords;
}

export function getEvidenceById(id: string): EvidenceRecord | undefined {
  return recordsById.get(id);
}

export function getEvidenceSources(): Record<string, EvidenceSourceInfo> {
  return parsedData.sources;
}

export function isValidEvidenceId(id: string): boolean {
  return recordsById.has(id);
}

export function getEvidenceForAllowedUse(allowedUse: string): EvidenceRecord[] {
  return evidenceRecords.filter((rec) => rec.allowedUses.includes(allowedUse));
}

export function getEvidenceForTag(tag: string): EvidenceRecord[] {
  return evidenceRecords.filter((rec) => rec.tags.includes(tag));
}
