"use client";

import React, { useState } from "react";
import {
  ActivityCategory,
  ActivityCategoryEnum,
  DayEvent,
  EnvironmentFactor,
  EnvironmentFactorEnum,
} from "@/lib/contracts/day";
import { Button } from "@/components/ui/Button";

export interface EventEditorProps {
  initialEvent?: DayEvent | null;
  onSave: (event: DayEvent) => void;
  onCancel: () => void;
  className?: string;
}

const CATEGORIES = ActivityCategoryEnum.options;
const ENVIRONMENTS = EnvironmentFactorEnum.options;

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map((v) => parseInt(v, 10) || 0);
  return Math.min(1439, Math.max(0, h * 60 + m));
}

export const EventEditor: React.FC<EventEditorProps> = ({
  initialEvent,
  onSave,
  onCancel,
  className = "",
}) => {
  const [label, setLabel] = useState(initialEvent?.label || "");
  const [timeStr, setTimeStr] = useState(
    minutesToTime(initialEvent?.startMinutes ?? 540)
  );
  const [duration, setDuration] = useState(initialEvent?.durationMinutes ?? 60);
  const [category, setCategory] = useState<ActivityCategory>(
    initialEvent?.category ?? "laptop_work"
  );
  const [environment, setEnvironment] = useState<EnvironmentFactor[]>(
    initialEvent?.environment ?? []
  );
  const [error, setError] = useState<string | null>(null);

  const toggleEnv = (env: EnvironmentFactor) => {
    if (environment.includes(env)) {
      setEnvironment(environment.filter((e) => e !== env));
    } else {
      setEnvironment([...environment, env]);
    }
  };

  const handleSave = () => {
    if (!label.trim()) {
      setError("Event label cannot be empty.");
      return;
    }

    const startMinutes = timeToMinutes(timeStr);
    const newEvent: DayEvent = {
      id: initialEvent?.id || `ev-${Date.now()}`,
      label: label.trim().slice(0, 80),
      startMinutes,
      durationMinutes: Math.max(5, Math.min(720, duration)),
      category,
      environment,
    };

    onSave(newEvent);
  };

  return (
    <div
      className={`event-editor-card ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--axis-cognitive)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-5)",
        marginBottom: "var(--space-4)",
      }}
    >
      <h4
        style={{
          fontSize: "1.0625rem",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "var(--space-3)",
        }}
      >
        {initialEvent ? "Edit Scheduled Event" : "Add Scheduled Event"}
      </h4>

      {error && (
        <div
          style={{
            padding: "var(--space-2) var(--space-3)",
            backgroundColor: "var(--danger-surface)",
            border: "1px solid var(--danger-border)",
            color: "var(--danger)",
            fontSize: "0.8125rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--space-3)",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {/* Label */}
        <div>
          <label
            htmlFor="event-label-input"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "var(--space-1)",
            }}
          >
            Activity Label (max 80 chars)
          </label>
          <input
            id="event-label-input"
            type="text"
            maxLength={80}
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Lab Team Meeting, Literature Review"
            style={{
              width: "100%",
              height: "44px",
              padding: "0 var(--space-3)",
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--radius-sm)",
              color: "var(--ink)",
              fontSize: "0.9375rem",
            }}
          />
        </div>

        {/* Start Time & Duration */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
          }}
        >
          <div>
            <label
              htmlFor="event-time-input"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "var(--space-1)",
              }}
            >
              Start Time (24h)
            </label>
            <input
              id="event-time-input"
              type="time"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                padding: "0 var(--space-3)",
                backgroundColor: "var(--canvas)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: "var(--radius-sm)",
                color: "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.9375rem",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="event-duration-input"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "var(--space-1)",
              }}
            >
              Duration (minutes)
            </label>
            <input
              id="event-duration-input"
              type="number"
              min={5}
              max={720}
              step={5}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10) || 30)}
              style={{
                width: "100%",
                height: "44px",
                padding: "0 var(--space-3)",
                backgroundColor: "var(--canvas)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: "var(--radius-sm)",
                color: "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.9375rem",
              }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="event-category-select"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "var(--space-1)",
            }}
          >
            Activity Category
          </label>
          <select
            id="event-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            style={{
              width: "100%",
              height: "44px",
              padding: "0 var(--space-3)",
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--radius-sm)",
              color: "var(--ink)",
              fontSize: "0.9375rem",
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Environmental Factors */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "var(--space-2)",
            }}
          >
            Environmental Demands (+0.4 per factor)
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            {ENVIRONMENTS.map((env) => {
              const checked = environment.includes(env);
              return (
                <button
                  key={env}
                  type="button"
                  onClick={() => toggleEnv(env)}
                  style={{
                    minHeight: "44px",
                    padding: "0 var(--space-3)",
                    backgroundColor: checked ? "rgba(196, 123, 72, 0.15)" : "var(--canvas)",
                    border: `1px solid ${checked ? "var(--axis-sensory)" : "var(--hairline)"}`,
                    borderRadius: "var(--radius-sm)",
                    color: checked ? "var(--axis-sensory)" : "var(--muted)",
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-mono)",
                    fontWeight: checked ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {checked ? "✓ " : "+"} {env}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--space-3)",
            marginTop: "var(--space-2)",
          }}
        >
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Activity
          </Button>
        </div>
      </div>
    </div>
  );
};