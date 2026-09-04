import React from "react";

export interface RibbonLegendProps {
  className?: string;
}

export const RibbonLegend: React.FC<RibbonLegendProps> = ({ className = "" }) => {
  return (
    <div
      className={`ribbon-legend ${className}`}
      role="region"
      aria-label="Load Ribbon Legend"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-4)",
        alignItems: "center",
        fontSize: "0.875rem",
        color: "var(--muted)",
        padding: "var(--space-2) 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <span
          aria-hidden="true"
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--axis-cognitive)",
            display: "inline-block",
          }}
        />
        <span>Cognitive</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <span
          aria-hidden="true"
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--axis-sensory)",
            display: "inline-block",
          }}
        />
        <span>Sensory</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <span
          aria-hidden="true"
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--axis-physical)",
            display: "inline-block",
          }}
        />
        <span>Physical</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <span
          aria-hidden="true"
          style={{
            width: "14px",
            height: "8px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--axis-capacity)",
            display: "inline-block",
            opacity: 0.6,
          }}
        />
        <span>Capacity Baseline</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <span
          aria-hidden="true"
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "var(--radius-sm)",
            border: "1px dashed var(--danger)",
            background:
              "repeating-linear-gradient(45deg, var(--danger-surface), var(--danger-surface) 3px, var(--danger-border) 3px, var(--danger-border) 6px)",
            display: "inline-block",
          }}
        />
        <span>Pressure Point</span>
      </div>
    </div>
  );
};
