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
import mayaPrecomputed from "@/data/precomputed/maya-day-5.json";
import { AnalysisResponse } from "@/lib/contracts/plan";
import { TraceStage } from "@/lib/contracts/trace";

export default function TracePage() {
  const {
    analysisResult,
    events,
    symptoms,
    context,
    setAnalysisResult,
    loadPersona,
  } = useSessionStore();

  const [isRerunning, setIsRerunning] = React.useState(false);

  const handleLoadMayaDemo = () => {
    loadPersona("maya-day-5");
    const demoTrace: TraceStage[] = [
      {
        name: "served_from_precomputed",
        status: "ok",
        startedAt: Date.now() - 2,
        durationMs: 2,
        kind: "retrieval",
        detail: "Demo day analysed with gemini-3.8-flash on 4 Sep 2026. Re-run live to call the model now.",
      },
      ...(mayaPrecomputed.response.trace as TraceStage[]),
    ];
    setAnalysisResult({
      ...(mayaPrecomputed.response as AnalysisResponse),
      trace: demoTrace,
    });
  };

  const handleRerunLive = async () => {
    setIsRerunning(true);
    try {
      const res = await fetch("/api/analyze-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          context,
          events,
          forceLive: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error("Failed to rerun live:", err);
    } finally {
      setIsRerunning(false);
    }
  };

  if (!analysisResult) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--canvas)",
          color: "var(--ink)",
          padding: "var(--space-12) var(--space-4)",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-8)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "2px 8px",
              backgroundColor: "rgba(30, 108, 115, 0.12)",
              color: "var(--axis-cognitive)",
              border: "1px solid rgba(30, 108, 115, 0.3)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-3)",
            }}
          >
            Screen S5 · The Glass Box Audit
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              marginBottom: "var(--space-2)",
              letterSpacing: "-0.02em",
            }}
          >
            7-Stage Pipeline Execution Audit
          </h1>
          <p
            style={{
              color: "var(--muted)",
              marginBottom: "var(--space-6)",
              lineHeight: 1.6,
              fontSize: "1rem",
            }}
          >
            The Glass Box provides complete algorithmic transparency into LumaLoad&apos;s deterministic safety assertions, PII sanitization, model orchestration, and active claim verification.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-3)",
              marginBottom: "var(--space-8)",
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleLoadMayaDemo}
              style={{ flex: "1 1 240px" }}
            >
              🔍 Inspect Maya&apos;s 7-Stage Audit Trace
            </Button>
            <Link href="/canvas" style={{ textDecoration: "none", flex: "1 1 200px" }}>
              <Button variant="secondary" size="lg" style={{ width: "100%" }}>
                Map Your Day on Canvas →
              </Button>
            </Link>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--hairline)",
              paddingTop: "var(--space-6)",
              display: "grid",
              gap: "var(--space-4)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              The 7-Stage Glass Box Architecture
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  padding: "var(--space-3)",
                  backgroundColor: "var(--canvas)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    color: "var(--axis-cognitive)",
                    marginBottom: "2px",
                  }}
                >
                  1. Sanitization & Safety
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  Deterministic PII scrubbing and emergency red-flag assertion.
                </div>
              </div>
              <div
                style={{
                  padding: "var(--space-3)",
                  backgroundColor: "var(--canvas)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    color: "var(--axis-sensory)",
                    marginBottom: "2px",
                  }}
                >
                  2. Retrieval & Demand
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  Evidence scoring and deterministic activity load priors.
                </div>
              </div>
              <div
                style={{
                  padding: "var(--space-3)",
                  backgroundColor: "var(--canvas)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    color: "var(--axis-physical)",
                    marginBottom: "2px",
                  }}
                >
                  3. Composition & Verifier
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  Plan synthesis and active purging of ungrounded model claims.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const trace = analysisResult.trace;
  const totalPipelineTime = trace.reduce((acc, t) => acc + t.durationMs, 0);
  const isPrecomputed = trace.some((t) => t.name === "served_from_precomputed");

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
          isPrecomputed={isPrecomputed}
          onRerunLive={handleRerunLive}
          rerunning={isRerunning}
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