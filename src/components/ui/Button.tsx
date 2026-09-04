import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "44px",
    minWidth: "44px",
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "all var(--transition-fast)",
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: "0.8125rem" },
    md: { padding: "10px 20px", fontSize: "0.9375rem" },
    lg: { padding: "14px 28px", fontSize: "1.0625rem" },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--ink)",
      color: "var(--canvas)",
      borderColor: "var(--ink)",
    },
    secondary: {
      backgroundColor: "var(--surface)",
      color: "var(--ink)",
      borderColor: "var(--hairline-strong)",
    },
    danger: {
      backgroundColor: "var(--danger)",
      color: "#FFFFFF",
      borderColor: "var(--danger)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--ink)",
      borderColor: "transparent",
    },
  };

  return (
    <button
      className={`luma-btn luma-btn-${variant} ${className}`}
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};
