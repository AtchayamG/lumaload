import { RecoveryContext, Symptoms } from "@/lib/contracts/day";

export const DISTRESS_SIGNPOST_COPY = {
  title: "Emotional support resources",
  lead: "Recovery can be emotionally heavy, and low mood, anxiety and irritability are recognised parts of concussion recovery.",
  body: "You do not have to manage this alone. If you are struggling, please talk to your healthcare professional — and if you need to talk to someone now, findahelpline.com lists free, confidential helplines in your country. In the US you can call or text 988.",
  priorityNotice: "Your healthcare professional's instructions always take priority.",
  helplineUrl: "https://findahelpline.com",
  usHelpline: "988",
};

export function shouldShowDistressSignpost(
  symptoms: Symptoms,
  context?: RecoveryContext
): boolean {
  if (symptoms.mood >= 8 || symptoms.anxiety >= 8) {
    return true;
  }

  if (context?.feelingUnableToCope) {
    return true;
  }

  return false;
}
