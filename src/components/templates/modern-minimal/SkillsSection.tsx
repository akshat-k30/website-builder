import React from "react"
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
    <span
      className="css-reveal css-reveal-scaleUp css-skill-pill"
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
        animationDelay: `${index * 0.03}s`,
        animationDuration: "0.4s",
      }}
    >
      <style>{`
        .css-skill-pill {
          transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }
        .css-skill-pill:hover {
          transform: scale(1.06);
          background-color: ${theme.primaryColor}15 !important;
          border-color: ${theme.primaryColor}30 !important;
        }
      `}</style>
      {skill}
    </span>
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

  return (
    <div
      className="css-reveal css-reveal-fadeUp"
      style={{
        padding: "2rem",
        borderRadius: "20px",
        backgroundColor: `${theme.textColor}02`,
        border: `1px solid ${theme.textColor}06`,
        position: "relative",
        overflow: "hidden",
        animationDelay: `${index * 0.15}s`,
        animationDuration: "0.6s"
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
    </div>
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
