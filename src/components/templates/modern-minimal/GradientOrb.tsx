"use client"

import { motion } from "framer-motion"

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
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity: 0,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
      animate={{
        opacity: [0, opacity, opacity, 0, opacity],
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 15, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  )
}
