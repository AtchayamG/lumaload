import React from "react";

export interface DisclaimerProps {
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = "" }) => {
  return (
    <div
      className={`medical-disclaimer-card ${className}`}
      role="note"
      aria-label="Medical Planning Aid Disclaimer"
      style={{
        padding: "var(--space-4)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.8125rem",
        color: "var(--muted)",
        lineHeight: 1.5,
      }}
    >
      <strong style={{ color: "var(--ink)", display: "inline-block", marginRight: "4px" }}>
        Medical Disclaimer:
      </strong>
      LumaLoad is a planning aid, not a medical device. It does not diagnose,
      treat, or provide medical clearance. Your healthcare professional&apos;s
      instructions always take priority.
    </div>
  );
};
