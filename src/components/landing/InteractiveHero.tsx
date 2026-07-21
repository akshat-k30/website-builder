"use client"

import { useEffect, useRef } from "react"

/**
 * InteractiveHero — a lightweight, mouse-reactive hero background.
 * No WebGL / Three.js. Cursor position drives CSS custom properties
 * (rAF-throttled) that power a spotlight glow, a reveal dot-grid, and
 * parallax gradient orbs. Honours prefers-reduced-motion.
 */
export default function InteractiveHero() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`)
        el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`)
        el.style.setProperty("--dx", (x - 0.5).toFixed(3))
        el.style.setProperty("--dy", (y - 0.5).toFixed(3))
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden className="ih-root absolute inset-0 -z-10">
      <div className="ih-orb ih-orb-1" />
      <div className="ih-orb ih-orb-2" />
      <div className="ih-orb ih-orb-3" />
      <div className="ih-dots" />
      <div className="ih-spotlight" />
    </div>
  )
}
