"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ReactNode, useRef, useCallback } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  backgroundColor?: string
  borderColor?: string
  hoverScale?: number
  tilt?: boolean
}

export default function GlassCard({
  children,
  className = "",
  style,
  backgroundColor = "rgba(255,255,255,0.05)",
  borderColor = "rgba(255,255,255,0.08)",
  hoverScale = 1.02,
  tilt = true,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || !tilt) return
      const rect = ref.current.getBoundingClientRect()
      const normalX = (e.clientX - rect.left) / rect.width - 0.5
      const normalY = (e.clientY - rect.top) / rect.height - 0.5
      x.set(normalX)
      y.set(normalY)
    },
    [x, y, tilt]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        background: backgroundColor,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${borderColor}`,
        borderRadius: "24px",
        padding: "2rem",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        perspective: "1000px",
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        ...style,
      }}
      whileHover={{
        scale: hoverScale,
        boxShadow: `0 25px 60px rgba(0,0,0,0.08), 0 0 0 1px ${borderColor}`,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Subtle shine gradient on hover */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  )
}
