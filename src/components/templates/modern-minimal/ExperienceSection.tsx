import React from "react"
import { ExperienceItem } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import GlassCard from "./GlassCard"
import ScrollReveal from "./ScrollReveal"
import { Briefcase } from "lucide-react"

interface ExperienceSectionProps {
  experience: ExperienceItem[]
  theme: TemplateTheme
}

function ExperienceCard({
  exp,
  index,
  theme,
}: {
  exp: ExperienceItem
  index: number
  theme: TemplateTheme
}) {

  return (
    <div
      className="css-reveal css-reveal-fadeUp"
      style={{
        animationDelay: `${Math.min(index * 0.12, 0.4)}s`,
        animationDuration: "0.7s"
      }}
    >
      <GlassCard
        backgroundColor={`${theme.textColor}03`}
        borderColor={`${theme.textColor}08`}
        style={{ padding: "2.5rem" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: theme.textColor,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {exp.role}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <Briefcase size={14} style={{ color: theme.primaryColor, opacity: 0.7 }} />
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: theme.primaryColor,
                  opacity: 0.85,
                }}
              >
                {exp.company}
              </span>
            </div>
          </div>

          {/* Period badge */}
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: theme.textColor,
              opacity: 0.45,
              padding: "0.35rem 0.9rem",
              borderRadius: "100px",
              border: `1px solid ${theme.textColor}10`,
              backgroundColor: `${theme.textColor}04`,
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            {exp.period}
          </span>
        </div>

        {/* Highlights */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {exp.highlights.map((highlight, hIdx) => (
            <li
              key={hIdx}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                fontSize: "0.95rem",
                lineHeight: 1.65,
                color: theme.textColor,
                opacity: 0.7,
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: theme.primaryColor,
                  opacity: 0.5,
                  marginTop: "0.55rem",
                  flexShrink: 0,
                }}
              />
              {highlight}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}

export default function ExperienceSection({ experience, theme }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      style={{
        position: "relative",
        padding: "8rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
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
            Experience
          </span>
        </div>
      </ScrollReveal>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {experience.map((exp, idx) => (
          <ExperienceCard key={idx} exp={exp} index={idx} theme={theme} />
        ))}
      </div>
    </section>
  )
}
