"use client";

import React from "react";
import { DayEvent } from "@/lib/contracts/day";
import { classifyActivityRisk } from "@/lib/safety/restrictedActivities";

export interface EventBlockProps {
  event: DayEvent;
  onEdit: (event: DayEvent) => void;
  onDelete: (id: string) => void;
  className?: string;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const EventBlock: React.FC<EventBlockProps> = ({
  event,
  onEdit,
  onDelete,
  className = "",
}) => {
  const riskClass = classifyActivityRisk(event.category, event.label);
  const isRestricted = riskClass === "restricted";
  const startStr = formatMinutes(event.startMinutes);
  const endStr = formatMinutes(event.startMinutes + event.durationMinutes);

  return (
    <div
      className={`event-block ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: `1px solid ${isRestricted ? "var(--danger)" : "var(--hairline-strong)"}`,
        borderLeft: isRestricted ? "4px solid var(--danger)" : "4px solid var(--axis-cognitive)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        transition: "all var(--transition-fast)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: isRestricted ? "var(--danger)" : "var(--axis-cognitive)",
            }}
          >
            {startStr} – {endStr}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
          >
            ({event.durationMinutes}m)
          </span>
          {isRestricted && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                textTransform: "uppercase",
                padding: "1px 6px",
                backgroundColor: "var(--danger-surface)",
                color: "var(--danger)",
                border: "1px solid var(--danger-border)",
                borderRadius: "2px",
                fontWeight: 700,
              }}
            >
              🔒 Restricted Activity
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            type="button"
            onClick={() => onEdit(event)}
            aria-label={`Edit ${event.label}`}
            style={{
              minHeight: "44px",
              minWidth: "44px",
              padding: "0 var(--space-2)",
              backgroundColor: "transparent",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              color: "var(--ink)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            aria-label={`Delete ${event.label}`}
            style={{
              minHeight: "44px",
              minWidth: "44px",
              padding: "0 var(--space-2)",
              backgroundColor: "transparent",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              color: "var(--danger)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            Del
          </button>
        </div>
      </div>

      <div
        style={{
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "var(--ink)",
        }}
      >
        {event.label}
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "var(--space-1)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            padding: "2px 6px",
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline)",
            borderRadius: "2px",
            color: "var(--muted)",
          }}
        >
          {event.category.replace(/_/g, " ")}
        </span>

        {event.environment &&
          event.environment.map((env) => (
            <span
              key={env}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                padding: "2px 6px",
                backgroundColor: "rgba(196, 123, 72, 0.1)",
                border: "1px solid rgba(196, 123, 72, 0.3)",
                color: "var(--axis-sensory)",
                borderRadius: "2px",
              }}
            >
              +{env}
            </span>
          ))}
      </div>

      {isRestricted && (
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--danger)",
            margin: "var(--space-1) 0 0",
            lineHeight: 1.4,
          }}
        >
          Locked boundary: LumaLoad will not propose pacing modifications for this activity. Return-to-activity requires clinician clearance.
        </p>
      )}
    </div>
  );
};