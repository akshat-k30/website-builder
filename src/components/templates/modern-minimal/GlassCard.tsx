import React, { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  backgroundColor?: string
  borderColor?: string
  hoverScale?: number // Kept for API compatibility
  tilt?: boolean // Kept for API compatibility
}

export default function GlassCard({
  children,
  className = "",
  style,
  backgroundColor = "rgba(255,255,255,0.05)",
  borderColor = "rgba(255,255,255,0.08)",
}: GlassCardProps) {
  
  return (
    <div
      className={`${className} css-glass-card`}
      style={{
        position: "relative",
        background: backgroundColor,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${borderColor}`,
        borderRadius: "24px",
        padding: "2rem",
        overflow: "hidden",
        ...style,
      }}
    >
      <style>{`
        .css-glass-card {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .css-glass-card:hover {
          transform: scale(1.02);
          box-shadow: 0 25px 60px rgba(0,0,0,0.08), 0 0 0 1px ${borderColor};
        }
      `}</style>
      
      {/* Subtle shine gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  )
}
