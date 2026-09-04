export const BANNED_PHRASES = [
  "you are safe",
  "medically safe",
  "it is safe to",
  "you are recovered",
  "fully recovered",
  "return to sport",
  "cleared to",
  "safe to drive",
  "you should take",
  "diagnos",
  "prescri",
  "treatment plan",
  "recovery budget",
  "guaranteed",
  "will heal",
  "cure",
] as const;

export function findBannedPhrases(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched: string[] = [];

  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) {
      matched.push(phrase);
    }
  }

  return matched;
}

export function containsBannedLanguage(text: string): boolean {
  return findBannedPhrases(text).length > 0;
}

export function assertNoBannedLanguage(text: string): void {
  const matched = findBannedPhrases(text);
  if (matched.length > 0) {
    throw new Error(
      `Safety violation: text contains banned pseudo-clinical phrase(s): ${matched.join(", ")}`
    );
  }
}
