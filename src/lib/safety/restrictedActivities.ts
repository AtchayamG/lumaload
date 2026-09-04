import { ActivityCategory, RiskClass } from "@/lib/contracts/day";
import { getCategoryPrior } from "@/lib/load/priors";

const RESTRICTED_LABEL_PATTERNS = [
  /contact\s*sport/i,
  /collision/i,
  /football/i,
  /soccer/i,
  /rugby/i,
  /hockey/i,
  /lacrosse/i,
  /boxing/i,
  /martial\s*art/i,
  /sparring/i,
  /skat(e|ing|eboard)/i,
  /climb(ing)?/i,
  /boulder(ing)?/i,
  /cycl(e|ing)|bike\s*ride/i,
  /\bdriv(e|ing)\b/i,
  /heavy\s*machinery/i,
  /(swim|swimming).*alone|alone.*(swim|swimming)|solo\s*swim(ming)?/i,
  /high[- ]intensity/i,
  /crossfit/i,
  /sprint(ing)?/i,
  /fall[- ]risk/i,
];

const CLINICIAN_GUIDED_PATTERNS = [
  /light\s*exercise/i,
  /physical\s*therapy/i,
  /\bpt\s*session\b/i,
  /rehab\s*exercise/i,
  /supervised\s*walk/i,
];

export const CLINICIAN_BOUNDARY_COPY = {
  title: "Clinician-guided activity",
  badge: "Clinician clearance required",
  body: "LumaLoad does not provide clearance for this activity. Return to sport, driving, and other higher-risk activity requires approval and supervision from your healthcare provider.",
  citation: "CDC HEADS UP, Returning to Sports",
  evidenceId: "cdc-sports-001",
};

export function classifyActivityRisk(
  category: ActivityCategory,
  label: string = ""
): RiskClass {
  // Category-based check
  const prior = getCategoryPrior(category);
  if (prior.riskClass === "restricted") {
    return "restricted";
  }

  // Pattern-based check on label
  for (const pattern of RESTRICTED_LABEL_PATTERNS) {
    if (pattern.test(label)) {
      return "restricted";
    }
  }

  if (prior.riskClass === "clinician_guided") {
    return "clinician_guided";
  }

  for (const pattern of CLINICIAN_GUIDED_PATTERNS) {
    if (pattern.test(label)) {
      return "clinician_guided";
    }
  }

  return "normal_daily_activity";
}

export function isRestrictedEvent(category: ActivityCategory, label: string = ""): boolean {
  return classifyActivityRisk(category, label) === "restricted";
}
