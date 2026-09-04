"use client";

import React from "react";
import { VerificationResult } from "@/lib/contracts/plan";

export interface VerifierDeletionsProps {
  verification: VerificationResult;
  className?: string;
}

export const VerifierDeletions: React.FC<VerifierDeletionsProps> = ({
  verification,
  className = "",
}) => {
  const hasUnsupported = verification.unsupportedClaimsRemoved.length > 0;
  const hasBanned = verification.bannedLanguageRemoved.length > 0;
  const totalPurged =
    verification.unsupportedClaimsRemoved.length + verification.bannedLanguageRemoved.length;

  return (
    <div
      className={`verifier-deletions ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          marginBottom: "var(--space-4)",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: totalPurged > 0 ? "var(--danger)" : "var(--axis-physical)",
              display: "block",
              marginBottom: "2px",
            }}
          >
            Active Verifier Purge Audit
          </span>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
            Model Assertions Intercepted & Purged ({totalPurged})
          </h3>
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: totalPurged > 0 ? "var(--danger-surface)" : "rgba(93, 123, 85, 0.12)",
            color: totalPurged > 0 ? "var(--danger)" : "var(--axis-physical)",
            border: `1px solid ${totalPurged > 0 ? "var(--danger-border)" : "rgba(93, 123, 85, 0.3)"}`,
            fontWeight: 700,
          }}
        >
          {totalPurged > 0 ? `${totalPurged} Intercepted` : "All Grounded"}
        </span>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: "var(--space-4)",
        }}
      >
        The 7-gate deterministic and model verifier audits every candidate recommendation before it can reach the user. Any statement lacking verified citation IDs, containing prohibited medical language, or exceeding the evidentiary record is automatically purged.
      </p>

      {totalPurged === 0 ? (
        <div
          style={{
            padding: "var(--space-4)",
            backgroundColor: "var(--canvas)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.875rem",
            color: "var(--muted)",
          }}
        >
          ✓ Zero hallucinations or overreaching statements detected in the delivered plan. All recommendations are verified against the static evidence registry.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {hasBanned && (
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--danger)",
                  display: "block",
                  marginBottom: "var(--space-2)",
                }}
              >
                Prohibited Medical Phrases Intercepted:
              </span>
              <div style={{ display: "grid", gap: "var(--space-2)" }}>
                {verification.bannedLanguageRemoved.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "var(--space-3)",
                      backgroundColor: "var(--danger-surface)",
                      border: "1px solid var(--danger-border)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8125rem",
                      color: "var(--danger)",
                    }}
                  >
                    ❌ Purged: {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasUnsupported && (
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--danger)",
                  display: "block",
                  marginBottom: "var(--space-2)",
                }}
              >
                Unsupported or Uncited Claims Deleted:
              </span>
              <div style={{ display: "grid", gap: "var(--space-2)" }}>
                {verification.unsupportedClaimsRemoved.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "var(--space-3)",
                      backgroundColor: "var(--canvas)",
                      border: "1px solid var(--danger-border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8125rem",
                      color: "var(--ink)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "var(--danger)", fontWeight: 700 }}>[Deleted by Verifier]</span>{" "}
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};