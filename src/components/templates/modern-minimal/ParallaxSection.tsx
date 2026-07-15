import React, { ReactNode } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  className?: string
  style?: React.CSSProperties
}

export default function ParallaxSection({
  children,
  className = "",
  style,
}: ParallaxSectionProps) {

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <div>
        {children}
      </div>
    </div>
  )
}
