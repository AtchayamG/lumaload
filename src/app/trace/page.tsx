"use client";

import React from "react";
import Link from "next/link";
import { useSessionStore } from "@/lib/state/session";
import { TraceStageItem } from "@/components/trace/TraceStageItem";
import { ModelDisclosure } from "@/components/trace/ModelDisclosure";
import { VerifierDeletions } from "@/components/trace/VerifierDeletions";
import { SanitizedPayloadViewer } from "@/components/trace/SanitizedPayloadViewer";
import { EvidenceRegistryViewer } from "@/components/trace/EvidenceRegistryViewer";
import { LowStimulusToggle } from "@/components/ui/LowStimulusToggle";
import { Button } from "@/components/ui/Button";

export default function TracePage() {
  const { analysisResult, events } = useSessionStore();

  if (!analysisResult) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--canvas)",
          color: "var(--ink)",
          padding: "var(--space-12) var(--space-4)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "540px",
            margin: "0 auto",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-8)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "var(--space-3)" }}>
            No Pipeline Trace Available
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: "var(--space-6)", lineHeight: 1.5 }}>
            To inspect the Glass Box execution audit, run an analysis from the Recovery Load Canvas first.
          </p>
          <Link href="/canvas" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="lg">
              Go to Recovery Canvas →
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const trace = analysisResult.trace;
  const totalPipelineTime = trace.reduce((acc, t) => acc + t.durationMs, 0);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
        color: "var(--ink)",
        paddingBottom: "var(--space-12)",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          borderBottom: "1px solid var(--hairline)",
          backgroundColor: "var(--surface)",
          padding: "var(--space-4) var(--space-6)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <Link
              href="/plan"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "var(--axis-cognitive)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <span>←</span>
              <span>Back to Plan</span>
            </Link>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                padding: "2px 8px",
                backgroundColor: "var(--canvas)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
                color: "var(--muted)",
              }}
            >
              Screen S5 · The Glass Box
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <LowStimulusToggle />
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button variant="secondary" size="sm">
                Overview Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "var(--space-8) var(--space-4)",
          display: "grid",
          gap: "var(--space-8)",
        }}
      >
        {/* Intro */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--axis-cognitive)",
              marginBottom: "var(--space-2)",
            }}
          >
            Glass Box Verification Trace
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              margin: "0 0 var(--space-2) 0",
            }}
          >
            Pipeline Execution & Safety Audit
          </h1>
          <p style={{ margin: 0, fontSize: "1.0625rem", color: "var(--muted)", lineHeight: 1.6 }}>
            Every recovery recommendation is subject to deterministic gate assertions, PII stripping, and active verifier claim purging. Total measured pipeline time:{" "}
            <strong style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
              {totalPipelineTime}ms
            </strong>.
          </p>
        </div>

        {/* Model Disclosure Card */}
        <ModelDisclosure
          modelUsed={analysisResult.modelUsed}
          status={analysisResult.status}
        />

        {/* Seven Stage Pipeline Log */}
        <section
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
              marginBottom: "var(--space-4)",
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
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: "2px",
                }}
              >
                Trace Records
              </span>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
                Seven-Stage Glass Box Execution
              </h2>
            </div>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--muted)",
              }}
            >
              {trace.length} stages recorded
            </span>
          </div>

          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {trace.map((stage, idx) => (
              <TraceStageItem
                key={stage.name + idx}
                stage={stage}
                stepNumber={idx + 1}
              />
            ))}
          </div>
        </section>

        {/* Verifier Purges */}
        <VerifierDeletions verification={analysisResult.verification} />

        {/* PII Sanitization Viewer */}
        <SanitizedPayloadViewer rawEvents={events} />

        {/* Ground Truth Registry Viewer */}
        <EvidenceRegistryViewer />

        {/* Bottom Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            paddingTop: "var(--space-4)",
            borderTop: "1px solid var(--hairline)",
          }}
        >
          <Link href="/plan" style={{ textDecoration: "none" }}>
            <Button variant="secondary" size="md">
              ← Return to Plan
            </Button>
          </Link>

          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="md">
              Return to Story Home →
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}