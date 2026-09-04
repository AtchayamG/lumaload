import React from "react";

export interface SafetyGateProps {
  clinicianSeen: boolean;
  onClinicianSeenChange: (seen: boolean) => void;
  className?: string;
}

export const SafetyGate: React.FC<SafetyGateProps> = ({
  clinicianSeen,
  onClinicianSeenChange,
  className = "",
}) => {
  return (
    <div
      className={`safety-gate-card ${className}`}
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
        Step 1: Clinical Gate
      </div>

      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "var(--space-2)",
        }}
      >
        Has a healthcare professional evaluated this head injury?
      </h3>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: "var(--space-4)",
        }}
      >
        LumaLoad is a daily planning aid for recovery after diagnosis. It does
        not replace formal medical evaluation. If you have not seen a doctor,
        please seek clinical assessment.
      </p>

      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <label
          htmlFor="clinician-seen-yes"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-4)",
            backgroundColor: clinicianSeen ? "var(--canvas)" : "var(--surface)",
            border: `1px solid ${clinicianSeen ? "var(--axis-cognitive)" : "var(--hairline)"}`,
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            id="clinician-seen-yes"
            name="clinicianSeen"
            checked={clinicianSeen}
            onChange={() => onClinicianSeenChange(true)}
            style={{ accentColor: "var(--axis-cognitive)" }}
          />
          <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
            Yes, evaluated by a clinician
          </span>
        </label>

        <label
          htmlFor="clinician-seen-no"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-4)",
            backgroundColor: !clinicianSeen ? "var(--warning-surface)" : "var(--surface)",
            border: `1px solid ${!clinicianSeen ? "var(--warning)" : "var(--hairline)"}`,
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            id="clinician-seen-no"
            name="clinicianSeen"
            checked={!clinicianSeen}
            onChange={() => onClinicianSeenChange(false)}
            style={{ accentColor: "var(--warning)" }}
          />
          <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
            Not yet evaluated by a clinician
          </span>
        </label>
      </div>

      {!clinicianSeen && (
        <div
          role="alert"
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-3) var(--space-4)",
            backgroundColor: "var(--warning-surface)",
            border: "1px solid var(--warning-border)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.875rem",
            color: "var(--ink)",
          }}
        >
          <strong>Important Advisory:</strong> We strongly urge obtaining a formal
          evaluation from a physician, athletic trainer, or neurologist before
          planning daily activities. Your clinician&apos;s directives always take precedence.
        </div>
      )}
    </div>
  );
};
