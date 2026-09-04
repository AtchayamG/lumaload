"use client";

import React from "react";

export interface ConfidencePillProps {
  confidence: "high" | "moderate" | "low";
  className?: string;
}

export const ConfidencePill: React.FC<ConfidencePillProps> = ({
  confidence,
  className = "",
}) => {
  const styles = {
    high: {
      color: "var(--axis-cognitive)",
      bg: "rgba(30, 108, 115, 0.1)",
      border: "rgba(30, 108, 115, 0.3)",
      label: "High Confidence",
    },
    moderate: {
      color: "var(--axis-sensory)",
      bg: "rgba(196, 123, 72, 0.1)",
      border: "rgba(196, 123, 72, 0.3)",
      label: "Moderate Confidence",
    },
    low: {
      color: "var(--muted)",
      bg: "var(--canvas)",
      border: "var(--hairline-strong)",
      label: "Preliminary",
    },
  }[confidence] || {
    color: "var(--muted)",
    bg: "var(--canvas)",
    border: "var(--hairline)",
    label: confidence,
  };

  return (
    <span
      className={`confidence-pill ${className}`}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.6875rem",
        fontWeight: 700,
        textTransform: "uppercase",
        padding: "2px 8px",
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: "var(--radius-sm)",
        color: styles.color,
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: styles.color,
        }}
      />
      {styles.label}
    </span>
  );
};