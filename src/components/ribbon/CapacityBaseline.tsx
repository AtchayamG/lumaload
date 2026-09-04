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

  // Calculate baseline Y coordinate
  // Baseline range: 0.5 to 1.0 maps to Y between 170 and 90 in a 240px height canvas
  const paddingBottom = 40;
  const paddingTop = 40;
  const usableHeight = height - paddingTop - paddingBottom;
  const baselineY = height - paddingBottom - baseline * usableHeight;

  return (
    <g className="capacity-baseline-group">
      {/* Pattern definitions for pressure points */}
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
            opacity="0.25"
          />
        </pattern>
        <linearGradient id="capacity-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--axis-capacity)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--axis-capacity)" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Shaded Capacity Floor beneath baseline */}
      <rect
        x="0"
        y={baselineY}
        width={width}
        height={height - baselineY - 25}
        fill="url(#capacity-gradient)"
      />

      {/* Capacity Baseline Line */}
      <line
        x1="0"
        y1={baselineY}
        x2={width}
        y2={baselineY}
        stroke="var(--axis-capacity)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.8"
      />

      {/* Capacity Baseline Label */}
      <text
        x={width - 8}
        y={baselineY - 6}
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="10px"
        fill="var(--axis-capacity)"
        fontWeight="600"
      >
        CAPACITY BASELINE ({Math.round(baseline * 100)}%)
      </text>

      {/* Pressure Points */}
      {pressurePoints.map((pp, idx) => {
        const x1 = Math.max(
          0,
          ((pp.startMinutes - timelineStart) / totalMinutes) * width
        );
        const x2 = Math.min(
          width,
          ((pp.endMinutes - timelineStart) / totalMinutes) * width
        );
        const rectWidth = Math.max(12, x2 - x1);

        const isHigh = pp.severity === "high";

        return (
          <g key={idx} className="pressure-point-highlight">
            {/* Cross-hatched pressure band */}
            <rect
              x={x1}
              y={20}
              width={rectWidth}
              height={height - 45}
              fill="url(#pressure-hatch-pattern)"
              stroke={isHigh ? "var(--danger)" : "var(--warning)"}
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.7"
            />

            {/* Top Indicator Pip & Label */}
            <rect
              x={x1}
              y={20}
              width={Math.min(rectWidth, 120)}
              height={16}
              fill={isHigh ? "var(--danger)" : "var(--warning)"}
              opacity="0.9"
              rx="2"
            />
            <text
              x={x1 + 4}
              y={32}
              fontFamily="var(--font-mono)"
              fontSize="9px"
              fill="#FFFFFF"
              fontWeight="600"
            >
              PRESSURE PT ({pp.severity.toUpperCase()})
            </text>
          </g>
        );
      })}
    </g>
  );
};
