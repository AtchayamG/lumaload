"use client";

import React from "react";
import { EvidenceRecord } from "@/lib/contracts/evidence";

export interface WhyDrawerProps {
  evidenceList: EvidenceRecord[];
  whatWeInferred: string;
  whatWeDoNotKnow: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const WhyDrawer: React.FC<WhyDrawerProps> = ({
  evidenceList,
  whatWeInferred,
  whatWeDoNotKnow,
  isOpen,
  onToggle,
  className = "",
}) => {
  return (
    <div className={`why-drawer ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "var(--space-2) var(--space-3)",
          minHeight: "44px",
          backgroundColor: isOpen ? "var(--canvas)" : "transparent",
          border: `1px solid ${isOpen ? "var(--axis-cognitive)" : "var(--hairline)"}`,
          borderRadius: "var(--radius-sm)",
          color: "var(--axis-cognitive)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all var(--transition-fast)",
        }}
      >
        <span>{isOpen ? "Hide Why? Context ▲" : "Why this recommendation? ▼"}</span>
        <span
          style={{
            fontSize: "0.6875rem",
            padding: "1px 6px",
            borderRadius: "2px",
            backgroundColor: "rgba(30, 108, 115, 0.1)",
            border: "1px solid rgba(30, 108, 115, 0.3)",
          }}
        >
          {evidenceList.length} evidence {evidenceList.length === 1 ? "source" : "sources"}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-4)",
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-sm)",
            display: "grid",
            gap: "var(--space-4)",
          }}
        >
          {/* Grounding Evidence */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "var(--space-2)",
              }}
            >
              Verified Evidence Grounding
            </div>

            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {evidenceList.map((chunk) => (
                <div
                  key={chunk.id}
                  style={{
                    padding: "var(--space-3)",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--axis-cognitive)",
                      }}
                    >
                      {chunk.organization} · {chunk.id}
                    </span>

                    <a
                      href={chunk.url}
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
                      View Source Reference ↗
                    </a>
                  </div>

                  <strong
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "var(--ink)",
                      marginBottom: "4px",
                    }}
                  >
                    {chunk.title}
                  </strong>

                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--muted)",
                      lineHeight: 1.5,
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{chunk.claim}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reasoning Boundaries */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            <div
              style={{
                padding: "var(--space-3)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--axis-cognitive)",
                  marginBottom: "4px",
                }}
              >
                What LumaLoad Inferred
              </div>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--ink)", lineHeight: 1.5 }}>
                {whatWeInferred}
              </p>
            </div>

            <div
              style={{
                padding: "var(--space-3)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "4px",
                }}
              >
                What LumaLoad Does Not Know
              </div>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.5 }}>
                {whatWeDoNotKnow}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};