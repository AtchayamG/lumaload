import React from "react";

export interface ToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`luma-toggle-field ${className}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-2) 0",
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: "18px",
          height: "18px",
          marginTop: "2px",
          accentColor: "var(--axis-cognitive)",
          cursor: "pointer",
        }}
      />
      <div>
        <label
          htmlFor={id}
          style={{
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "var(--ink)",
            cursor: "pointer",
            display: "block",
          }}
        >
          {label}
        </label>
        {description && (
          <span style={{ fontSize: "0.8125rem", color: "var(--muted)", display: "block" }}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
