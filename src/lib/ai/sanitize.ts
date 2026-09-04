import { DayEvent } from "@/lib/contracts/day";

// PII & sensitive data patterns
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
const LONG_DIGIT_REGEX = /\b\d{5,}\b/g;
const SENSITIVE_TOKEN_REGEX = /\b(?:dr\.|doctor|mr\.|mrs\.|ms\.|prof\.|professor)\s+[A-Za-z]+/gi;

export interface SanitizationResult {
  sanitizedEvents: DayEvent[];
  tokensStrippedCount: number;
  details: string;
}

/**
 * Deterministically strips emails, phone numbers, external URLs, long digit runs,
 * and person names from event labels before sending payloads to any AI model.
 */
export function sanitizeEventLabel(label: string): {
  cleanLabel: string;
  removedTokens: number;
} {
  let clean = label;
  let removed = 0;

  clean = clean.replace(EMAIL_REGEX, () => {
    removed++;
    return "[redacted-email]";
  });

  clean = clean.replace(PHONE_REGEX, () => {
    removed++;
    return "[redacted-phone]";
  });

  clean = clean.replace(URL_REGEX, () => {
    removed++;
    return "[redacted-link]";
  });

  clean = clean.replace(LONG_DIGIT_REGEX, () => {
    removed++;
    return "[redacted-id]";
  });

  clean = clean.replace(SENSITIVE_TOKEN_REGEX, () => {
    removed++;
    return "[redacted-name]";
  });

  return { cleanLabel: clean.trim(), removedTokens: removed };
}

export function sanitizeEvents(events: DayEvent[]): SanitizationResult {
  let totalStripped = 0;

  const sanitizedEvents = events.map((event) => {
    const { cleanLabel, removedTokens } = sanitizeEventLabel(event.label);
    totalStripped += removedTokens;
    return {
      ...event,
      label: cleanLabel,
    };
  });

  return {
    sanitizedEvents,
    tokensStrippedCount: totalStripped,
    details: `Sanitized ${events.length} event labels; ${totalStripped} sensitive token(s) removed.`,
  };
}
