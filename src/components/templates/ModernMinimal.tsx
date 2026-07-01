"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

export default function ModernMinimal({ content, theme }: TemplateProps) {
  return (
    <div 
      className="min-h-screen font-sans antialiased transition-colors duration-500"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Header/Nav - Glassmorphism effect */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b transition-colors" style={{ backgroundColor: `${theme.backgroundColor}cc`, borderColor: `${theme.textColor}10` }}>
        <div className="px-8 py-5 max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight hover:scale-105 transition-transform cursor-pointer" style={{ color: theme.primaryColor }}>
            {content.hero.name}
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            <a href="#about" className="hover:-translate-y-0.5 transition-transform opacity-70 hover:opacity-100">About</a>
            <a href="#experience" className="hover:-translate-y-0.5 transition-transform opacity-70 hover:opacity-100">Experience</a>
            <a href="#contact" className="hover:-translate-y-0.5 transition-transform opacity-70 hover:opacity-100">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 py-32 md:py-48 max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15]">
            {content.hero.tagline}
          </h1>
          <button 
            className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {content.hero.ctaText}
          </button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-8 py-24 max-w-5xl mx-auto border-t" style={{ borderColor: `${theme.textColor}10` }}>
        <h2 className="text-sm font-bold tracking-widest uppercase mb-8" style={{ color: theme.secondaryColor }}>{content.about.title}</h2>
        <p className="text-2xl md:text-3xl leading-relaxed font-light opacity-90 max-w-4xl">
          {content.about.content}
        </p>
      </section>

      {/* Experience */}
      <section id="experience" className="px-8 py-24 max-w-5xl mx-auto border-t" style={{ borderColor: `${theme.textColor}10` }}>
        <h2 className="text-sm font-bold tracking-widest uppercase mb-16" style={{ color: theme.secondaryColor }}>Experience</h2>
        <div className="space-y-16">
          {content.experience.map((exp, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-16 group hover:translate-x-2 transition-transform duration-300">
              <div className="md:w-1/4 shrink-0 font-medium text-sm tracking-widest uppercase mt-1" style={{ color: theme.secondaryColor }}>
                {exp.period}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
                <div className="text-xl mb-6 font-medium" style={{ color: theme.primaryColor }}>{exp.company}</div>
                <ul className="space-y-3 opacity-75">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="leading-relaxed flex gap-3">
                      <span style={{ color: theme.primaryColor }}>—</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="px-8 py-24 max-w-5xl mx-auto border-t" style={{ borderColor: `${theme.textColor}10` }}>
        <h2 className="text-sm font-bold tracking-widest uppercase mb-16" style={{ color: theme.secondaryColor }}>Expertise</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {content.skills.categories.map((cat, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold mb-6">{cat.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill, sIdx) => (
                  <span key={sIdx} className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: `${theme.textColor}20` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-32 max-w-5xl mx-auto border-t text-center" style={{ borderColor: `${theme.textColor}10` }}>
        <h2 className="text-5xl font-extrabold tracking-tight mb-6">{content.contact.heading}</h2>
        <p className="text-xl opacity-75 mb-12 max-w-2xl mx-auto font-light">{content.contact.message}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {content.contact.email && (
            <a href={`mailto:${content.contact.email}`} className="px-8 py-4 rounded-full font-medium text-white shadow-lg hover:-translate-y-1 transition-transform" style={{ backgroundColor: theme.primaryColor }}>
              Email Me
            </a>
          )}
          {content.contact.linkedin && (
            <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full font-medium border-2 hover:bg-black/5 transition-all" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
              Connect on LinkedIn
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm opacity-50 font-medium tracking-wide border-t" style={{ borderColor: `${theme.textColor}10` }}>
        © {new Date().getFullYear()} {content.hero.name}. All rights reserved.
      </footer>
    </div>
  )
}
