import React from "react";

export interface SliderProps {
  id: string;
  label: string;
  sublabel?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  minLabel?: string;
  maxLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  label,
  sublabel,
  min = 0,
  max = 10,
  step = 1,
  value,
  onChange,
  className = "",
  minLabel = "0 (None)",
  maxLabel = "10 (Severe)",
}) => {
  return (
    <div
      className={`luma-slider-field ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        padding: "var(--space-3) 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <label
            htmlFor={id}
            style={{
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "var(--ink)",
              display: "block",
            }}
          >
            {label}
          </label>
          {sublabel && (
            <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
              {sublabel}
            </span>
          )}
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.125rem",
            fontWeight: 700,
            padding: "2px 8px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-sm)",
            color: value >= 7 ? "var(--danger)" : value >= 4 ? "var(--axis-sensory)" : "var(--ink)",
          }}
        >
          {value}
        </span>
      </div>

      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: "8px",
          borderRadius: "var(--radius-sm)",
          accentColor: "var(--axis-cognitive)",
          cursor: "pointer",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          fontFamily: "var(--font-mono)",
          color: "var(--muted)",
        }}
      >
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};
