import React from "react";
import { DISTRESS_SIGNPOST_COPY } from "@/lib/safety/distress";

export interface DistressSignpostProps {
  className?: string;
}

export const DistressSignpost: React.FC<DistressSignpostProps> = ({
  className = "",
}) => {
  return (
    <aside
      className={`distress-signpost ${className}`}
      role="complementary"
      aria-label="Emotional recovery and distress resources"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderLeft: "4px solid var(--axis-capacity)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-5)",
        marginBottom: "var(--space-6)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          marginBottom: "var(--space-2)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "2px 8px",
            backgroundColor: "var(--surface)",
            color: "var(--axis-capacity)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            fontWeight: 600,
          }}
        >
          {DISTRESS_SIGNPOST_COPY.title}
        </span>
      </div>

      <p
        style={{
          fontSize: "0.9375rem",
          lineHeight: 1.6,
          color: "var(--ink)",
          marginBottom: "var(--space-3)",
        }}
      >
        {DISTRESS_SIGNPOST_COPY.lead}{" "}
        Recovery is not just physical — emotional fluctuations are clinically
        recognized parts of concussion recovery. You do not have to manage this alone.
      </p>

      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "0.875rem",
          padding: "var(--space-3)",
          backgroundColor: "var(--canvas)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--hairline)",
        }}
      >
        <span>
          If you need confidential support now:{" "}
          <a
            href={DISTRESS_SIGNPOST_COPY.helplineUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600 }}
          >
            findahelpline.com (Global)
          </a>
          {" "}or call / text{" "}
          <strong style={{ color: "var(--ink)" }}>
            {DISTRESS_SIGNPOST_COPY.usHelpline}
          </strong>{" "}
          (US).
        </span>
      </div>

      <p
        style={{
          fontSize: "0.8125rem",
          color: "var(--muted)",
          marginTop: "var(--space-2)",
          fontStyle: "italic",
        }}
      >
        {DISTRESS_SIGNPOST_COPY.priorityNotice}
      </p>
    </aside>
  );
};
