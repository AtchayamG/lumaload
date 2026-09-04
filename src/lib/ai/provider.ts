import { ActivityLoad, DayEvent, RecoveryContext, Symptoms } from "@/lib/contracts/day";
import { EvidenceRecord } from "@/lib/contracts/evidence";
import { Recommendation } from "@/lib/contracts/plan";

export interface StructureActivitiesResult {
  activityLoads: ActivityLoad[];
  modelUsed: string | null;
  usedFallback: boolean;
  errorDetail?: string;
}

export interface ComposePlanResult {
  recommendations: Recommendation[];
  modelUsed: string | null;
  usedFallback: boolean;
  errorDetail?: string;
}

export interface VerifyClaimResult {
  verdict: "supported" | "overreaching";
  reason: string;
}

export interface VerifyBatchItem {
  id: string;
  action: string;
  rationale: string;
  citedClaims: string[];
}

export interface VerifyBatchResultItem {
  id: string;
  verdict: "supported" | "overreaching";
  reason: string;
}

export interface AIProvider {
  name: string;

  structureActivities(
    events: DayEvent[],
    symptoms: Symptoms
  ): Promise<StructureActivitiesResult>;

  composePlan(
    events: DayEvent[],
    symptoms: Symptoms,
    context: RecoveryContext,
    capacityBaseline: number,
    retrievedEvidence: EvidenceRecord[]
  ): Promise<ComposePlanResult>;

  verifyClaim(
    action: string,
    rationale: string,
    citedClaims: string[]
  ): Promise<VerifyClaimResult>;

  verifyClaimsBatch(
    items: VerifyBatchItem[]
  ): Promise<VerifyBatchResultItem[]>;
}
