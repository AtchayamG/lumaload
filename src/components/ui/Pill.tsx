import React from "react";

export interface PillProps {
  children: React.ReactNode;
  variant?: "cognitive" | "sensory" | "physical" | "capacity" | "danger" | "muted" | "warning";
  className?: string;
  size?: "sm" | "md";
}

export const Pill: React.FC<PillProps> = ({
  children,
  variant = "muted",
  className = "",
  size = "sm",
}) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    cognitive: {
      bg: "var(--surface)",
      text: "var(--axis-cognitive)",
      border: "var(--axis-cognitive)",
    },
    sensory: {
      bg: "var(--surface)",
      text: "var(--axis-sensory)",
      border: "var(--axis-sensory)",
    },
    physical: {
      bg: "var(--surface)",
      text: "var(--axis-physical)",
      border: "var(--axis-physical)",
    },
    capacity: {
      bg: "var(--surface)",
      text: "var(--axis-capacity)",
      border: "var(--axis-capacity)",
    },
    danger: {
      bg: "var(--danger-surface)",
      text: "var(--danger)",
      border: "var(--danger-border)",
    },
    warning: {
      bg: "var(--warning-surface)",
      text: "var(--warning)",
      border: "var(--warning-border)",
    },
    muted: {
      bg: "var(--surface)",
      text: "var(--muted)",
      border: "var(--hairline-strong)",
    },
  };

  const scheme = colorMap[variant] || colorMap.muted;
  const isSm = size === "sm";

  return (
    <span
      className={`luma-pill ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: isSm ? "2px 8px" : "4px 12px",
        fontSize: isSm ? "0.75rem" : "0.8125rem",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        borderRadius: "var(--radius-full)",
        backgroundColor: scheme.bg,
        color: scheme.text,
        border: `1px solid ${scheme.border}`,
      }}
    >
      {children}
    </span>
  );
};
