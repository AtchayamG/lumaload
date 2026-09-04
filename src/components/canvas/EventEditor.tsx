"use client";

import React, { useState, useEffect } from "react";
import {
  ActivityCategory,
  DayEvent,
  EnvironmentFactor,
  EnvironmentFactorEnum,
} from "@/lib/contracts/day";
import { classifyActivityRisk } from "@/lib/safety/restrictedActivities";
import { Button } from "@/components/ui/Button";
import activityPriors from "@/data/activity-priors.json";

export interface EventEditorProps {
  initialEvent?: DayEvent | null;
  onSave: (event: DayEvent) => void;
  onCancel: () => void;
  className?: string;
}

const ENVIRONMENTS = EnvironmentFactorEnum.options;

const CATEGORY_LIST = Object.entries(activityPriors.categories).map(([key, data]) => ({
  value: key as ActivityCategory,
  label: (data as { label: string }).label,
  riskClass: (data as { riskClass: string }).riskClass,
}));

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

  useEffect(() => {
    if (initialEvent) {
      setLabel(initialEvent.label);
      setTimeStr(minutesToTime(initialEvent.startMinutes));
      setDuration(initialEvent.durationMinutes);
      setCategory(initialEvent.category);
      setEnvironment(initialEvent.environment || []);
    } else {
      setLabel("");
      setTimeStr("09:00");
      setDuration(60);
      setCategory("laptop_work");
      setEnvironment([]);
    }
  }, [initialEvent]);

  // Determine if initial event is restricted
  const isRestricted = initialEvent
    ? classifyActivityRisk(initialEvent.category, initialEvent.label) === "restricted"
    : false;

  const toggleEnv = (env: EnvironmentFactor) => {
    if (environment.includes(env)) {
      setEnvironment(environment.filter((e) => e !== env));
    } else {
      setEnvironment([...environment, env]);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!label.trim()) {
      setError("Please provide an activity label.");
      return;
    }

    const startMinutes = timeToMinutes(timeStr);
    const newEvent: DayEvent = {
      id: initialEvent?.id || `ev-${Date.now()}`,
      label: label.trim().slice(0, 80),
      startMinutes,
      durationMinutes: Math.max(5, Math.min(720, duration)),
      // If event was originally restricted, preserve its restricted status
      category: isRestricted ? initialEvent!.category : category,
      environment,
    };

    onSave(newEvent);
  };

  return (
    <form
      onSubmit={handleSave}
      className={`event-editor-form ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--axis-cognitive)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-5)",
        display: "grid",
        gap: "var(--space-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--hairline)",
          paddingBottom: "var(--space-2)",
        }}
      >
        <h4
          style={{
            fontSize: "1.0625rem",
            fontWeight: 700,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {initialEvent ? "Edit Scheduled Activity" : "Add New Scheduled Activity"}
        </h4>

        {isRestricted && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "2px 6px",
              backgroundColor: "var(--danger-surface)",
              color: "var(--danger)",
              border: "1px solid var(--danger-border)",
              borderRadius: "2px",
            }}
          >
            🔒 Clinician Locked
          </span>
        )}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "var(--space-2) var(--space-3)",
            backgroundColor: "var(--danger-surface)",
            border: "1px solid var(--danger-border)",
            color: "var(--danger)",
            fontSize: "0.8125rem",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {error}
        </div>
      )}

      {/* Activity Label */}
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
          Activity Label *
        </label>
        <input
          id="event-label-input"
          name="label"
          type="text"
          required
          maxLength={80}
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. Deep Work: Budget Review, Quiet Walk, Seminar"
          style={{
            width: "100%",
            minHeight: "44px",
            padding: "0 var(--space-3)",
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-sm)",
            color: "var(--ink)",
            fontSize: "0.9375rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "var(--space-1)",
          }}
        >
          <label
            htmlFor="event-category-select"
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            Activity Category *
          </label>
          {isRestricted && (
            <span style={{ fontSize: "0.75rem", color: "var(--danger)", fontWeight: 600 }}>
              Locked by clinician boundary — cannot change category
            </span>
          )}
        </div>

        <select
          id="event-category-select"
          name="category"
          value={category}
          disabled={isRestricted}
          onChange={(e) => setCategory(e.target.value as ActivityCategory)}
          style={{
            width: "100%",
            minHeight: "44px",
            padding: "0 var(--space-3)",
            backgroundColor: isRestricted ? "var(--surface)" : "var(--canvas)",
            border: `1px solid ${isRestricted ? "var(--danger-border)" : "var(--hairline-strong)"}`,
            borderRadius: "var(--radius-sm)",
            color: isRestricted ? "var(--danger)" : "var(--ink)",
            fontSize: "0.9375rem",
            boxSizing: "border-box",
            cursor: isRestricted ? "not-allowed" : "pointer",
          }}
        >
          {CATEGORY_LIST.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label} {c.riskClass === "restricted" ? "🔒 (Restricted)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Start Time & Duration */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
            Start Time (24h) *
          </label>
          <input
            id="event-time-input"
            name="startTime"
            type="time"
            required
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            style={{
              width: "100%",
              minHeight: "44px",
              padding: "0 var(--space-3)",
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--radius-sm)",
              color: "var(--ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9375rem",
              boxSizing: "border-box",
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
            Duration (min) *
          </label>
          <input
            id="event-duration-input"
            name="duration"
            type="number"
            min={5}
            max={720}
            step={5}
            required
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 30)}
            style={{
              width: "100%",
              minHeight: "44px",
              padding: "0 var(--space-3)",
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--radius-sm)",
              color: "var(--ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9375rem",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Environmental Demands */}
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
          Environmental Stimuli (+0.4 demand per factor)
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "var(--space-2)",
          }}
        >
          {ENVIRONMENTS.map((env) => {
            const isChecked = environment.includes(env);
            return (
              <label
                key={env}
                htmlFor={`env-${env}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  minHeight: "44px",
                  padding: "0 var(--space-3)",
                  backgroundColor: isChecked ? "rgba(196, 123, 72, 0.12)" : "var(--canvas)",
                  border: `1px solid ${isChecked ? "var(--axis-sensory)" : "var(--hairline)"}`,
                  borderRadius: "var(--radius-sm)",
                  color: isChecked ? "var(--axis-sensory)" : "var(--ink)",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: isChecked ? 700 : 500,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  id={`env-${env}`}
                  type="checkbox"
                  name="environment"
                  value={env}
                  checked={isChecked}
                  onChange={() => toggleEnv(env)}
                  style={{
                    accentColor: "var(--axis-sensory)",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                <span>{env}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "var(--space-3)",
          marginTop: "var(--space-2)",
          paddingTop: "var(--space-3)",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <Button
          variant="secondary"
          size="md"
          type="button"
          onClick={onCancel}
          style={{ minHeight: "44px", minWidth: "88px" }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          style={{ minHeight: "44px", minWidth: "120px" }}
        >
          {initialEvent ? "Update Activity" : "Save Activity"}
        </Button>
      </div>
    </form>
  );
};