import { HeroSection as HeroSectionType } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import AnimatedText from "./AnimatedText"
import MagneticButton from "./MagneticButton"
import GradientOrb from "./GradientOrb"
import { ArrowDown } from "lucide-react"
import AmbientScene from "./AmbientScene"

interface HeroSectionProps {
  hero: HeroSectionType
  theme: TemplateTheme
}

export default function HeroSection({ hero, theme }: HeroSectionProps) {

  return (
    <section
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

      {/* 3D Scene replacement (CSS Ambient) */}
      <AmbientScene primaryColor={theme.primaryColor} secondaryColor={theme.secondaryColor} />

      {/* Content */}
      <div
        className="css-reveal css-reveal-fadeIn"
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "1000px",
          width: "100%",
          animationDuration: "1s"
        }}
      >
        {/* Photo */}
        {hero.photoUrl && (
          <div
            className="css-reveal css-reveal-scaleUp"
            style={{
              display: "inline-block",
              marginBottom: "2.5rem",
              position: "relative",
              animationDelay: "0.2s",
              animationDuration: "0.8s"
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
          </div>
        )}

        {/* Subtitle */}
        <div
          className="css-reveal css-reveal-fadeUp"
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
            animationDelay: "0.4s"
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            backgroundColor: theme.primaryColor,
            display: "inline-block",
          }} />
          {hero.name}
        </div>

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
        <div
          className="css-reveal css-reveal-fadeUp"
          style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", animationDelay: "1.4s" }}
        >
          <MagneticButton href="#contact" primaryColor={theme.primaryColor}>
            {hero.ctaText}
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="css-reveal css-reveal-fadeIn"
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
          animationDelay: "2.5s",
          animationDuration: "1s"
        }}
      >
        <span style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>
          Scroll
        </span>
        <div className="css-bounce">
          <ArrowDown size={16} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  )
}
