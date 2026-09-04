import React from "react";
import { PressurePoint } from "@/lib/contracts/plan";

export interface CapacityBaselineProps {
  baseline: number; // 0.0 to 1.0
  pressurePoints: PressurePoint[];
  width: number;
  height: number;
  timelineStart?: number;
  timelineEnd?: number;
}

export const CapacityBaseline: React.FC<CapacityBaselineProps> = ({
  baseline,
  pressurePoints,
  width,
  height,
  timelineStart = 360,
  timelineEnd = 1380,
}) => {
  const totalMinutes = timelineEnd - timelineStart;

  // Baseline Y coordinate calculation
  // Baseline range 0.5 to 1.0 maps to Y between 138 and 80 in a 280px canvas
  const baselineY = 200 - baseline * 115;
  const floorBottomY = height - 35;

  return (
    <g className="capacity-baseline-group">
      {/* Pattern definitions for pressure points and capacity fill */}
      <defs>
        <pattern
          id="pressure-hatch-pattern"
          width="8"
          height="8"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="var(--danger)"
            strokeWidth="2"
            opacity="0.35"
          />
        </pattern>
        <linearGradient id="capacity-floor-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--axis-capacity)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--axis-capacity)" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* Shaded Capacity Floor beneath baseline */}
      <rect
        x="0"
        y={baselineY}
        width={width}
        height={Math.max(0, floorBottomY - baselineY)}
        fill="url(#capacity-floor-gradient)"
      />

      {/* Capacity Baseline Line — The capacity threshold */}
      <line
        x1="0"
        y1={baselineY}
        x2={width}
        y2={baselineY}
        stroke="var(--axis-capacity)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        opacity="0.9"
      />

      {/* Capacity Baseline Pill Label */}
      <g transform={`translate(${width - 170}, ${baselineY - 18})`}>
        <rect
          x="0"
          y="0"
          width="164"
          height="16"
          rx="3"
          fill="var(--surface)"
          stroke="var(--axis-capacity)"
          strokeWidth="1"
          opacity="0.95"
        />
        <text
          x="82"
          y="11"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="9px"
          fill="var(--axis-capacity)"
          fontWeight="700"
          letterSpacing="0.04em"
        >
          CAPACITY BASELINE ({Math.round(baseline * 100)}%)
        </text>
      </g>

      {/* Pressure Points — Rendered as breakthrough zones extending through baseline */}
      {pressurePoints.map((pp, idx) => {
        const x1 = Math.max(
          0,
          ((pp.startMinutes - timelineStart) / totalMinutes) * width
        );
        const x2 = Math.min(
          width,
          ((pp.endMinutes - timelineStart) / totalMinutes) * width
        );
        const rectWidth = Math.max(16, x2 - x1);
        const isHigh = pp.severity === "high";

        return (
          <g key={idx} className="pressure-point-highlight">
            {/* Cross-hatched breakthrough zone punching above baseline */}
            <rect
              x={x1}
              y={25}
              width={rectWidth}
              height={floorBottomY - 25}
              fill="url(#pressure-hatch-pattern)"
              stroke={isHigh ? "var(--danger)" : "var(--warning)"}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.75"
            />

            {/* Pressure Point Top Badge */}
            <g transform={`translate(${x1}, 10)`}>
              <rect
                x="0"
                y="0"
                width={Math.min(rectWidth, 140)}
                height="16"
                rx="3"
                fill={isHigh ? "var(--danger)" : "var(--warning)"}
              />
              <text
                x={Math.min(rectWidth, 140) / 2}
                y="11"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="9px"
                fill="#FFFFFF"
                fontWeight="700"
                letterSpacing="0.04em"
              >
                PRESSURE PT ({pp.severity.toUpperCase()})
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

