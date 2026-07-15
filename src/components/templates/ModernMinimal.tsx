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

      <style>{`
        /* Global Template Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(110%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes pulseSubtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .css-reveal {
          opacity: 0;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .css-reveal.is-visible.css-reveal-fadeUp { animation-name: fadeUp; }
        .css-reveal.is-visible.css-reveal-fadeIn { animation-name: fadeIn; }
        .css-reveal.is-visible.css-reveal-scaleUp { animation-name: scaleUp; }
        .css-reveal.is-visible.css-reveal-slideUp { animation-name: slideUp; }
        .css-reveal.is-visible.css-reveal-slideDown { animation-name: slideDown; opacity: 1; }

        /* Fallback if JS is disabled */
        .no-js .css-reveal { opacity: 1; animation: none; }

        .css-orb { animation: orbFloat 20s infinite alternate ease-in-out; }
        .css-bounce { animation: bounceSubtle 1.5s infinite ease-in-out; }
        .css-pulse { animation: pulseSubtle 2s infinite ease-in-out; }

        html { scroll-behavior: smooth; }
      `}</style>

      {/* Vanilla JS Scroll Reveal Observer */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const init = () => {
                const observer = new IntersectionObserver((entries, obs) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('is-visible');
                      obs.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
                
                document.querySelectorAll('.css-reveal:not(.is-visible)').forEach((el) => {
                  observer.observe(el);
                });
              };
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
              } else {
                init();
              }

              // For dynamic re-renders in editors (like LivePreview)
              // We set up a MutationObserver to watch for new .css-reveal elements
              const mutationObserver = new MutationObserver((mutations) => {
                let shouldInit = false;
                for (const m of mutations) {
                  if (m.addedNodes.length > 0) {
                    shouldInit = true;
                    break;
                  }
                }
                if (shouldInit) init();
              });
              mutationObserver.observe(document.body, { childList: true, subtree: true });
            })();
          `,
        }}
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
