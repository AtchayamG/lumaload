import React from "react";
import { CLINICIAN_BOUNDARY_COPY } from "@/lib/safety/restrictedActivities";

export interface ClinicianBoundaryProps {
  activityLabel?: string;
  className?: string;
}

export const ClinicianBoundary: React.FC<ClinicianBoundaryProps> = ({
  activityLabel,
  className = "",
}) => {
  return (
    <div
      className={`clinician-boundary-card ${className}`}
      role="note"
      aria-label="Clinician-guided activity boundary"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderLeft: "4px solid var(--danger)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-4)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-2)",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--danger)",
            }}
            aria-hidden="true"
          />
          <strong
            style={{
              fontSize: "0.9375rem",
              fontFamily: "var(--font-sans)",
              color: "var(--ink)",
            }}
          >
            {activityLabel ? `Locked: ${activityLabel}` : CLINICIAN_BOUNDARY_COPY.title}
          </strong>
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            padding: "2px 6px",
            backgroundColor: "var(--danger-surface)",
            color: "var(--danger)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-sm)",
            fontWeight: 600,
          }}
        >
          {CLINICIAN_BOUNDARY_COPY.badge}
        </span>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: "var(--space-2)",
        }}
      >
        {CLINICIAN_BOUNDARY_COPY.body}
      </p>

      <div
        style={{
          fontSize: "0.75rem",
          fontFamily: "var(--font-mono)",
          color: "var(--axis-cognitive)",
        }}
      >
        Source: {CLINICIAN_BOUNDARY_COPY.citation}
      </div>
    </div>
  );
};
