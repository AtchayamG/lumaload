"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/state/session";
import { getAllEvidence } from "@/lib/evidence/registry";
import { classifyActivityRisk } from "@/lib/safety/restrictedActivities";
import { RecommendationCard } from "@/components/plan/RecommendationCard";
import { BeforeAfter } from "@/components/plan/BeforeAfter";
import { DistressSignpost } from "@/components/safety/DistressSignpost";
import { ClinicianBoundary } from "@/components/safety/ClinicianBoundary";
import { EmergencyStop } from "@/components/safety/EmergencyStop";
import { LowStimulusToggle } from "@/components/ui/LowStimulusToggle";
import { Button } from "@/components/ui/Button";

export default function PlanPage() {
  const router = useRouter();
  const {
    events,
    symptoms,
    analysisResult,
    dangerSignsSelected,
    setDangerSigns,
  } = useSessionStore();

  const allEvidence = useMemo(() => getAllEvidence(), []);

  const hasEmergency =
    dangerSignsSelected.length > 0 || analysisResult?.status === "emergency_halt";

  if (hasEmergency) {
    return (
      <main
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

  // If user navigates directly to /plan without running analysis, prompt them to run it
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
            No Analysis Generated Yet
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: "var(--space-6)", lineHeight: 1.5 }}>
            To view a tailored recovery plan, check in and click &quot;Analyze My Day&quot; on the Recovery Load Canvas.
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

  const recommendations = analysisResult.recommendations;
  const isDegraded = analysisResult.status === "degraded";
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
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "2px 8px",
              backgroundColor: isDegraded ? "rgba(196, 123, 72, 0.12)" : "rgba(30, 108, 115, 0.12)",
              color: isDegraded ? "var(--axis-sensory)" : "var(--axis-cognitive)",
              border: `1px solid ${isDegraded ? "rgba(196, 123, 72, 0.3)" : "rgba(30, 108, 115, 0.3)"}`,
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-2)",
            }}
          >
            {isDegraded
              ? "Deterministic Rules Engine · Zero Hallucination Mode"
              : `Synthesized with ${analysisResult.modelUsed || "Gemini"} · Verified Grounded`}
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
            Your Daily Recovery Plan
          </h1>

          <p style={{ margin: 0, fontSize: "1.0625rem", color: "var(--muted)", lineHeight: 1.6 }}>
            Evidence-grounded pacing recommendations designed to distribute demand below your Capacity Baseline floor without enforcing total isolation.
          </p>
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
                  padding: "var(--space-6)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                No modifications suggested. Your current schedule matches today&apos;s capacity baseline.
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