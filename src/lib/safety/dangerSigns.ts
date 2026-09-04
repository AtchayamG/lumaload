export const CDC_DANGER_SIGNS = [
  "A headache that gets worse and does not go away",
  "Repeated vomiting or nausea",
  "A seizure or convulsion",
  "Weakness, numbness, or decreased coordination",
  "Slurred speech",
  "Unusual behaviour, increased confusion, restlessness or agitation",
  "One pupil larger than the other, or double vision",
  "Loss of consciousness, drowsiness, or cannot be woken up",
] as const;

export type DangerSign = (typeof CDC_DANGER_SIGNS)[number];

export const EMERGENCY_STOP_MESSAGE =
  "Seek emergency medical care now. Call your local emergency number or go to the nearest emergency department.";

export const EMERGENCY_DISCLAIMER =
  "This list is not exhaustive. If you are worried about any symptom, seek care.";

export interface DangerCheckResult {
  hasDangerSigns: boolean;
  selectedSigns: string[];
}

export function evaluateDangerSigns(selected: string[] = []): DangerCheckResult {
  if (!selected || selected.length === 0) {
    return {
      hasDangerSigns: false,
      selectedSigns: [],
    };
  }

  const validSelected = selected.filter((sign) =>
    CDC_DANGER_SIGNS.includes(sign as DangerSign)
  );

  return {
    hasDangerSigns: validSelected.length > 0,
    selectedSigns: validSelected,
  };
}
