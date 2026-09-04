"use client";

import React from "react";
import { useSessionStore } from "@/lib/state/session";
import demoDays from "@/data/demo-days.json";

export interface DemoDayPickerProps {
  className?: string;
}

export const DemoDayPicker: React.FC<DemoDayPickerProps> = ({ className = "" }) => {
  const { activePersonaId, loadPersona } = useSessionStore();

  return (
    <div
      className={`demo-day-picker ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "0.8125rem",
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          color: "var(--muted)",
          textTransform: "uppercase",
          marginRight: "var(--space-1)",
        }}
      >
        Demo Profile:
      </span>

      {demoDays.personas.map((p) => {
        const isActive = activePersonaId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => loadPersona(p.id)}
            style={{
              padding: "var(--space-2) var(--space-3)",
              minHeight: "44px",
              backgroundColor: isActive ? "var(--ink)" : "var(--surface)",
              color: isActive ? "var(--canvas)" : "var(--ink)",
              border: `1px solid ${isActive ? "var(--ink)" : "var(--hairline-strong)"}`,
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span>{p.name}</span>
            {p.isFictional && (
              <span
                style={{
                  fontSize: "0.6875rem",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--canvas)",
                  color: isActive ? "#fff" : "var(--muted)",
                }}
              >
                Synthetic
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};