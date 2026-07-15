"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { SkillsSection as SkillsSectionType } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import ScrollReveal from "./ScrollReveal"
import GradientOrb from "./GradientOrb"

interface SkillsSectionProps {
  skills: SkillsSectionType
  theme: TemplateTheme
}

function SkillPill({
  skill,
  index,
  theme,
}: {
  skill: string
  index: number
  theme: TemplateTheme
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.03,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.06,
        backgroundColor: `${theme.primaryColor}15`,
        borderColor: `${theme.primaryColor}30`,
      }}
      style={{
        display: "inline-block",
        padding: "0.5rem 1.1rem",
        borderRadius: "100px",
        fontSize: "0.82rem",
        fontWeight: 500,
        color: theme.textColor,
        opacity: 0.75,
        backgroundColor: `${theme.textColor}05`,
        border: `1px solid ${theme.textColor}0a`,
        cursor: "default",
        letterSpacing: "-0.01em",
        transition: "background-color 0.2s, border-color 0.2s",
      }}
    >
      {skill}
    </motion.span>
  )
}

function SkillCategory({
  name,
  items,
  index,
  theme,
}: {
  name: string
  items: string[]
  index: number
  theme: TemplateTheme
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        padding: "2rem",
        borderRadius: "20px",
        backgroundColor: `${theme.textColor}02`,
        border: `1px solid ${theme.textColor}06`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${theme.primaryColor}40, transparent)`,
        }}
      />

      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: theme.textColor,
          marginBottom: "1.25rem",
          margin: "0 0 1.25rem 0",
          opacity: 0.9,
        }}
      >
        {name}
      </h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {items.map((skill, sIdx) => (
          <SkillPill key={sIdx} skill={skill} index={sIdx} theme={theme} />
        ))}
      </div>
    </motion.div>
  )
}

export default function SkillsSection({ skills, theme }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      style={{
        position: "relative",
        padding: "8rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Background orb */}
      <GradientOrb
        color={theme.secondaryColor}
        size={500}
        x="90%"
        y="20%"
        opacity={0.06}
        duration={20}
      />

      {/* Section header */}
      <ScrollReveal variant="fadeUp">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: theme.primaryColor,
              opacity: 0.4,
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: theme.primaryColor,
              opacity: 0.8,
            }}
          >
            Expertise
          </span>
        </div>
      </ScrollReveal>

      {/* Bento grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {skills.categories.map((cat, idx) => (
          <SkillCategory
            key={idx}
            name={cat.name}
            items={cat.items}
            index={idx}
            theme={theme}
          />
        ))}
      </div>
    </section>
  )
}
