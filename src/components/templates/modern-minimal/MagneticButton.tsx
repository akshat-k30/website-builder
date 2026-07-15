"use client"

import { useRef, useState, useCallback, ReactNode } from "react"
import { motion } from "framer-motion"

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  style?: React.CSSProperties
  className?: string
  strength?: number
  primaryColor?: string
}

export default function MagneticButton({
  children,
  href,
  onClick,
  style,
  className = "",
  strength = 0.3,
  primaryColor = "#000",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      setPosition({ x, y })
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      style={{ display: "inline-block", position: "relative" }}
    >
      <motion.div
        className={className}
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
          boxShadow: isHovered
            ? `0 20px 40px ${primaryColor}30, 0 0 0 1px ${primaryColor}20`
            : `0 4px 20px ${primaryColor}15`,
          ...style,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Shine overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)",
            opacity: 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </motion.div>
    </motion.div>
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
