"use client";

import React from "react";
import { TraceStage } from "@/lib/contracts/trace";

export interface TraceStageItemProps {
  stage: TraceStage;
  stepNumber: number;
  className?: string;
}

export const TraceStageItem: React.FC<TraceStageItemProps> = ({
  stage,
  stepNumber,
  className = "",
}) => {
  const kindColors = {
    deterministic: { bg: "rgba(93, 106, 108, 0.1)", text: "var(--muted)", border: "var(--hairline-strong)" },
    model: { bg: "rgba(30, 108, 115, 0.1)", text: "var(--axis-cognitive)", border: "rgba(30, 108, 115, 0.3)" },
    retrieval: { bg: "rgba(196, 123, 72, 0.1)", text: "var(--axis-sensory)", border: "rgba(196, 123, 72, 0.3)" },
  }[stage.kind];

  const statusColors = {
    ok: { bg: "rgba(93, 123, 85, 0.12)", text: "var(--axis-physical)", border: "rgba(93, 123, 85, 0.3)" },
    fallback: { bg: "rgba(196, 123, 72, 0.15)", text: "var(--axis-sensory)", border: "rgba(196, 123, 72, 0.4)" },
    halted: { bg: "var(--danger-surface)", text: "var(--danger)", border: "var(--danger-border)" },
    skipped: { bg: "var(--canvas)", text: "var(--muted)", border: "var(--hairline)" },
    failed: { bg: "var(--danger-surface)", text: "var(--danger)", border: "var(--danger-border)" },
  }[stage.status];

  return (
    <div
      className={`trace-stage-item ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
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
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--muted)",
            }}
          >
            0{stepNumber}.
          </span>
          <strong
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9375rem",
              color: "var(--ink)",
            }}
          >
            {stage.name}
          </strong>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              padding: "1px 6px",
              borderRadius: "2px",
              backgroundColor: kindColors.bg,
              color: kindColors.text,
              border: `1px solid ${kindColors.border}`,
            }}
          >
            {stage.kind}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: "2px",
              backgroundColor: statusColors.bg,
              color: statusColors.text,
              border: `1px solid ${statusColors.border}`,
            }}
          >
            {stage.status}
          </span>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--muted)",
              minWidth: "60px",
              textAlign: "right",
            }}
          >
            {stage.durationMs}ms
          </span>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "0.875rem",
          color: "var(--muted)",
          lineHeight: 1.5,
        }}
      >
        {stage.detail}
      </p>

      {(stage.itemsIn !== undefined || stage.itemsOut !== undefined) && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            marginTop: "2px",
          }}
        >
          {stage.itemsIn !== undefined && `Items in: ${stage.itemsIn}`}
          {stage.itemsIn !== undefined && stage.itemsOut !== undefined && " → "}
          {stage.itemsOut !== undefined && `Items out: ${stage.itemsOut}`}
        </div>
      )}
    </div>
  );
};