"use client";

import React, { useMemo } from "react";
import { DayEvent, Symptoms } from "@/lib/contracts/day";
import { Recommendation } from "@/lib/contracts/plan";
import { aggregateDayLoad } from "@/lib/load/aggregate";
import { LoadRibbon } from "@/components/ribbon/LoadRibbon";

export interface BeforeAfterProps {
  events: DayEvent[];
  symptoms: Symptoms;
  recommendations: Recommendation[];
  className?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  events,
  symptoms,
  recommendations,
  className = "",
}) => {
  // Original profile
  const originalProfile = useMemo(() => {
    return aggregateDayLoad(events, symptoms);
  }, [events, symptoms]);

  // Adjusted profile simulating pacing interventions:
  // Breaks inserted, duration shortened, stimulus reduced
  const pacedProfile = useMemo(() => {
    const pacedEvents = events.map((ev) => {
      // If event was targeted by a recommendation, simulate load pacing
      const targeted = recommendations.some((r) => r.targetEventIds.includes(ev.id));
      if (!targeted) return ev;

      // Simulate reducing duration or environment factors
      return {
        ...ev,
        durationMinutes: Math.max(20, Math.round(ev.durationMinutes * 0.75)),
        environment: ev.environment.filter((e) => e !== "loud" && e !== "screen"),
      };
    });

    return aggregateDayLoad(pacedEvents, symptoms);
  }, [events, symptoms, recommendations]);

  return (
    <div
      className={`before-after-ribbons ${className}`}
      style={{
        display: "grid",
        gap: "var(--space-6)",
      }}
    >
      {/* Before Ribbon */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--hairline-strong)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-3)",
            flexWrap: "wrap",
            gap: "var(--space-2)",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--axis-sensory)",
              }}
            >
              Before Pacing
            </span>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
              Original Schedule ({originalProfile.capacity.pressurePoints.length} Pressure Points Detected)
            </h4>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
          >
            Capacity Floor: {Math.round(originalProfile.capacity.baseline * 100)}%
          </span>
        </div>

        <LoadRibbon
          timeline={originalProfile.timeline}
          baseline={originalProfile.capacity.baseline}
          pressurePoints={originalProfile.capacity.pressurePoints}
        />
      </div>

      {/* After Ribbon */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--axis-cognitive)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-3)",
            flexWrap: "wrap",
            gap: "var(--space-2)",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--axis-cognitive)",
              }}
            >
              After Pacing Applied
            </span>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
              Paced Schedule ({pacedProfile.capacity.pressurePoints.length} Pressure Points Remaining)
            </h4>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--axis-cognitive)",
              fontWeight: 700,
            }}
          >
            Pressure Relieved: {Math.max(0, originalProfile.capacity.pressurePoints.length - pacedProfile.capacity.pressurePoints.length)} Zone(s)
          </span>
        </div>

        <LoadRibbon
          timeline={pacedProfile.timeline}
          baseline={pacedProfile.capacity.baseline}
          pressurePoints={pacedProfile.capacity.pressurePoints}
        />
      </div>
    </div>
  );
};