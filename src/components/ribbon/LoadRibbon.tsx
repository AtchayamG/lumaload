"use client";

import React, { useState, useMemo } from "react";
import { TimePointDemand } from "@/lib/load/capacity";
import { PressurePoint } from "@/lib/contracts/plan";
import { CapacityBaseline } from "./CapacityBaseline";
import { RibbonLegend } from "./RibbonLegend";
import { RibbonTextAlternative } from "./RibbonTextAlternative";

export interface LoadRibbonProps {
  timeline: TimePointDemand[];
  baseline: number;
  pressurePoints: PressurePoint[];
  className?: string;
  showTextAlternativeByDefault?: boolean;
}

/**
 * Generates an SVG Catmull-Rom cubic Bézier spline through an array of points.
 */
function catmullRomSplinePath(points: [number, number][], tension = 0.35): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  const pts = [points[0], ...points, points[points.length - 1]];

  for (let i = 1; i < pts.length - 2; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2];

    const cp1x = p1[0] + ((p2[0] - p0[0]) * tension) / 3;
    const cp1y = p1[1] + ((p2[1] - p0[1]) * tension) / 3;
    const cp2x = p2[0] - ((p3[0] - p1[0]) * tension) / 3;
    const cp2y = p2[1] - ((p3[1] - p1[1]) * tension) / 3;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  return d;
}

/**
 * Creates a smooth closed SVG ribbon path between upper and lower boundary curves.
 */
function createSmoothRibbon(
  upperPoints: [number, number][],
  lowerPoints: [number, number][],
  tension = 0.35
): string {
  if (upperPoints.length < 2 || lowerPoints.length < 2) return "";

  // Upper spline curve: left to right
  let d = `M ${upperPoints[0][0].toFixed(1)} ${upperPoints[0][1].toFixed(1)}`;
  const uPts = [upperPoints[0], ...upperPoints, upperPoints[upperPoints.length - 1]];
  for (let i = 1; i < uPts.length - 2; i++) {
    const p0 = uPts[i - 1];
    const p1 = uPts[i];
    const p2 = uPts[i + 1];
    const p3 = uPts[i + 2];

    const cp1x = p1[0] + ((p2[0] - p0[0]) * tension) / 3;
    const cp1y = p1[1] + ((p2[1] - p0[1]) * tension) / 3;
    const cp2x = p2[0] - ((p3[0] - p1[0]) * tension) / 3;
    const cp2y = p2[1] - ((p3[1] - p1[1]) * tension) / 3;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  // Connect to end of lower spline
  const lastLower = lowerPoints[lowerPoints.length - 1];
  d += ` L ${lastLower[0].toFixed(1)} ${lastLower[1].toFixed(1)}`;

  // Lower spline curve: right to left
  const revLower = [...lowerPoints].reverse();
  const lPts = [revLower[0], ...revLower, revLower[revLower.length - 1]];
  for (let i = 1; i < lPts.length - 2; i++) {
    const p0 = lPts[i - 1];
    const p1 = lPts[i];
    const p2 = lPts[i + 1];
    const p3 = lPts[i + 2];

    const cp1x = p1[0] + ((p2[0] - p0[0]) * tension) / 3;
    const cp1y = p1[1] + ((p2[1] - p0[1]) * tension) / 3;
    const cp2x = p2[0] - ((p3[0] - p1[0]) * tension) / 3;
    const cp2y = p2[1] - ((p3[1] - p1[1]) * tension) / 3;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  d += " Z";
  return d;
}

const HOURS = [
  { time: 360, label: "06:00" },
  { time: 540, label: "09:00" },
  { time: 720, label: "12:00" },
  { time: 900, label: "15:00" },
  { time: 1080, label: "18:00" },
  { time: 1260, label: "21:00" },
  { time: 1380, label: "23:00" },
];

export const LoadRibbon: React.FC<LoadRibbonProps> = ({
  timeline,
  baseline,
  pressurePoints,
  className = "",
  showTextAlternativeByDefault = false,
}) => {
  const [showTextAlt, setShowTextAlt] = useState(showTextAlternativeByDefault);

  const width = 1000;
  const height = 280;
  const timelineStart = 360;
  const timelineEnd = 1380;
  const totalMinutes = timelineEnd - timelineStart;

  // Compute organic unstacked strands with Catmull-Rom splines
  const {
    cogPath,
    senPath,
    phyPath,
    cogCenterPath,
    senCenterPath,
    phyCenterPath,
  } = useMemo(() => {
    if (timeline.length === 0) {
      return {
        cogPath: "",
        senPath: "",
        phyPath: "",
        cogCenterPath: "",
        senCenterPath: "",
        phyCenterPath: "",
      };
    }

    // Step 1: Smooth timeline demand across time to eliminate hard step edges
    // Resample every 15 minutes with a moving-average window for natural swelling & tapering
    const stepMinutes = 15;
    const smoothedPoints: {
      time: number;
      cog: number;
      sen: number;
      phy: number;
    }[] = [];

    for (let t = timelineStart; t <= timelineEnd; t += stepMinutes) {
      // Find nearby points within ±15 minutes for smoothing
      const neighbors = timeline.filter(
        (p) => Math.abs(p.timeMinutes - t) <= 15
      );
      if (neighbors.length > 0) {
        let totalW = 0;
        let sumCog = 0;
        let sumSen = 0;
        let sumPhy = 0;
        for (const n of neighbors) {
          const dist = Math.abs(n.timeMinutes - t);
          const weight = Math.max(0.1, 1 - dist / 20);
          totalW += weight;
          sumCog += n.cognitive * weight;
          sumSen += n.sensory * weight;
          sumPhy += n.physical * weight;
        }
        smoothedPoints.push({
          time: t,
          cog: sumCog / totalW,
          sen: sumSen / totalW,
          phy: sumPhy / totalW,
        });
      } else {
        smoothedPoints.push({ time: t, cog: 0, sen: 0, phy: 0 });
      }
    }

    // Centrelines at rest:
    // Cognitive: 145px
    // Sensory:   170px
    // Physical:  195px
    // When demand increases, strands swell and deflect upward toward/through baseline (Y ≈ 115)
    const baseCogY = 145;
    const baseSenY = 170;
    const basePhyY = 195;

    const minThickness = 8; // Physical strand is ALWAYS >= 8px thick, clearly visible

    const cogUpper: [number, number][] = [];
    const cogLower: [number, number][] = [];
    const cogCenter: [number, number][] = [];

    const senUpper: [number, number][] = [];
    const senLower: [number, number][] = [];
    const senCenter: [number, number][] = [];

    const phyUpper: [number, number][] = [];
    const phyLower: [number, number][] = [];
    const phyCenter: [number, number][] = [];

    for (const pt of smoothedPoints) {
      const x = ((pt.time - timelineStart) / totalMinutes) * width;

      // Cognitive strand
      const cogThick = minThickness + pt.cog * 6.5;
      const cogDeflection = pt.cog * 13;
      const cogCenterY = baseCogY - cogDeflection;
      cogUpper.push([x, cogCenterY - cogThick / 2]);
      cogLower.push([x, cogCenterY + cogThick / 2]);
      cogCenter.push([x, cogCenterY]);

      // Sensory strand
      const senThick = minThickness + pt.sen * 6.0;
      const senDeflection = pt.sen * 11;
      const senCenterY = baseSenY - senDeflection;
      senUpper.push([x, senCenterY - senThick / 2]);
      senLower.push([x, senCenterY + senThick / 2]);
      senCenter.push([x, senCenterY]);

      // Physical strand
      const phyThick = minThickness + pt.phy * 5.5;
      const phyDeflection = pt.phy * 9;
      const phyCenterY = basePhyY - phyDeflection;
      phyUpper.push([x, phyCenterY - phyThick / 2]);
      phyLower.push([x, phyCenterY + phyThick / 2]);
      phyCenter.push([x, phyCenterY]);
    }

    return {
      cogPath: createSmoothRibbon(cogUpper, cogLower),
      senPath: createSmoothRibbon(senUpper, senLower),
      phyPath: createSmoothRibbon(phyUpper, phyLower),
      cogCenterPath: catmullRomSplinePath(cogCenter),
      senCenterPath: catmullRomSplinePath(senCenter),
      phyCenterPath: catmullRomSplinePath(phyCenter),
    };
  }, [timeline, timelineStart, timelineEnd, totalMinutes, width]);

  return (
    <div
      className={`load-ribbon-container ${className}`}
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        boxShadow: "var(--shadow-subtle)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-2)",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Recovery Load Ribbon
          </h2>
          <span
            style={{
              fontSize: "0.8125rem",
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
            }}
          >
            LumaLoad multi-axis cartography — cognitive, sensory &amp; physical
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <button
            type="button"
            onClick={() => setShowTextAlt(!showTextAlt)}
            style={{
              minHeight: "44px",
              minWidth: "44px",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-mono)",
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--hairline-strong)",
              backgroundColor: showTextAlt ? "var(--canvas)" : "var(--surface)",
              color: "var(--ink)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-expanded={showTextAlt}
            aria-controls="ribbon-text-table"
          >
            {showTextAlt ? "Hide text data" : "Read as text"}
          </button>
        </div>
      </div>

      <RibbonLegend />

      {/* Signature SVG Load Ribbon */}
      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          marginTop: "var(--space-2)",
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", display: "block" }}
          role="img"
          aria-label="Recovery Load Ribbon chart illustrating independent cognitive, sensory, and physical strands flowing over the shaded capacity baseline floor and breaching at pressure points"
        >
          {/* Capacity Baseline and Pressure Points Floor */}
          <CapacityBaseline
            baseline={baseline}
            pressurePoints={pressurePoints}
            width={width}
            height={height}
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
          />

          {/* Three Unstacked Independent Organic Strands */}
          <g className="ribbon-strands-group">
            {/* Physical Strand (Sage) — Sits lowest, visible baseline thickness */}
            <path
              d={phyPath}
              fill="var(--axis-physical)"
              opacity="0.85"
              stroke="var(--axis-physical)"
              strokeWidth="0.75"
            />
            {/* Physical centerline for greyscale readability */}
            <path
              d={phyCenterPath}
              fill="none"
              stroke="#2E4A35"
              strokeWidth="1.2"
              opacity="0.7"
            />

            {/* Sensory Strand (Amber) — Middle strand, swells with noise/light */}
            <path
              d={senPath}
              fill="var(--axis-sensory)"
              opacity="0.82"
              stroke="var(--axis-sensory)"
              strokeWidth="0.75"
            />
            {/* Sensory centerline (dotted for greyscale distinction) */}
            <path
              d={senCenterPath}
              fill="none"
              stroke="#6B3A07"
              strokeWidth="1.2"
              strokeDasharray="2 3"
              opacity="0.7"
            />

            {/* Cognitive Strand (Teal) — Swells with mental strain, punches through capacity */}
            <path
              d={cogPath}
              fill="var(--axis-cognitive)"
              opacity="0.85"
              stroke="var(--axis-cognitive)"
              strokeWidth="0.75"
            />
            {/* Cognitive centerline (dashed for greyscale distinction) */}
            <path
              d={cogCenterPath}
              fill="none"
              stroke="#0E3C44"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.7"
            />
          </g>

          {/* Time Axis Grid Lines & Labels */}
          <g className="time-axis" fontFamily="var(--font-mono)" fontSize="10px">
            <line
              x1="0"
              y1={height - 25}
              x2={width}
              y2={height - 25}
              stroke="var(--hairline)"
              strokeWidth="1"
            />
            {HOURS.map((h, idx) => {
              const x = ((h.time - timelineStart) / totalMinutes) * width;
              return (
                <g key={idx}>
                  <line
                    x1={x}
                    y1={height - 25}
                    x2={x}
                    y2={height - 20}
                    stroke="var(--hairline-strong)"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={height - 8}
                    textAnchor={
                      idx === 0
                        ? "start"
                        : idx === HOURS.length - 1
                        ? "end"
                        : "middle"
                    }
                    fill="var(--muted)"
                  >
                    {h.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Accessible Text Alternative */}
      {showTextAlt && (
        <div id="ribbon-text-table" style={{ marginTop: "var(--space-4)" }}>
          <RibbonTextAlternative
            timeline={timeline}
            baseline={baseline}
            pressurePoints={pressurePoints}
          />
        </div>
      )}
    </div>
  );
};

