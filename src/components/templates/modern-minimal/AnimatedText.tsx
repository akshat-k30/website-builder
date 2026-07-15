"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef, useMemo } from "react"

interface AnimatedTextProps {
  text: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  variant?: "charReveal" | "wordReveal" | "fadeUp"
  delay?: number
  style?: React.CSSProperties
  className?: string
  staggerDelay?: number
}

export default function AnimatedText({
  text,
  as: Tag = "h1",
  variant = "charReveal",
  delay = 0,
  style,
  className = "",
  staggerDelay,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  const prefersReducedMotion = useReducedMotion()

  const MotionTag = motion.create(Tag)

  const words = useMemo(() => text.split(" "), [text])
  const chars = useMemo(() => text.split(""), [text])

  // Respect reduced motion preference
  if (prefersReducedMotion) {
    return <Tag className={className} style={style}>{text}</Tag>
  }

  if (variant === "fadeUp") {
    return (
      <MotionTag
        ref={ref as any}
        className={className}
        style={style}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {text}
      </MotionTag>
    )
  }

  if (variant === "wordReveal") {
    return (
      <Tag ref={ref as any} className={className} style={{ ...style, display: "flex", flexWrap: "wrap", gap: "0 0.3em" }}>
        {words.map((word, i) => (
          <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + i * (staggerDelay ?? 0.04),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Tag>
    )
  }

  // charReveal — default
  return (
    <Tag ref={ref as any} className={className} style={style} aria-label={text}>
      {chars.map((char, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span
            style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
            initial={{ y: "120%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + i * (staggerDelay ?? 0.02),
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden="true"
          >
            {char}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
