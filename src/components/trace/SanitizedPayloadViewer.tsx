"use client";

import React, { useState } from "react";
import { DayEvent } from "@/lib/contracts/day";
import { sanitizeEvents } from "@/lib/ai/sanitize";

export interface SanitizedPayloadViewerProps {
  rawEvents: DayEvent[];
  className?: string;
}

export const SanitizedPayloadViewer: React.FC<SanitizedPayloadViewerProps> = ({
  rawEvents,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { sanitizedEvents, tokensStrippedCount, details } = sanitizeEvents(rawEvents);

  const payloadInspection = {
    privacyNotice: "Zero personal health records or direct identifiers persisted or sent to LLM.",
    tokensStripped: tokensStrippedCount,
    sanitizedEventLabels: sanitizedEvents.map((e) => ({
      id: e.id,
      label: e.label,
      category: e.category,
      duration: `${e.durationMinutes}m`,
    })),
  };

  return (
    <div
      className={`sanitized-payload-viewer ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          marginBottom: "var(--space-3)",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--axis-cognitive)",
              display: "block",
              marginBottom: "2px",
            }}
          >
            Privacy Boundary Audit
          </span>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
            PII Sanitization & Scrubbing ({tokensStrippedCount} Tokens Stripped)
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          style={{
            padding: "var(--space-2) var(--space-3)",
            minHeight: "44px",
            backgroundColor: isOpen ? "var(--canvas)" : "transparent",
            border: `1px solid ${isOpen ? "var(--axis-cognitive)" : "var(--hairline)"}`,
            borderRadius: "var(--radius-sm)",
            color: "var(--axis-cognitive)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {isOpen ? "Hide Scrubbed Payload ▲" : "Inspect Sanitized Payload ▼"}
        </button>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--muted)",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {details} All email addresses, phone numbers, external web addresses, and numerical sequences resembling medical IDs are strictly purged by the deterministic Stage 1 sanitizer before prompting.
      </p>

      {isOpen && (
        <pre
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-4)",
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--ink)",
            overflowX: "auto",
            lineHeight: 1.4,
          }}
        >
          {JSON.stringify(payloadInspection, null, 2)}
        </pre>
      )}
    </div>
  );
};