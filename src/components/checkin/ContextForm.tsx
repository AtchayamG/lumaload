"use client";

import React from "react";
import { RecoveryContext, RecoverySetting } from "@/lib/contracts/day";

export interface ContextFormProps {
  context: RecoveryContext;
  onChange: (updates: Partial<RecoveryContext>) => void;
  className?: string;
}

export const ContextForm: React.FC<ContextFormProps> = ({
  context,
  onChange,
  className = "",
}) => {
  const settings: { value: RecoverySetting; label: string }[] = [
    { value: "school", label: "School / University" },
    { value: "work", label: "Work / Professional" },
    { value: "both", label: "Both School & Work" },
    { value: "other", label: "Home / Other" },
  ];

  return (
    <div
      className={`recovery-context-form ${className}`}
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
          color: "var(--axis-cognitive)",
          padding: "2px 8px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-sm)",
          marginBottom: "var(--space-2)",
        }}
      >
        Recovery Context
      </div>

      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "var(--space-2)",
        }}
      >
        Current Environment & Coping
      </h2>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: "var(--space-5)",
        }}
      >
        These factors calibrate capacity heuristics and highlight safe pacing recommendations.
      </p>

      <div style={{ display: "grid", gap: "var(--space-5)" }}>
        {/* Days since injury */}
        <div>
          <label
            htmlFor="days-since-injury"
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "var(--ink)",
              marginBottom: "var(--space-2)",
            }}
          >
            Days since injury
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <input
              id="days-since-injury"
              type="number"
              min="0"
              max="365"
              value={context.daysSinceInjury ?? 0}
              onChange={(e) =>
                onChange({
                  daysSinceInjury: Math.max(0, Math.min(365, parseInt(e.target.value, 10) || 0)),
                })
              }
              style={{
                width: "120px",
                height: "44px",
                padding: "var(--space-2) var(--space-3)",
                backgroundColor: "var(--canvas)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: "var(--radius-sm)",
                color: "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontSize: "1rem",
              }}
            />
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              days post-concussion (e.g. 5 for early recovery, 14+ for subacute)
            </span>
          </div>
        </div>

        {/* Primary Setting */}
        <div>
          <label
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "var(--ink)",
              marginBottom: "var(--space-2)",
            }}
          >
            Primary recovery environment
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {settings.map((s) => {
              const isSelected = context.setting === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onChange({ setting: s.value })}
                  style={{
                    minHeight: "44px",
                    padding: "var(--space-3) var(--space-4)",
                    backgroundColor: isSelected ? "var(--canvas)" : "var(--surface)",
                    border: `1px solid ${isSelected ? "var(--axis-cognitive)" : "var(--hairline)"}`,
                    borderRadius: "var(--radius-sm)",
                    color: isSelected ? "var(--axis-cognitive)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      border: `2px solid ${isSelected ? "var(--axis-cognitive)" : "var(--muted)"}`,
                      backgroundColor: isSelected ? "var(--axis-cognitive)" : "transparent",
                    }}
                  />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Coping & Distress Checkbox */}
        <div
          style={{
            padding: "var(--space-4)",
            backgroundColor: context.feelingUnableToCope ? "rgba(196, 123, 72, 0.08)" : "var(--canvas)",
            border: `1px solid ${context.feelingUnableToCope ? "var(--axis-sensory)" : "var(--hairline)"}`,
            borderRadius: "var(--radius-sm)",
          }}
        >
          <label
            htmlFor="feeling-unable-to-cope"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--space-3)",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            <input
              id="feeling-unable-to-cope"
              type="checkbox"
              checked={context.feelingUnableToCope}
              onChange={(e) => onChange({ feelingUnableToCope: e.target.checked })}
              style={{
                marginTop: "4px",
                width: "18px",
                height: "18px",
                accentColor: "var(--axis-cognitive)",
                cursor: "pointer",
              }}
            />
            <div>
              <span
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "var(--ink)",
                }}
              >
                I am currently feeling overwhelmed or unable to cope with daily demands
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  color: "var(--muted)",
                  marginTop: "2px",
                }}
              >
                Triggers compassionate mental health resources and supportive pacing recommendations.
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};