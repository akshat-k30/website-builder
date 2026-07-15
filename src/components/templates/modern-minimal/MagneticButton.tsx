import React, { ReactNode } from "react"

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  style?: React.CSSProperties
  className?: string
  strength?: number // Kept for API compatibility, unused in CSS version
  primaryColor?: string
}

export default function MagneticButton({
  children,
  href,
  onClick,
  style,
  className = "",
  primaryColor = "#000",
}: MagneticButtonProps) {

  const inner = (
    <div
      style={{ display: "inline-block", position: "relative" }}
    >
      <div
        className={`${className} css-magnetic-btn`}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "1rem 2.5rem",
          borderRadius: "100px",
          fontWeight: 600,
          fontSize: "1rem",
          letterSpacing: "-0.01em",
          cursor: "pointer",
          overflow: "hidden",
          color: "#fff",
          background: primaryColor,
          boxShadow: `0 4px 20px ${primaryColor}15`,
          ...style,
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} style={{ textDecoration: "none" }}>
        {inner}
      </a>
    )
  }

  return <div onClick={onClick} role="button" tabIndex={0}>{inner}</div>
}
