"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import Navigation from "./modern-minimal/Navigation"
import HeroSection from "./modern-minimal/HeroSection"
import AboutSection from "./modern-minimal/AboutSection"
import ExperienceSection from "./modern-minimal/ExperienceSection"
import SkillsSection from "./modern-minimal/SkillsSection"
import ContactSection from "./modern-minimal/ContactSection"
import FooterSection from "./modern-minimal/FooterSection"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

export default function ModernMinimal({ content, theme }: TemplateProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: `'Inter', ${theme.fontFamily}`,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        position: "relative",
      }}
    >
      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Subtle noise texture overlay for premium feel */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Floating navigation */}
      <Navigation
        name={content.hero.name}
        primaryColor={theme.primaryColor}
        backgroundColor={theme.backgroundColor}
        textColor={theme.textColor}
      />

      {/* Hero — full viewport */}
      <HeroSection hero={content.hero} theme={theme} />

      {/* About — large pull-quote typography */}
      <AboutSection about={content.about} theme={theme} />

      {/* Subtle section divider */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${theme.textColor}0a, transparent)`,
          }}
        />
      </div>

      {/* Experience — glass cards */}
      <ExperienceSection experience={content.experience} theme={theme} />

      {/* Subtle section divider */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${theme.textColor}0a, transparent)`,
          }}
        />
      </div>

      {/* Skills — bento grid */}
      <SkillsSection skills={content.skills} theme={theme} />

      {/* Contact — gradient text CTA */}
      <ContactSection contact={content.contact} theme={theme} />

      {/* Footer */}
      <FooterSection name={content.hero.name} theme={theme} />
    </div>
  )
}
