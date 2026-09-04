"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export interface ModelDisclosureProps {
  modelUsed: string | null;
  status: "ok" | "emergency_halt" | "degraded";
  isPrecomputed?: boolean;
  onRerunLive?: () => void;
  rerunning?: boolean;
  className?: string;
}

export const ModelDisclosure: React.FC<ModelDisclosureProps> = ({
  modelUsed,
  status,
  isPrecomputed = false,
  onRerunLive,
  rerunning = false,
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
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "2px 8px",
              backgroundColor: isFallback
                ? "rgba(196, 123, 72, 0.12)"
                : isPrecomputed
                ? "rgba(124, 107, 138, 0.12)"
                : "rgba(30, 108, 115, 0.12)",
              color: isFallback
                ? "var(--axis-sensory)"
                : isPrecomputed
                ? "var(--axis-capacity)"
                : "var(--axis-cognitive)",
              border: `1px solid ${
                isFallback
                  ? "rgba(196, 123, 72, 0.3)"
                  : isPrecomputed
                  ? "rgba(124, 107, 138, 0.3)"
                  : "rgba(30, 108, 115, 0.3)"
              }`,
              borderRadius: "var(--radius-sm)",
            }}
          >
            Model & Delegation Disclosure
          </span>

          {isPrecomputed && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: isFallback ? "var(--axis-sensory)" : "var(--axis-cognitive)",
                padding: "2px 8px",
                backgroundColor: "var(--canvas)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {isFallback
                ? "Pre-computed with deterministic rules engine · 4 Sep 2026"
                : `Pre-computed with ${modelUsed} · 4 Sep 2026`}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--muted)",
            }}
          >
            Engine: {isFallback ? "Deterministic Rules Engine" : modelUsed}
          </span>

          {isPrecomputed && onRerunLive && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRerunLive}
              disabled={rerunning}
              style={{ minHeight: "44px" }}
            >
              {rerunning ? "Calling Model..." : "Re-run live ↻"}
            </Button>
          )}
        </div>
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
          lineHeight: 1.5,
        }}
      >
        {isFallback ? (
          <span>
            Pre-computed with LumaLoad&apos;s deterministic rules engine · 4 Sep 2026. Free-tier model quota was exhausted during the build window. The pipeline, evidence grounding, verification and safety gates are unchanged — none of them depend on a model. Click Re-run live to attempt a model call now.
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