import React from "react"

interface GradientOrbProps {
  color: string
  size?: number
  x?: string
  y?: string
  delay?: number
  duration?: number
  opacity?: number
  blur?: number
}

export default function GradientOrb({
  color,
  size = 600,
  x = "50%",
  y = "50%",
  delay = 0,
  duration = 20,
  opacity = 0.15,
  blur = 120,
}: GradientOrbProps) {
  return (
    <div
      className="css-orb"
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: x,
        top: y,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity,
      }}
    />
  )
}
