"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/state/session";
import { aggregateDayLoad } from "@/lib/load/aggregate";
import { LoadRibbon } from "@/components/ribbon/LoadRibbon";
import { RibbonLegend } from "@/components/ribbon/RibbonLegend";
import { DayTimeline } from "@/components/canvas/DayTimeline";
import { DemoDayPicker } from "@/components/canvas/DemoDayPicker";
import { EmergencyStop } from "@/components/safety/EmergencyStop";
import { LowStimulusToggle } from "@/components/ui/LowStimulusToggle";
import { Button } from "@/components/ui/Button";

export default function CanvasPage() {
  const router = useRouter();
  const {
    symptoms,
    context,
    dangerSignsSelected,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    setDangerSigns,
    setAnalysisResult,
  } = useSessionStore();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string>("");

  React.useEffect(() => {
    document.title = "Recovery Load Canvas · LumaLoad";
  }, []);

  const hasEmergency = dangerSignsSelected.length > 0;

  // Calculate live ribbon load profile
  const { timeline, capacity } = useMemo(() => {
    return aggregateDayLoad(events, symptoms);
  }, [events, symptoms]);
  const pressurePoints = capacity.pressurePoints;

  const handleAnalyzeDay = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    setAnnouncement("Analyzing neurological load profile across cognitive, sensory, and physical axes...");

    try {
      const payload = {
        symptoms,
        context,
        dangerSignsSelected,
        events,
      };

      const res = await fetch("/api/analyze-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setAnalysisResult(data);

      if (data.status === "emergency_halt") {
        setAnnouncement("Emergency danger sign detected. Presenting emergency clinical escalation instructions.");
        setDangerSigns(data.safety.dangerSignsSelected || ["Emergency sign detected"]);
      } else {
        setAnnouncement("Analysis complete. Your personalized recovery plan is ready.");
        router.push("/plan");
      }
    } catch (err) {
      console.error("Failed to analyze day:", err);
      setAnalysisError((err as Error).message || "Analysis request failed.");
      setAnnouncement("Analysis request failed. Please check your schedule and try again.");
    } finally {
      setAnalyzing(false);
    }
  };

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
          selectedSigns={dangerSignsSelected}
          onReset={() => setDangerSigns([])}
        />
      </main>
    );
  }

  return (
    <main
      id="main-content"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
        color: "var(--ink)",
        paddingBottom: "var(--space-12)",
      }}
    >
      {/* Screen reader live announcement region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {announcement}
      </div>
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
            maxWidth: "1320px",
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
              href="/"
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
              <span>LumaLoad</span>
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
              Screen S3 · Recovery Load Canvas
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <LowStimulusToggle />
            <Link href="/check-in" style={{ textDecoration: "none" }}>
              <Button variant="secondary" size="sm">
                Adjust Symptoms
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "var(--space-6) var(--space-4)",
        }}
      >
        {/* Top Controls: Demo Picker & Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            marginBottom: "var(--space-6)",
            paddingBottom: "var(--space-4)",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: "0 0 4px 0",
              }}
            >
              Recovery Load Canvas
            </h1>
            <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--muted)" }}>
              Interactive cartography mapping Cognitive, Sensory, and Physical load across your day.
            </p>
          </div>

          <DemoDayPicker />
        </div>

        {/* Live Ribbon Visualization Card */}
        <section
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-6)",
            marginBottom: "var(--space-8)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--space-3)",
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
                  color: "var(--axis-cognitive)",
                  display: "block",
                  marginBottom: "2px",
                }}
              >
                Neurological Load Ribbon
              </span>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                Anticipated Demand vs Capacity Floor
              </h2>
            </div>

            <RibbonLegend />
          </div>

          {/* Ribbon Canvas */}
          <LoadRibbon
            timeline={timeline}
            baseline={capacity.baseline}
            pressurePoints={pressurePoints}
          />
        </section>

        {/* Two-Column Grid: Timeline on Left, Cartography Stats & CTA on Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
        >
          {/* Left Column: Day Activities Timeline */}
          <div>
            <DayTimeline
              events={events}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
            />
          </div>

          {/* Right Column: Day Metrics & Analysis Action */}
          <div style={{ display: "grid", gap: "var(--space-6)" }}>
            {/* Cartography Diagnostics Card */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-6)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Pacing Cartography Metrics
              </h3>

              <div style={{ display: "grid", gap: "var(--space-4)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--space-3) 0",
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                    Capacity Baseline Floor:
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--axis-capacity)",
                    }}
                  >
                    {Math.round(capacity.baseline * 100)}%
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--space-3) 0",
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                    Identified Pressure Points:
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: pressurePoints.length > 0 ? "var(--axis-sensory)" : "var(--axis-physical)",
                    }}
                  >
                    {pressurePoints.length} {pressurePoints.length === 1 ? "zone" : "zones"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--space-3) 0",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                    Scheduled Activities:
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {events.length}
                  </span>
                </div>
              </div>

              {pressurePoints.length > 0 && (
                <div
                  style={{
                    marginTop: "var(--space-4)",
                    padding: "var(--space-3)",
                    backgroundColor: "rgba(196, 123, 72, 0.08)",
                    border: "1px solid rgba(196, 123, 72, 0.25)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}
                >
                  Notice: A stretch of your day anticipated demand runs above today&apos;s capacity floor. LumaLoad&apos;s Glass Box pipeline will propose evidence-grounded micro-breaks, task splitting, and stimulus reduction.
                </div>
              )}
            </div>

            {/* Analysis Execution Card */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-6)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Run Glass Box Analysis
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  lineHeight: 1.5,
                  marginBottom: "var(--space-4)",
                }}
              >
                Dispatches your schedule to the 7-stage verifiable recovery pipeline. Sanitizes PII, verifies evidence citations, and purges unsupported model claims.
              </p>

              {analysisError && (
                <div
                  style={{
                    padding: "var(--space-3)",
                    backgroundColor: "var(--danger-surface)",
                    border: "1px solid var(--danger-border)",
                    color: "var(--danger)",
                    fontSize: "0.8125rem",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  {analysisError}
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyzeDay}
                disabled={analyzing || events.length === 0}
                style={{
                  width: "100%",
                  minHeight: "48px",
                }}
              >
                {analyzing ? "Running 7-Stage Pipeline..." : "Analyze My Day →"}
              </Button>

              <div
                style={{
                  marginTop: "var(--space-3)",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Deterministic safety gate + active evidence verification
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}