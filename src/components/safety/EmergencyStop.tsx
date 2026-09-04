import React from "react";
import { EMERGENCY_DISCLAIMER, EMERGENCY_STOP_MESSAGE } from "@/lib/safety/dangerSigns";

export interface EmergencyStopProps {
  selectedSigns?: string[];
  onReset?: () => void;
}

export const EmergencyStop: React.FC<EmergencyStopProps> = ({
  selectedSigns = [],
  onReset,
}) => {
  return (
    <main
      id="main-content"
      role="alert"
      aria-live="assertive"
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6) var(--space-4)",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          width: "100%",
          backgroundColor: "var(--danger-surface)",
          border: "2px solid var(--danger)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-8)",
          color: "var(--ink)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "4px 10px",
            backgroundColor: "var(--danger)",
            color: "#FFFFFF",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--space-4)",
          }}
        >
          Emergency Safety Stop
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            lineHeight: 1.2,
            color: "var(--danger)",
            marginBottom: "var(--space-4)",
          }}
        >
          {EMERGENCY_STOP_MESSAGE}
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            lineHeight: 1.6,
            marginBottom: "var(--space-6)",
            color: "var(--ink)",
          }}
        >
          One or more danger signs were identified. For potential head injuries,
          immediate professional medical assessment is critical. LumaLoad does not
          provide guidance when danger signs are present.
        </p>

        {selectedSigns.length > 0 && (
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--danger-border)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontFamily: "var(--font-mono)",
                color: "var(--danger)",
                marginBottom: "var(--space-2)",
              }}
            >
              Reported Danger Signs:
            </strong>
            <ul
              style={{
                margin: 0,
                paddingLeft: "var(--space-5)",
                fontSize: "0.9375rem",
              }}
            >
              {selectedSigns.map((sign, idx) => (
                <li key={idx} style={{ margin: "4px 0" }}>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            padding: "var(--space-3)",
            backgroundColor: "transparent",
            borderLeft: "3px solid var(--danger)",
            marginBottom: "var(--space-6)",
            fontSize: "0.9375rem",
            color: "var(--muted)",
          }}
        >
          {EMERGENCY_DISCLAIMER}
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--hairline-strong)",
              color: "var(--ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            ← Return to check-in
          </button>
        )}
      </div>
    </main>
  );
};
