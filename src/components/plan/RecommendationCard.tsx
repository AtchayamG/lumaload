"use client";

import React, { useState } from "react";
import { Recommendation } from "@/lib/contracts/plan";
import { EvidenceRecord } from "@/lib/contracts/evidence";
import { DayEvent } from "@/lib/contracts/day";
import { ConfidencePill } from "./ConfidencePill";
import { WhyDrawer } from "./WhyDrawer";

export interface RecommendationCardProps {
  recommendation: Recommendation;
  allEvidence: EvidenceRecord[];
  allEvents: DayEvent[];
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  allEvidence,
  allEvents,
  className = "",
}) => {
  const [whyOpen, setWhyOpen] = useState(false);

  // Resolve affected events
  const targetLabels = recommendation.targetEventIds
    .map((id) => allEvents.find((e) => e.id === id)?.label || id)
    .filter(Boolean);

  // Resolve cited evidence records
  const evidenceRecords = recommendation.evidenceIds
    .map((id) => allEvidence.find((e) => e.id === id))
    .filter((e): e is EvidenceRecord => !!e);

  return (
    <div
      className={`recommendation-card ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-5)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      {/* Header Badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {recommendation.demandReduced.map((demand) => (
            <span
              key={demand}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: "2px",
                backgroundColor:
                  demand === "cognitive"
                    ? "rgba(30, 108, 115, 0.12)"
                    : demand === "sensory"
                    ? "rgba(196, 123, 72, 0.12)"
                    : demand === "physical"
                    ? "rgba(93, 123, 85, 0.12)"
                    : "rgba(124, 107, 138, 0.12)",
                color:
                  demand === "cognitive"
                    ? "var(--axis-cognitive)"
                    : demand === "sensory"
                    ? "var(--axis-sensory)"
                    : demand === "physical"
                    ? "var(--axis-physical)"
                    : "var(--axis-capacity)",
                border: `1px solid ${
                  demand === "cognitive"
                    ? "rgba(30, 108, 115, 0.3)"
                    : demand === "sensory"
                    ? "rgba(196, 123, 72, 0.3)"
                    : demand === "physical"
                    ? "rgba(93, 123, 85, 0.3)"
                    : "rgba(124, 107, 138, 0.3)"
                }`,
              }}
            >
              Relieves {demand}
            </span>
          ))}
        </div>

        <ConfidencePill confidence={recommendation.confidence} />
      </div>

      {/* Action Title */}
      <h4
        style={{
          fontSize: "1.125rem",
          fontWeight: 700,
          color: "var(--ink)",
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {recommendation.action}
      </h4>

      {/* Rationale */}
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--muted)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {recommendation.rationale}
      </p>

      {/* Target Events */}
      {targetLabels.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            flexWrap: "wrap",
            fontSize: "0.8125rem",
            color: "var(--muted)",
          }}
        >
          <span style={{ fontWeight: 600 }}>Applies to:</span>
          {targetLabels.map((lbl, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                padding: "1px 6px",
                backgroundColor: "var(--canvas)",
                border: "1px solid var(--hairline)",
                borderRadius: "2px",
                color: "var(--ink)",
              }}
            >
              {lbl}
            </span>
          ))}
        </div>
      )}

      {/* Why Drawer */}
      <WhyDrawer
        evidenceList={evidenceRecords}
        whatWeInferred={recommendation.whatWeInferred}
        whatWeDoNotKnow={recommendation.whatWeDoNotKnow}
        isOpen={whyOpen}
        onToggle={() => setWhyOpen(!whyOpen)}
      />
    </div>
  );
};