import rawPriors from "@/data/activity-priors.json";
import { ActivityCategory, RiskClass } from "@/lib/contracts/day";

export interface CategoryPrior {
  cognitive: number;
  sensory: number;
  physical: number;
  riskClass: RiskClass;
  label: string;
}

export const CATEGORY_PRIORS: Record<ActivityCategory, CategoryPrior> =
  rawPriors.categories as Record<ActivityCategory, CategoryPrior>;

export function getCategoryPrior(category: ActivityCategory): CategoryPrior {
  const prior = CATEGORY_PRIORS[category];
  if (!prior) {
    return {
      cognitive: 1,
      sensory: 1,
      physical: 1,
      riskClass: "normal_daily_activity",
      label: category,
    };
  }
  return prior;
}

export function isRestrictedCategory(category: ActivityCategory): boolean {
  return getCategoryPrior(category).riskClass === "restricted";
}
