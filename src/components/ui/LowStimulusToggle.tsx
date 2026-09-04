"use client";

import React, { useEffect } from "react";
import { useLowStimulus } from "@/lib/state/lowStimulus";

export interface LowStimulusToggleProps {
  className?: string;
}

export const LowStimulusToggle: React.FC<LowStimulusToggleProps> = ({
  className = "",
}) => {
  const { isLowStimulus, toggleLowStimulus, setLowStimulus } = useLowStimulus();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lumaload_low_stimulus");
      if (saved === "true") {
        setLowStimulus(true);
      }
    }
  }, [setLowStimulus]);

  return (
    <button
      type="button"
      onClick={toggleLowStimulus}
      className={`low-stimulus-toggle ${className}`}
      aria-pressed={isLowStimulus}
      aria-label="Toggle Low Stimulus Mode for reduced motion, calmer contrast, and visual ease"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "6px 12px",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--hairline-strong)",
        backgroundColor: isLowStimulus ? "var(--ink)" : "var(--surface)",
        color: isLowStimulus ? "var(--canvas)" : "var(--ink)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.8125rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all var(--transition-fast)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isLowStimulus ? "#779B6E" : "var(--muted)",
        }}
        aria-hidden="true"
      />
      <span>
        {isLowStimulus ? "Low Stimulus: ON" : "Low Stimulus Mode"}
      </span>
    </button>
  );
};
