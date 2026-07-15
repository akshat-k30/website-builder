import { AboutSection as AboutSectionType } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import ScrollReveal from "./ScrollReveal"
import AnimatedText from "./AnimatedText"

interface AboutSectionProps {
  about: AboutSectionType
  theme: TemplateTheme
}

export default function AboutSection({ about, theme }: AboutSectionProps) {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        padding: "10rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Section label */}
      <ScrollReveal variant="fadeUp" delay={0}>
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
            {about.title}
          </span>
        </div>
      </ScrollReveal>

      {/* Main content — large pull-quote style */}
      <AnimatedText
        text={about.content}
        as="p"
        variant="wordReveal"
        delay={0.15}
        staggerDelay={0.025}
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)",
          lineHeight: 1.45,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: theme.textColor,
          opacity: 0.85,
          maxWidth: "900px",
          margin: 0,
        }}
      />

      {/* Decorative gradient line */}
      <ScrollReveal variant="fadeIn" delay={0.6}>
        <div
          style={{
            marginTop: "5rem",
            height: "2px",
            width: "120px",
            background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor}, transparent)`,
            borderRadius: "2px",
          }}
        />
      </ScrollReveal>
    </section>
  )
}
