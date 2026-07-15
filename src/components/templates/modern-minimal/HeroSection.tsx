"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, lazy, Suspense } from "react"
import { HeroSection as HeroSectionType } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import AnimatedText from "./AnimatedText"
import MagneticButton from "./MagneticButton"
import GradientOrb from "./GradientOrb"
import { ArrowDown } from "lucide-react"

const AmbientScene = lazy(() => import("./AmbientScene"))

interface HeroSectionProps {
  hero: HeroSectionType
  theme: TemplateTheme
}

export default function HeroSection({ hero, theme }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "8rem 2rem 6rem",
      }}
    >
      {/* Ambient background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <GradientOrb color={theme.primaryColor} size={800} x="70%" y="30%" opacity={0.12} duration={25} />
        <GradientOrb color={theme.secondaryColor} size={600} x="25%" y="60%" opacity={0.08} delay={3} duration={22} />
        <GradientOrb color={theme.primaryColor} size={400} x="80%" y="80%" opacity={0.06} delay={6} duration={28} />
      </div>

      {/* 3D Scene — lazy loaded */}
      <Suspense fallback={null}>
        <AmbientScene primaryColor={theme.primaryColor} secondaryColor={theme.secondaryColor} />
      </Suspense>

      {/* Content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "1000px",
          width: "100%",
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY,
        }}
      >
        {/* Photo */}
        {hero.photoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-block",
              marginBottom: "2.5rem",
              position: "relative",
            }}
          >
            {/* Glow ring */}
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.primaryColor}40, ${theme.secondaryColor}30, transparent)`,
                filter: "blur(8px)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.photoUrl}
              alt={hero.name}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                position: "relative",
                zIndex: 1,
                border: `3px solid ${theme.backgroundColor}`,
                boxShadow: `0 20px 60px ${theme.primaryColor}15`,
              }}
            />
          </motion.div>
        )}

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1rem",
            borderRadius: "100px",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: theme.primaryColor,
            backgroundColor: `${theme.primaryColor}0a`,
            border: `1px solid ${theme.primaryColor}15`,
            marginBottom: "2rem",
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            backgroundColor: theme.primaryColor,
            display: "inline-block",
          }} />
          {hero.name}
        </motion.div>

        {/* Main headline — massive typography */}
        <div style={{ marginBottom: "2.5rem" }}>
          <AnimatedText
            text={hero.tagline}
            as="h1"
            variant="charReveal"
            delay={0.6}
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: theme.textColor,
              margin: 0,
            }}
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}
        >
          <MagneticButton href="#contact" primaryColor={theme.primaryColor}>
            {hero.ctaText}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          color: theme.textColor,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
