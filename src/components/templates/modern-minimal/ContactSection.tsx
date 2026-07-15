import React from "react"
import { ContactSection as ContactSectionType } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import AnimatedText from "./AnimatedText"
import MagneticButton from "./MagneticButton"
import ScrollReveal from "./ScrollReveal"
import GradientOrb from "./GradientOrb"

interface ContactSectionProps {
  contact: ContactSectionType
  theme: TemplateTheme
}

export default function ContactSection({ contact, theme }: ContactSectionProps) {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding: "12rem 2rem",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Background orbs */}
      <GradientOrb color={theme.primaryColor} size={700} x="30%" y="40%" opacity={0.1} duration={22} />
      <GradientOrb color={theme.secondaryColor} size={500} x="70%" y="60%" opacity={0.07} delay={4} duration={26} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Section label */}
        <ScrollReveal variant="fadeUp">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: theme.primaryColor,
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
              Contact
            </span>
          </div>
        </ScrollReveal>

        {/* Heading */}
        <div style={{ marginBottom: "1.5rem" }}>
          <AnimatedText
            text={contact.heading}
            as="h2"
            variant="wordReveal"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              margin: 0,
              background: `linear-gradient(135deg, ${theme.textColor} 0%, ${theme.primaryColor} 50%, ${theme.secondaryColor} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          />
        </div>

        {/* Subtext */}
        <ScrollReveal variant="fadeUp" delay={0.3}>
          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              lineHeight: 1.7,
              color: theme.textColor,
              opacity: 0.6,
              maxWidth: "550px",
              margin: "0 auto 3.5rem",
              fontWeight: 400,
            }}
          >
            {contact.message}
          </p>
        </ScrollReveal>

        {/* Buttons */}
        <ScrollReveal variant="fadeUp" delay={0.5}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {contact.email && (
              <MagneticButton href={`mailto:${contact.email}`} primaryColor={theme.primaryColor}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Get in Touch
              </MagneticButton>
            )}
            {contact.linkedin && (
              <MagneticButton
                href={contact.linkedin}
                primaryColor="transparent"
                style={{
                  color: theme.textColor,
                  border: `1.5px solid ${theme.textColor}20`,
                  background: `${theme.textColor}05`,
                  boxShadow: "none",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                LinkedIn
              </MagneticButton>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
