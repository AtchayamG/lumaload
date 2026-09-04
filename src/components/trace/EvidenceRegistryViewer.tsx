"use client";

import React from "react";
import { getAllEvidence } from "@/lib/evidence/registry";

export interface EvidenceRegistryViewerProps {
  className?: string;
}

export const EvidenceRegistryViewer: React.FC<EvidenceRegistryViewerProps> = ({
  className = "",
}) => {
  const chunks = getAllEvidence();

  const sources = [
    {
      name: "Centers for Disease Control and Prevention (CDC)",
      section: "Signs & Symptoms",
      url: "https://www.cdc.gov/traumatic-brain-injury/signs-symptoms/index.html",
    },
    {
      name: "Centers for Disease Control and Prevention (CDC)",
      section: "Response & Recovery",
      url: "https://www.cdc.gov/traumatic-brain-injury/response/index.html",
    },
    {
      name: "CDC HEADS UP",
      section: "Returning to School",
      url: "https://www.cdc.gov/heads-up/guidelines/returning-to-school.html",
    },
    {
      name: "CDC HEADS UP",
      section: "Returning to Sports",
      url: "https://www.cdc.gov/heads-up/guidelines/returning-to-sports.html",
    },
    {
      name: "British Journal of Sports Medicine (BJSM)",
      section: "6th International Consensus on Concussion (Amsterdam 2023)",
      url: "https://bjsm.bmj.com/content/57/11/695",
    },
    {
      name: "Concussion Alliance",
      section: "Recovery & Pacing Guide",
      url: "https://www.concussionalliance.org/recovery-guide",
    },
  ];

  return (
    <div
      className={`evidence-registry-viewer ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-6)",
      }}
    >
      <div style={{ marginBottom: "var(--space-4)" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "var(--axis-cognitive)",
            display: "block",
            marginBottom: "2px",
          }}
        >
          Ground Truth Reference Registry
        </span>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
          Static Evidence Repository ({chunks.length} Chunks, 6 Verified Sources)
        </h3>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: "var(--space-4)",
        }}
      >
        To prevent URL hallucination, AI models never emit URLs directly. They are restricted to referencing internal chunk identifiers. Every ID is verified against this immutable registry at runtime.
      </p>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {sources.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "var(--space-3)",
              backgroundColor: "var(--canvas)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            <div>
              <strong style={{ fontSize: "0.875rem", color: "var(--ink)", display: "block" }}>
                {s.name}
              </strong>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                {s.section}
              </span>
            </div>

            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--axis-cognitive)",
                textDecoration: "underline",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Verify Live Source ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};