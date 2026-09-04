"use client";

import React from "react";

export interface ModelDisclosureProps {
  modelUsed: string | null;
  status: "ok" | "emergency_halt" | "degraded";
  className?: string;
}

export const ModelDisclosure: React.FC<ModelDisclosureProps> = ({
  modelUsed,
  status,
  className = "",
}) => {
  const isFallback = !modelUsed || status === "degraded";

  return (
    <div
      className={`model-disclosure-banner ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            padding: "2px 8px",
            backgroundColor: isFallback ? "rgba(196, 123, 72, 0.12)" : "rgba(30, 108, 115, 0.12)",
            color: isFallback ? "var(--axis-sensory)" : "var(--axis-cognitive)",
            border: `1px solid ${isFallback ? "rgba(196, 123, 72, 0.3)" : "rgba(30, 108, 115, 0.3)"}`,
            borderRadius: "var(--radius-sm)",
          }}
        >
          Model & Delegation Disclosure
        </span>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            color: "var(--muted)",
          }}
        >
          Engine: {isFallback ? "Deterministic Rules Engine" : modelUsed}
        </span>
      </div>

      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          backgroundColor: "var(--canvas)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "var(--ink)",
        }}
      >
        {isFallback ? (
          <span>
            Model unavailable or rate-limited — this recovery plan was produced by LumaLoad&apos;s deterministic rules engine using verified activity priors and guideline tags. Zero hallucination guarantee.
          </span>
        ) : (
          <span>
            Generated via {modelUsed} structured outputs, verified and purged by active verifier assertions before delivery.
          </span>
        )}
      </div>

      {/* Mandatory Non-Delegation Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "var(--space-3) var(--space-4)",
          backgroundColor: "rgba(30, 108, 115, 0.08)",
          border: "1px solid rgba(30, 108, 115, 0.25)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.875rem",
          fontWeight: 700,
          color: "var(--axis-cognitive)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span>🛡️</span>
        <span>No diagnostic, severity, or return-to-sport decision is delegated to AI.</span>
      </div>
    </div>
  );
};