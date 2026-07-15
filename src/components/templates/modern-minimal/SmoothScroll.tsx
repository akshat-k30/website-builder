"use client"

import { useEffect, useRef, ReactNode } from "react"

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lenis: any = null
    let raf: number

    const initLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default
        if (!wrapperRef.current) return

        lenis = new Lenis({
          wrapper: wrapperRef.current,
          content: wrapperRef.current.firstElementChild as HTMLElement,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5,
        })

        const animate = (time: number) => {
          lenis?.raf(time)
          raf = requestAnimationFrame(animate)
        }
        raf = requestAnimationFrame(animate)
      } catch {
        // Lenis not available — fall back to native scroll
      }
    }

    initLenis()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      lenis?.destroy()
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <div>{children}</div>
    </div>
  )
}
