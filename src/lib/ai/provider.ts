import { ActivityLoad, DayEvent, RecoveryContext, Symptoms } from "@/lib/contracts/day";
import { EvidenceRecord } from "@/lib/contracts/evidence";
import { Recommendation } from "@/lib/contracts/plan";

export interface StructureActivitiesResult {
  activityLoads: ActivityLoad[];
  modelUsed: string | null;
  usedFallback: boolean;
}

export interface ComposePlanResult {
  recommendations: Recommendation[];
  modelUsed: string | null;
  usedFallback: boolean;
}

export interface VerifyClaimResult {
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
}
