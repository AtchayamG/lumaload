import React from "react";
import { CDC_DANGER_SIGNS } from "@/lib/safety/dangerSigns";

export interface DangerSignChecklistProps {
  selectedSigns: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export const DangerSignChecklist: React.FC<DangerSignChecklistProps> = ({
  selectedSigns,
  onChange,
  className = "",
}) => {
  const handleToggle = (sign: string) => {
    if (selectedSigns.includes(sign)) {
      onChange(selectedSigns.filter((s) => s !== sign));
    } else {
      onChange([...selectedSigns, sign]);
    }
  };

  return (
    <div
      className={`danger-sign-checklist ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--danger-border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-6)",
        marginBottom: "var(--space-6)",
      }}
    >
      <div style={{ marginBottom: "var(--space-4)" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "var(--danger)",
            padding: "2px 8px",
            backgroundColor: "var(--danger-surface)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--space-2)",
          }}
        >
          CDC Danger Signs Screen
        </div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "var(--space-2)",
          }}
        >
          Do you or the person recovering have any of the following?
        </h2>
        <p style={{ fontSize: "0.9375rem", color: "var(--muted)", lineHeight: 1.5 }}>
          If any of these signs are present, normal planning is stopped immediately to
          direct you to emergency medical care.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {CDC_DANGER_SIGNS.map((sign, idx) => {
          const isChecked = selectedSigns.includes(sign);
          return (
            <label
              key={idx}
              htmlFor={`danger-sign-${idx}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-3)",
                padding: "var(--space-3)",
                backgroundColor: isChecked ? "var(--danger-surface)" : "var(--canvas)",
                border: `1px solid ${isChecked ? "var(--danger)" : "var(--hairline)"}`,
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              <input
                type="checkbox"
                id={`danger-sign-${idx}`}
                checked={isChecked}
                onChange={() => handleToggle(sign)}
                style={{
                  marginTop: "3px",
                  accentColor: "var(--danger)",
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.4,
                  color: isChecked ? "var(--danger)" : "var(--ink)",
                  fontWeight: isChecked ? 600 : 400,
                }}
              >
                {sign}
              </span>
            </label>
          );
        })}
      </div>

      <p
        style={{
          marginTop: "var(--space-4)",
          fontSize: "0.8125rem",
          color: "var(--muted)",
          fontStyle: "italic",
        }}
      >
        Source: Centers for Disease Control and Prevention (CDC) Mild TBI Danger Signs.
      </p>
    </div>
  );
};
