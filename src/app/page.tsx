"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadRibbon } from "@/components/ribbon";
import { LowStimulusToggle } from "@/components/ui/LowStimulusToggle";
import { aggregateDayLoad } from "@/lib/load/aggregate";
import { useSessionStore } from "@/lib/state/session";
import demoDays from "@/data/demo-days.json";
import { DayEventSchema } from "@/lib/contracts/day";

export default function StoryPage() {
  const router = useRouter();
  const { loadPersona } = useSessionStore();

  const maya = demoDays.personas[0];
  const mayaEvents = useMemo(
    () => maya.events.map((e) => DayEventSchema.parse(e)),
    [maya.events]
  );

  const mayaProfile = useMemo(
    () => aggregateDayLoad(mayaEvents, maya.symptoms),
    [mayaEvents, maya.symptoms]
  );

  React.useEffect(() => {
    document.title = "LumaLoad — Recovery Load OS";
  }, []);

  const handleTryMaya = () => {
    loadPersona("maya-day-5");
    router.push("/canvas");
  };

  return (
    <main id="main-content" className="container" style={{ padding: "var(--space-8) var(--space-4)" }}>
      {/* Top Header Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          marginBottom: "var(--space-8)",
          paddingBottom: "var(--space-4)",
          borderBottom: "1px solid var(--hairline)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
            }}
          >
            LUMALOAD
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--muted)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Recovery Load OS
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--hairline)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
              minHeight: "36px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--success)",
                flexShrink: 0,
              }}
            />
            No account · zero server storage
          </div>

          <LowStimulusToggle />
        </div>
      </header>

      {/* Hero Editorial Section */}
      <section
        style={{
          maxWidth: "840px",
          marginBottom: "var(--space-8)",
        }}
      >
        <h1
          style={{
            fontSize: "2.75rem",
            lineHeight: 1.15,
            fontWeight: 800,
            color: "var(--ink)",
            marginBottom: "var(--space-4)",
            letterSpacing: "-0.03em",
          }}
        >
          Plan the day. Protect the recovery.
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            lineHeight: 1.6,
            color: "var(--muted)",
            marginBottom: "var(--space-6)",
          }}
        >
          A person recovering from a concussion doesn&apos;t experience demand as
          one number. LumaLoad maps the cognitive, sensory and physical load
          hidden inside an ordinary day, and measures each strand against the
          capacity your sleep and mood actually left you today.
        </p>

        {/* Action CTAs */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "var(--space-6)",
          }}
        >
          <Link
            href="/check-in"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "44px",
              minWidth: "44px",
              padding: "12px 28px",
              backgroundColor: "var(--ink)",
              color: "var(--canvas)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "var(--radius-sm)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            Map my day →
          </Link>

          <button
            type="button"
            onClick={handleTryMaya}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "44px",
              minWidth: "44px",
              padding: "11px 24px",
              backgroundColor: "var(--surface)",
              color: "var(--ink)",
              border: "1px solid var(--hairline-strong)",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            Try Maya&apos;s day (Day 5 demo)
          </button>
        </div>
      </section>

      {/* The Hero Load Ribbon Visualisation (Rendering Maya's fixture) */}
      <section aria-label="Interactive Demo Load Ribbon" style={{ marginBottom: "var(--space-12)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--hairline)",
                color: "var(--muted)",
              }}
            >
              Live Demo Fixture
            </span>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              Synthetic persona: Maya (Day 5 post-concussion student)
            </span>
          </div>
        </div>

        <LoadRibbon
          timeline={mayaProfile.timeline}
          baseline={mayaProfile.capacity.baseline}
          pressurePoints={mayaProfile.capacity.pressurePoints}
        />
      </section>

      {/* Value Pillars Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-6)",
          paddingTop: "var(--space-6)",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--surface)",
            padding: "var(--space-5)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--axis-cognitive)",
              fontWeight: 600,
              marginBottom: "var(--space-2)",
            }}
          >
            01 / MULTI-AXIS LOAD
          </div>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "var(--space-2)" }}>
            Not a single number
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
            Separates cognitive, sensory, and physical strain. A quiet walk has
            different neurological cost than a video meeting or crowded cafeteria.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--surface)",
            padding: "var(--space-5)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--axis-capacity)",
              fontWeight: 600,
              marginBottom: "var(--space-2)",
            }}
          >
            02 / CAPACITY BASELINE
          </div>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "var(--space-2)" }}>
            The mental-health arm
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
            Poor sleep, anxiety, and irritability directly degrade tolerance.
            LumaLoad models your baseline capacity so you never overcommit on
            vulnerable days.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--surface)",
            padding: "var(--space-5)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--danger)",
              fontWeight: 600,
              marginBottom: "var(--space-2)",
            }}
          >
            03 / RESPONSIBLE AI
          </div>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "var(--space-2)" }}>
            Deterministic safety
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
            Danger signs halt AI instantly. Every recommendation cites verified
            CDC guidance. Unsubstantiated claims are purged before you ever see
            them.
          </p>
        </div>
      </section>
    </main>
  );
}
