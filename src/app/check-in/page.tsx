"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/state/session";
import { SafetyGate } from "@/components/checkin/SafetyGate";
import { DangerSignChecklist } from "@/components/checkin/DangerSignChecklist";
import { SymptomSection } from "@/components/checkin/SymptomSection";
import { ContextForm } from "@/components/checkin/ContextForm";
import { EmergencyStop } from "@/components/safety/EmergencyStop";
import { LowStimulusToggle } from "@/components/ui/LowStimulusToggle";
import { Button } from "@/components/ui/Button";

export default function CheckInPage() {
  const router = useRouter();
  const {
    symptoms,
    context,
    dangerSignsSelected,
    setSymptoms,
    setContext,
    setDangerSigns,
    resetToMaya,
  } = useSessionStore();

  const [savedToast, setSavedToast] = useState(false);
  const hasEmergency = dangerSignsSelected.length > 0;

  React.useEffect(() => {
    document.title = "Check-In & Safety Gate · LumaLoad";
  }, []);

  const handleProceed = () => {
    setSavedToast(true);
    setTimeout(() => {
      router.push("/canvas");
    }, 400);
  };

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
            maxWidth: "960px",
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
              Screen S2 · Check-In
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <LowStimulusToggle />
            <Link href="/canvas" style={{ textDecoration: "none" }}>
              <Button variant="secondary" size="sm">
                Skip to Canvas →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div
        style={{
          maxWidth: "840px",
          margin: "0 auto",
          padding: "var(--space-8) var(--space-4)",
        }}
      >
        {/* Intro */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: "var(--space-2)",
            }}
          >
            Daily Recovery Check-In
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              maxWidth: "680px",
            }}
          >
            A 60-second calibrated safety gate and symptom inventory. Calibrates your daily Capacity Baseline so activities are paced against what your brain can safely sustain today.
          </p>

          <div
            style={{
              marginTop: "var(--space-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "4px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem",
              color: "var(--muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span>🔒</span>
            <span>Zero health data persists to our servers · Stored locally in your session</span>
          </div>
        </div>

        {/* Emergency Stop Mode when Danger Signs Detected */}
        {hasEmergency ? (
          <div style={{ marginBottom: "var(--space-8)" }}>
            <EmergencyStop
              selectedSigns={dangerSignsSelected}
              onReset={() => setDangerSigns([])}
            />
          </div>
        ) : (
          <>
            {/* Step 1: Clinician Gate */}
            <SafetyGate
              clinicianSeen={context.clinicianSeen}
              onClinicianSeenChange={(seen) => setContext({ clinicianSeen: seen })}
            />

            {/* Step 2: Danger Signs Checklist */}
            <DangerSignChecklist
              selectedSigns={dangerSignsSelected}
              onChange={setDangerSigns}
            />

            {/* Step 3: Symptom Inventory */}
            <SymptomSection symptoms={symptoms} onChange={setSymptoms} />

            {/* Step 4: Recovery Context Form */}
            <ContextForm context={context} onChange={setContext} />

            {/* Persistent Clinical Override Banner */}
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
                Clinical Precedence Notice
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  lineHeight: 1.5,
                }}
              >
                Your healthcare provider&apos;s specific discharge and recovery protocol always overrides any estimate or recommendation generated by LumaLoad. LumaLoad does not diagnose, score severity, or clear return to play.
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
              <button
                type="button"
                onClick={resetToMaya}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Reset to Maya&apos;s Day 5 Profile
              </button>

              <Button
                variant="primary"
                size="lg"
                onClick={handleProceed}
                style={{ minHeight: "48px" }}
              >
                {savedToast ? "Saving..." : "Save & Proceed to Recovery Canvas →"}
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}