"use client";

import React, { useState } from "react";
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
 * Creates a smooth closed SVG ribbon path between upper and lower boundary points.
 */
function createRibbonPath(
  upperPoints: [number, number][],
  lowerPoints: [number, number][]
): string {
  if (upperPoints.length < 2 || lowerPoints.length < 2) return "";

  // 1. Move to first upper point
  let d = `M ${upperPoints[0][0].toFixed(1)} ${upperPoints[0][1].toFixed(1)}`;

  // 2. Smooth curves through upper points (left to right)
  for (let i = 0; i < upperPoints.length - 1; i++) {
    const p0 = upperPoints[i];
    const p1 = upperPoints[i + 1];
    const cp1x = (p0[0] + p1[0]) / 2;
    const cp1y = p0[1];
    const cp2x = (p0[0] + p1[0]) / 2;
    const cp2y = p1[1];
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  }

  // 3. Line to last lower point
  const lastLower = lowerPoints[lowerPoints.length - 1];
  d += ` L ${lastLower[0].toFixed(1)} ${lastLower[1].toFixed(1)}`;

  // 4. Smooth curves through lower points (right to left)
  for (let i = lowerPoints.length - 1; i > 0; i--) {
    const p0 = lowerPoints[i];
    const p1 = lowerPoints[i - 1];
    const cp1x = (p0[0] + p1[0]) / 2;
    const cp1y = p0[1];
    const cp2x = (p0[0] + p1[0]) / 2;
    const cp2y = p1[1];
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
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
  const height = 260;
  const timelineStart = 360;
  const timelineEnd = 1380;
  const totalMinutes = timelineEnd - timelineStart;

  // Base Y coordinate where strands anchor (at y = 190)
  const anchorY = 190;
  const scale = 5.5; // pixels per demand point (0-5 demand = up to ~28px thickness)

  // Calculate coordinates for stacked strands:
  // Physical: sits at anchorY -> anchorY - phy
  // Sensory: sits above physical -> anchorY - phy - sen
  // Cognitive: sits above sensory -> anchorY - phy - sen - cog
  const basePoints: [number, number][] = [];
  const phyUpper: [number, number][] = [];
  const senUpper: [number, number][] = [];
  const cogUpper: [number, number][] = [];

  // Downsample to every 15 minutes for smooth organic spline curves
  const sampled = timeline.filter((pt) => pt.timeMinutes % 15 === 0);

  for (const pt of sampled) {
    const x = ((pt.timeMinutes - timelineStart) / totalMinutes) * width;

    const minThickness = 2;
    const phyThickness = Math.max(minThickness, pt.physical * scale);
    const senThickness = Math.max(minThickness, pt.sensory * scale);
    const cogThickness = Math.max(minThickness, pt.cognitive * scale);

    const yBase = anchorY;
    const yPhy = yBase - phyThickness;
    const ySen = yPhy - senThickness;
    const yCog = ySen - cogThickness;

    basePoints.push([x, yBase]);
    phyUpper.push([x, yPhy]);
    senUpper.push([x, ySen]);
    cogUpper.push([x, yCog]);
  }

  const phyPath = createRibbonPath(phyUpper, basePoints);
  const senPath = createRibbonPath(senUpper, phyUpper);
  const cogPath = createRibbonPath(cogUpper, senUpper);

  return (
    <div
      className={`load-ribbon-container ${className}`}
      style={{
        width: "100%",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-2)",
          flexWrap: "wrap",
          gap: "var(--space-2)",
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
            LumaLoad planning estimate — not a clinical score
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <button
            type="button"
            onClick={() => setShowTextAlt(!showTextAlt)}
            style={{
              fontSize: "0.8125rem",
              fontFamily: "var(--font-mono)",
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--hairline-strong)",
              backgroundColor: showTextAlt ? "var(--canvas)" : "var(--surface)",
              color: "var(--ink)",
              cursor: "pointer",
            }}
            aria-expanded={showTextAlt}
            aria-controls="ribbon-text-table"
          >
            {showTextAlt ? "Hide text data" : "Read as text"}
          </button>
        </div>
      </div>

      <RibbonLegend />

      {/* The Signature SVG Load Ribbon */}
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
          aria-label="Recovery Load Ribbon chart illustrating cognitive, sensory, and physical demand against capacity baseline"
        >
          {/* Capacity Baseline and Pressure Points */}
          <CapacityBaseline
            baseline={baseline}
            pressurePoints={pressurePoints}
            width={width}
            height={height}
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
          />

          {/* Ribbon Strands */}
          <g className="ribbon-strands-group">
            {/* Physical Strand (Sage) */}
            <path
              d={phyPath}
              fill="var(--axis-physical)"
              opacity="0.85"
              stroke="var(--axis-physical)"
              strokeWidth="0.5"
            />

            {/* Sensory Strand (Amber) */}
            <path
              d={senPath}
              fill="var(--axis-sensory)"
              opacity="0.88"
              stroke="var(--axis-sensory)"
              strokeWidth="0.5"
            />

            {/* Cognitive Strand (Teal) */}
            <path
              d={cogPath}
              fill="var(--axis-cognitive)"
              opacity="0.92"
              stroke="var(--axis-cognitive)"
              strokeWidth="0.5"
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
                    textAnchor={idx === 0 ? "start" : idx === HOURS.length - 1 ? "end" : "middle"}
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
        <div id="ribbon-text-table">
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
