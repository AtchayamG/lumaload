"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/state/session";
import { getAllEvidence } from "@/lib/evidence/registry";
import { classifyActivityRisk } from "@/lib/safety/restrictedActivities";
import { ModelDisclosure } from "@/components/trace/ModelDisclosure";
import { RecommendationCard } from "@/components/plan/RecommendationCard";
import { BeforeAfter } from "@/components/plan/BeforeAfter";
import { DistressSignpost } from "@/components/safety/DistressSignpost";
import { ClinicianBoundary } from "@/components/safety/ClinicianBoundary";
import { EmergencyStop } from "@/components/safety/EmergencyStop";
import { LowStimulusToggle } from "@/components/ui/LowStimulusToggle";
import { Button } from "@/components/ui/Button";
import mayaPrecomputed from "@/data/precomputed/maya-day-5.json";
import { AnalysisResponse } from "@/lib/contracts/plan";
import { TraceStage } from "@/lib/contracts/trace";

export default function PlanPage() {
  const router = useRouter();
  const {
    events,
    symptoms,
    context,
    analysisResult,
    dangerSignsSelected,
    setDangerSigns,
    setAnalysisResult,
    loadPersona,
  } = useSessionStore();

  const [isRerunning, setIsRerunning] = React.useState(false);
  const allEvidence = useMemo(() => getAllEvidence(), []);

  React.useEffect(() => {
    document.title = "Your Daily Recovery Plan · LumaLoad";
  }, []);

  const handleLoadMayaDemo = () => {
    loadPersona("maya-day-5");
    setAnalysisResult(mayaPrecomputed.response as AnalysisResponse);
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

  const hasEmergency =
    dangerSignsSelected.length > 0 || analysisResult?.status === "emergency_halt";

  if (hasEmergency) {
    return (
      <main
        id="main-content"
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--canvas)",
          color: "var(--ink)",
          padding: "var(--space-6)",
        }}
      >
        <EmergencyStop
          selectedSigns={
            dangerSignsSelected.length > 0
              ? dangerSignsSelected
              : analysisResult?.safety.dangerSignsSelected || []
          }
          onReset={() => {
            setDangerSigns([]);
            router.push("/canvas");
          }}
        />
      </main>
    );
  }

  // Cold visit state: When navigated directly to /plan without session state
  if (!analysisResult) {
    return (
      <main
        id="main-content"
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
            Screen S4 · Recovery Plan Overview
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              marginBottom: "var(--space-2)",
              letterSpacing: "-0.02em",
            }}
          >
            Evidence-Grounded Recovery Plan
          </h1>
          <p
            style={{
              color: "var(--muted)",
              marginBottom: "var(--space-6)",
              lineHeight: 1.6,
              fontSize: "1rem",
            }}
          >
            The Recovery Plan translates multidimensional cognitive, sensory, and physical demands into scheduled micro-breaks, pacing modifications, and safety boundaries to prevent symptom spikes.
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
              ⚡ Load Maya&apos;s Day 5 Plan (Instant Demo)
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
              What this plan provides
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
                    fontSize: "0.875rem",
                    color: "var(--axis-cognitive)",
                    marginBottom: "4px",
                  }}
                >
                  🛡️ Clinician Boundaries
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  Strict guardrails locking high-risk activities per Consensus on Concussion guidelines.
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
                    fontSize: "0.875rem",
                    color: "var(--axis-sensory)",
                    marginBottom: "4px",
                  }}
                >
                  ⏱️ Micro-Break Pacing
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  Calculated cognitive resets inserted before sensory & cognitive breakthrough thresholds.
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
                    fontSize: "0.875rem",
                    color: "var(--axis-physical)",
                    marginBottom: "4px",
                  }}
                >
                  📚 Evidence Registry
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  Every recommendation is grounded in peer-reviewed clinical citations. Zero hallucinated claims.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const recommendations = analysisResult.recommendations;
  const isDegraded = analysisResult.status === "degraded";
  const isPrecomputed =
    analysisResult.trace?.some((t) => t.name === "served_from_precomputed") ?? false;
  const restrictedEvents = events.filter(
    (e) => classifyActivityRisk(e.category, e.label) === "restricted"
  );
  const showDistress = analysisResult.safety.distressSignpostShown;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
        color: "var(--ink)",
        paddingBottom: "var(--space-12)",
      }}
    >
      {/* Navigation Header */}
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
              href="/canvas"
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
              <span>Back to Canvas</span>
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
              Screen S4 · Luma Plan
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <LowStimulusToggle />
            <Link href="/trace" style={{ textDecoration: "none" }}>
              <Button variant="secondary" size="sm">
                View Glass Box Trace →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Plan Content */}
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "var(--space-8) var(--space-4)",
        }}
      >
        {/* Title & Engine Disclosure */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              margin: "0 0 var(--space-2) 0",
            }}
          >
            Your Daily Recovery Plan
          </h1>

          <p style={{ margin: 0, fontSize: "1.0625rem", color: "var(--muted)", lineHeight: 1.6 }}>
            Evidence-grounded pacing recommendations designed to distribute demand below your Capacity Baseline floor without enforcing total isolation.
          </p>
        </div>

        {/* Model Disclosure Card */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <ModelDisclosure
            modelUsed={analysisResult.modelUsed}
            status={analysisResult.status}
            isPrecomputed={isPrecomputed}
            onRerunLive={handleRerunLive}
            rerunning={isRerunning}
          />
        </div>

        {/* Distress Signpost when triggered */}
        {showDistress && <DistressSignpost />}

        {/* Restricted Activities Notice */}
        {restrictedEvents.length > 0 && (
          <div style={{ marginBottom: "var(--space-6)" }}>
            {restrictedEvents.map((ev) => (
              <ClinicianBoundary
                key={ev.id}
                activityLabel={ev.label}
              />
            ))}
          </div>
        )}

        {/* Section 1: Recommendations List */}
        <section style={{ marginBottom: "var(--space-8)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "var(--space-4)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              Pacing Interventions ({recommendations.length})
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--muted)",
              }}
            >
              Every claim active & verified against registry
            </span>
          </div>

          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                allEvidence={allEvidence}
                allEvents={events}
              />
            ))}

            {recommendations.length === 0 && (
              <div
                style={{
                  padding: "var(--space-8)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--hairline-strong)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  display: "grid",
                  gap: "var(--space-2)",
                  maxWidth: "580px",
                  margin: "0 auto",
                }}
              >
                <div style={{ fontSize: "2rem" }}>🌱</div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
                  No pacing changes suggested for this day
                </h3>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Anticipated demand stays below your capacity baseline throughout. Maintain your comfortable pacing and adhere to your treating clinician&apos;s recovery guidance.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Before / After Comparison */}
        <section style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ marginBottom: "var(--space-4)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              Before & After Load Comparison
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "var(--muted)" }}>
              Visual cartography showing how recommended pacing relieves peak pressure points.
            </p>
          </div>

          <BeforeAfter
            events={events}
            symptoms={symptoms}
            recommendations={recommendations}
          />
        </section>

        {/* Clinical Disclaimer Callout */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderLeft: "4px solid var(--axis-cognitive)",
            padding: "var(--space-4) var(--space-5)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--space-8)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--axis-cognitive)",
              marginBottom: "4px",
            }}
          >
            Clinical Disclaimers & Safety Notice
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "var(--muted)",
              lineHeight: 1.5,
            }}
          >
            LumaLoad is a daily pacing planning aid and is not a certified medical device. It does not provide medical diagnoses, concussion severity scores, or return-to-learn / return-to-sport clearance decisions. Always follow the explicit instructions of your treating clinician.
          </p>
        </div>

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
          <Link href="/canvas" style={{ textDecoration: "none" }}>
            <Button variant="secondary" size="md">
              ← Edit Activities on Canvas
            </Button>
          </Link>

          <Link href="/trace" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="lg">
              Inspect The Glass Box Trace →
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}