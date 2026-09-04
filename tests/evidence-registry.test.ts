import { describe, it, expect } from "vitest";
import rawEvidence from "@/data/evidence.json";
import {
  getAllEvidence,
  getEvidenceById,
  getEvidenceSources,
} from "@/lib/evidence/registry";
import { EvidenceRecordSchema } from "@/lib/contracts/evidence";

const VERIFIED_URLS = [
  "https://www.cdc.gov/traumatic-brain-injury/signs-symptoms/index.html",
  "https://www.cdc.gov/traumatic-brain-injury/response/index.html",
  "https://www.cdc.gov/heads-up/guidelines/returning-to-school.html",
  "https://www.cdc.gov/heads-up/guidelines/returning-to-sports.html",
  "https://bjsm.bmj.com/content/57/11/695",
  "https://www.concussionalliance.org/recovery-guide",
];

describe("Evidence Registry", () => {
  it("loads all chunks successfully and conforms to schema", () => {
    const records = getAllEvidence();
    expect(records.length).toBeGreaterThanOrEqual(16);
    expect(records.length).toBeLessThanOrEqual(25);

    for (const record of records) {
      const parsed = EvidenceRecordSchema.safeParse(record);
      expect(parsed.success).toBe(true);
    }
  });

  it("every chunk has a unique id", () => {
    const records = getAllEvidence();
    const ids = records.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(records.length);
  });

  it("every chunk has a sourceKey present in the source table", () => {
    const sources = getEvidenceSources();
    const sourceKeys = Object.keys(sources);
    const records = getAllEvidence();

    for (const record of records) {
      expect(sourceKeys).toContain(record.sourceKey);
      expect(record.organization).toBeTruthy();
    }
  });

  it("every chunk has a non-empty claim and at least one allowedUse", () => {
    const records = getAllEvidence();
    for (const record of records) {
      expect(record.claim.trim().length).toBeGreaterThan(10);
      expect(record.allowedUses.length).toBeGreaterThanOrEqual(1);
      expect(record.tags.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every chunk resolves to a URL that starts with one of the six verified URLs", () => {
    const records = getAllEvidence();
    for (const record of records) {
      const matchesVerified = VERIFIED_URLS.some((vUrl) =>
        record.url.startsWith(vUrl)
      );
      expect(matchesVerified).toBe(true);
    }
  });

  it("lookup by id works accurately", () => {
    const record = getEvidenceById("cdc-recovery-002");
    expect(record).toBeDefined();
    expect(record?.organization).toBe("CDC");
    expect(record?.allowedUses).toContain("gradual_activity");
  });
});
