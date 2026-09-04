import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`luma-section-heading ${className}`} style={{ marginBottom: "var(--space-6)" }}>
      {eyebrow && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--axis-cognitive)",
            display: "block",
            marginBottom: "var(--space-1)",
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--ink)",
          letterSpacing: "-0.02em",
          marginBottom: description ? "var(--space-2)" : 0,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            maxWidth: "760px",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
