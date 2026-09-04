import React from "react";
import { TimePointDemand } from "@/lib/load/capacity";
import { PressurePoint } from "@/lib/contracts/plan";

export interface RibbonTextAlternativeProps {
  timeline: TimePointDemand[];
  baseline: number;
  pressurePoints: PressurePoint[];
  className?: string;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export const RibbonTextAlternative: React.FC<RibbonTextAlternativeProps> = ({
  timeline,
  baseline,
  pressurePoints,
  className = "",
}) => {
  // Sample hourly or 30-min intervals for readability
  const hourlySamples = timeline.filter((pt) => pt.timeMinutes % 30 === 0);

  return (
    <div
      className={`ribbon-text-alternative ${className}`}
      style={{
        marginTop: "var(--space-4)",
        padding: "var(--space-4)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "var(--space-2)",
          color: "var(--ink)",
        }}
      >
        Recovery Load Table Alternative
      </h3>
      <p style={{ color: "var(--muted)", marginBottom: "var(--space-3)" }}>
        Text representation of anticipated cognitive, sensory, and physical demand
        measured against today&apos;s Capacity Baseline ({Math.round(baseline * 100)}%).
      </p>

      {pressurePoints.length > 0 && (
        <div
          style={{
            marginBottom: "var(--space-4)",
            padding: "var(--space-3)",
            backgroundColor: "var(--danger-surface)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <strong style={{ color: "var(--danger)" }}>
            Detected Pressure Points ({pressurePoints.length}):
          </strong>
          <ul style={{ margin: "var(--space-2) 0 0 var(--space-4)", padding: 0 }}>
            {pressurePoints.map((pp, idx) => (
              <li key={idx} style={{ color: "var(--ink)", margin: "4px 0" }}>
                {formatMinutes(pp.startMinutes)} – {formatMinutes(pp.endMinutes)}:{" "}
                <span style={{ textTransform: "uppercase", fontWeight: 600 }}>
                  {pp.severity} severity
                </span>{" "}
                — demand exceeds baseline capacity for{" "}
                {pp.endMinutes - pp.startMinutes} minutes.
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
          aria-label="Hourly recovery load data table"
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
              <th style={{ padding: "6px 8px" }}>Time</th>
              <th style={{ padding: "6px 8px", color: "var(--axis-cognitive)" }}>
                Cognitive (0-5)
              </th>
              <th style={{ padding: "6px 8px", color: "var(--axis-sensory)" }}>
                Sensory (0-5)
              </th>
              <th style={{ padding: "6px 8px", color: "var(--axis-physical)" }}>
                Physical (0-5)
              </th>
              <th style={{ padding: "6px 8px" }}>Total Ratio</th>
              <th style={{ padding: "6px 8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {hourlySamples.map((pt, idx) => {
              const ratio = Math.round((pt.totalDemand / 5) * 100) / 100;
              const isOver = ratio > baseline;
              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid var(--hairline)",
                    backgroundColor: isOver ? "var(--warning-surface)" : "transparent",
                  }}
                >
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                    {formatMinutes(pt.timeMinutes)}
                  </td>
                  <td style={{ padding: "6px 8px" }}>{pt.cognitive.toFixed(1)}</td>
                  <td style={{ padding: "6px 8px" }}>{pt.sensory.toFixed(1)}</td>
                  <td style={{ padding: "6px 8px" }}>{pt.physical.toFixed(1)}</td>
                  <td style={{ padding: "6px 8px" }}>{ratio.toFixed(2)}</td>
                  <td style={{ padding: "6px 8px" }}>
                    {isOver ? (
                      <span style={{ color: "var(--danger)", fontWeight: 600 }}>
                        High Demand
                      </span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>Tolerable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
