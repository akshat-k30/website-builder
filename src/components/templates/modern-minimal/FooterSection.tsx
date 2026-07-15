"use client"

import { TemplateTheme } from "@/lib/templates"
import ScrollReveal from "./ScrollReveal"

interface FooterSectionProps {
  name: string
  theme: TemplateTheme
}

export default function FooterSection({ name, theme }: FooterSectionProps) {
  return (
    <ScrollReveal variant="fadeIn" delay={0.2}>
      <footer
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Top divider */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto 2.5rem",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${theme.textColor}10, transparent)`,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: theme.textColor,
            opacity: 0.3,
            letterSpacing: "0.04em",
          }}
        >
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span>{name}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>All rights reserved</span>
        </div>
      </footer>
    </ScrollReveal>
  )
}
