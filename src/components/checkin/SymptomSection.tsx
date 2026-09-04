"use client";

import React from "react";
import { Symptoms } from "@/lib/contracts/day";
import { Slider } from "@/components/ui/Slider";

export interface SymptomSectionProps {
  symptoms: Symptoms;
  onChange: (updates: Partial<Symptoms>) => void;
  className?: string;
}

export const SymptomSection: React.FC<SymptomSectionProps> = ({
  symptoms,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`symptom-section ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-6)",
        marginBottom: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "var(--axis-sensory)",
          padding: "2px 8px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-sm)",
          marginBottom: "var(--space-2)",
        }}
      >
        Step 3: Symptom Inventory
      </div>

      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "var(--space-2)",
        }}
      >
        Current Symptom Severity (0–10)
      </h2>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: "var(--space-5)",
        }}
      >
        Rate your current symptom levels. These determine your daily Capacity Baseline and calibrate activity demand multipliers.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-5)",
        }}
      >
        <Slider
          id="symptom-headache"
          label="Headache"
          sublabel="Pressure or ache in head"
          min={0}
          max={10}
          value={symptoms.headache}
          onChange={(v) => onChange({ headache: v })}
          minLabel="0 (None)"
          maxLabel="10 (Severe)"
        />

        <Slider
          id="symptom-dizziness"
          label="Dizziness / Balance"
          sublabel="Unsteadiness or motion sensation"
          min={0}
          max={10}
          value={symptoms.dizziness}
          onChange={(v) => onChange({ dizziness: v })}
          minLabel="0 (Steady)"
          maxLabel="10 (Severe)"
        />

        <Slider
          id="symptom-light-noise"
          label="Light & Noise Sensitivity"
          sublabel="Discomfort with screens, bright light, audio"
          min={0}
          max={10}
          value={symptoms.lightNoise}
          onChange={(v) => onChange({ lightNoise: v })}
          minLabel="0 (Tolerant)"
          maxLabel="10 (Intolerant)"
        />

        <Slider
          id="symptom-fogginess"
          label="Fogginess / Slowed Down"
          sublabel="Difficulty focusing or processing information"
          min={0}
          max={10}
          value={symptoms.fogginess}
          onChange={(v) => onChange({ fogginess: v })}
          minLabel="0 (Clear)"
          maxLabel="10 (Severe)"
        />

        <Slider
          id="symptom-fatigue"
          label="Physical & Cognitive Fatigue"
          sublabel="Energy depletion or physical exhaustion"
          min={0}
          max={10}
          value={symptoms.fatigue}
          onChange={(v) => onChange({ fatigue: v })}
          minLabel="0 (Rested)"
          maxLabel="10 (Exhausted)"
        />

        <Slider
          id="symptom-mood"
          label="Mood / Irritability"
          sublabel="Easily frustrated, emotional, or down"
          min={0}
          max={10}
          value={symptoms.mood}
          onChange={(v) => onChange({ mood: v })}
          minLabel="0 (Calm)"
          maxLabel="10 (Irritable)"
        />

        <Slider
          id="symptom-anxiety"
          label="Anxiety / Nervousness"
          sublabel="Feeling overwhelmed, nervous, or on edge"
          min={0}
          max={10}
          value={symptoms.anxiety}
          onChange={(v) => onChange({ anxiety: v })}
          minLabel="0 (Peaceful)"
          maxLabel="10 (Severe)"
        />

        <Slider
          id="symptom-sleep"
          label="Last Night's Sleep Quality"
          sublabel="Restfulness of sleep (higher = better rested)"
          min={0}
          max={10}
          value={symptoms.sleepQuality}
          onChange={(v) => onChange({ sleepQuality: v })}
          minLabel="0 (Poor / Broken)"
          maxLabel="10 (Sound / Deep)"
        />
      </div>
    </div>
  );
};