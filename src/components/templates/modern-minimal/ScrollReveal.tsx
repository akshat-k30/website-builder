import React, { ReactNode } from "react"

type RevealVariant = "fadeUp" | "fadeIn" | "scaleUp" | "slideLeft" | "slideRight"

interface ScrollRevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
  once?: boolean
  stagger?: boolean
  staggerDelay?: number
}

export default function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.7,
  className = "",
  style,
}: ScrollRevealProps) {
  
  return (
    <div
      className={`${className} css-reveal css-reveal-${variant}`}
      style={{
        ...style,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  )
}

export function ScrollRevealItem({
  children,
  className = "",
  style,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`${className} css-reveal-item`}
      style={style}
    >
      {children}
    </div>
  )
}
