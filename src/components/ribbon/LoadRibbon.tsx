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

  // Upper spline: left to right
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

  // Lower spline: right to left
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
  const [showTable, setShowTable] = useState(showTextAlternativeByDefault);

  const width = 840;
  const height = 230;
  const timelineStart = 360; // 06:00
  const timelineEnd = 1380; // 23:00
  const totalMinutes = timelineEnd - timelineStart;

  // Unstacked 3-strand spline paths
  const {
    cogRibbonPath,
    senRibbonPath,
    phyRibbonPath,
    cogCenterPath,
    senCenterPath,
    phyCenterPath,
  } = useMemo(() => {
    if (!timeline || timeline.length === 0) {
      return {
        cogRibbonPath: "",
        senRibbonPath: "",
        phyRibbonPath: "",
        cogCenterPath: "",
        senCenterPath: "",
        phyCenterPath: "",
      };
    }

    // Fixed centrelines (P0-3 requirement):
    // Cognitive upper third (y = 55)
    // Sensory middle third (y = 110)
    // Physical lower third (y = 165)
    const centerCogY = 55;
    const centerSenY = 110;
    const centerPhyY = 165;

    // Resample timeline at 5-minute intervals with rolling gaussian window to eliminate plateaus
    const step = 5;
    const smoothed: { time: number; cog: number; sen: number; phy: number }[] = [];

    for (let t = timelineStart; t <= timelineEnd; t += step) {
      // 25-minute smoothing window (5 points before, 5 points after)
      const windowPoints = timeline.filter((p) => Math.abs(p.timeMinutes - t) <= 25);
      if (windowPoints.length > 0) {
        let totalWeight = 0;
        let cSum = 0;
        let sSum = 0;
        let pSum = 0;

        for (const pt of windowPoints) {
          const dist = Math.abs(pt.timeMinutes - t);
          // Gaussian bell weight: exp(-0.5 * (dist / 12)^2)
          const weight = Math.exp(-0.5 * Math.pow(dist / 14, 2));
          totalWeight += weight;
          cSum += pt.cognitive * weight;
          sSum += pt.sensory * weight;
          pSum += pt.physical * weight;
        }

        smoothed.push({
          time: t,
          cog: cSum / totalWeight,
          sen: sSum / totalWeight,
          phy: pSum / totalWeight,
        });
      } else {
        smoothed.push({ time: t, cog: 0, sen: 0, phy: 0 });
      }
    }

    const minThickness = 6; // 6px guaranteed minimum thickness for low-demand visibility
    const maxThickness = 32;

    const cogUpper: [number, number][] = [];
    const cogLower: [number, number][] = [];
    const cogCenter: [number, number][] = [];

    const senUpper: [number, number][] = [];
    const senLower: [number, number][] = [];
    const senCenter: [number, number][] = [];

    const phyUpper: [number, number][] = [];
    const phyLower: [number, number][] = [];
    const phyCenter: [number, number][] = [];

    for (const pt of smoothed) {
      const x = ((pt.time - timelineStart) / totalMinutes) * width;

      // Cognitive strand: swells symmetrically around centerCogY
      const cogThick = minThickness + (Math.min(5, pt.cog) / 5) * maxThickness;
      cogUpper.push([x, centerCogY - cogThick / 2]);
      cogLower.push([x, centerCogY + cogThick / 2]);
      cogCenter.push([x, centerCogY]);

      // Sensory strand: swells symmetrically around centerSenY
      const senThick = minThickness + (Math.min(5, pt.sen) / 5) * maxThickness;
      senUpper.push([x, centerSenY - senThick / 2]);
      senLower.push([x, centerSenY + senThick / 2]);
      senCenter.push([x, centerSenY]);

      // Physical strand: swells symmetrically around centerPhyY (always >= 6px)
      const phyThick = minThickness + (Math.min(5, pt.phy) / 5) * maxThickness;
      phyUpper.push([x, centerPhyY - phyThick / 2]);
      phyLower.push([x, centerPhyY + phyThick / 2]);
      phyCenter.push([x, centerPhyY]);
    }

    return {
      cogRibbonPath: createSmoothRibbon(cogUpper, cogLower, 0.35),
      senRibbonPath: createSmoothRibbon(senUpper, senLower, 0.35),
      phyRibbonPath: createSmoothRibbon(phyUpper, phyLower, 0.35),
      cogCenterPath: catmullRomSplinePath(cogCenter, 0.35),
      senCenterPath: catmullRomSplinePath(senCenter, 0.35),
      phyCenterPath: catmullRomSplinePath(phyCenter, 0.35),
    };
  }, [timeline, width, timelineStart, timelineEnd, totalMinutes]);

  return (
    <div
      className={`load-ribbon-container ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--muted)",
          }}
        >
          Timeline: 06:00 to 23:00 · 3 Unstacked Organic Demand Strands
        </span>

        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          aria-expanded={showTable}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--axis-cognitive)",
            backgroundColor: "transparent",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-sm)",
            padding: "0 var(--space-3)",
            minHeight: "44px",
            minWidth: "44px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {showTable ? "Show visual ribbon" : "Read as text (table alternative)"}
        </button>
      </div>

      {showTable ? (
        <RibbonTextAlternative
          timeline={timeline}
          baseline={baseline}
          pressurePoints={pressurePoints}
        />
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
            role="img"
            aria-label="Unstacked Catmull-Rom Load Ribbon showing Cognitive, Sensory, and Physical load across 06:00 to 23:00"
          >
            {/* Background Grid Lines for Hours */}
            {HOURS.map((hr) => {
              const x = ((hr.time - timelineStart) / totalMinutes) * width;
              return (
                <g key={hr.time}>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={height - 25}
                    stroke="var(--hairline)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                  <text
                    x={x}
                    y={height - 8}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10px"
                    fill="var(--muted)"
                  >
                    {hr.label}
                  </text>
                </g>
              );
            })}

            {/* Capacity Baseline Shaded Floor & Breakthrough Hatches */}
            <CapacityBaseline
              baseline={baseline}
              pressurePoints={pressurePoints}
              width={width}
              height={height}
              timelineStart={timelineStart}
              timelineEnd={timelineEnd}
            />

            {/* STRAND 1: Physical Strand (Sage - Lower Third y=165, solid centerline) */}
            <path
              d={phyRibbonPath}
              fill="var(--axis-physical)"
              fillOpacity="0.75"
              style={{ mixBlendMode: "multiply" }}
            />
            <path
              d={phyCenterPath}
              fill="none"
              stroke="var(--axis-physical)"
              strokeWidth="1.5"
              opacity="0.8"
            />
            <text
              x="12"
              y="169"
              fontFamily="var(--font-mono)"
              fontSize="9px"
              fontWeight="700"
              fill="var(--axis-physical)"
            >
              PHY
            </text>

            {/* STRAND 2: Sensory Strand (Amber - Middle Third y=110, dotted centerline) */}
            <path
              d={senRibbonPath}
              fill="var(--axis-sensory)"
              fillOpacity="0.72"
              style={{ mixBlendMode: "multiply" }}
            />
            <path
              d={senCenterPath}
              fill="none"
              stroke="var(--axis-sensory)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              opacity="0.9"
            />
            <text
              x="12"
              y="114"
              fontFamily="var(--font-mono)"
              fontSize="9px"
              fontWeight="700"
              fill="var(--axis-sensory)"
            >
              SEN
            </text>

            {/* STRAND 3: Cognitive Strand (Teal - Upper Third y=55, dashed centerline) */}
            <path
              d={cogRibbonPath}
              fill="var(--axis-cognitive)"
              fillOpacity="0.7"
              style={{ mixBlendMode: "multiply" }}
            />
            <path
              d={cogCenterPath}
              fill="none"
              stroke="var(--axis-cognitive)"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              opacity="0.9"
            />
            <text
              x="12"
              y="59"
              fontFamily="var(--font-mono)"
              fontSize="9px"
              fontWeight="700"
              fill="var(--axis-cognitive)"
            >
              COG
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};