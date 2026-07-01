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
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-opacity-70 border-b transition-colors shadow-sm" style={{ backgroundColor: `${theme.backgroundColor}dd`, borderColor: `${theme.textColor}10` }}>
        <div className="px-8 py-5 max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity cursor-pointer" style={{ color: theme.primaryColor }}>
            {content.hero.name}
          </div>
          <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest">
            <a href="#about" className="hover:-translate-y-0.5 transition-transform opacity-60 hover:opacity-100">About</a>
            <a href="#experience" className="hover:-translate-y-0.5 transition-transform opacity-60 hover:opacity-100">Experience</a>
            <a href="#contact" className="hover:-translate-y-0.5 transition-transform opacity-60 hover:opacity-100">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 py-32 md:py-48 max-w-6xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-16 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: theme.primaryColor }}></div>
        <div className="flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15]">
            {content.hero.tagline}
          </h1>
          <button 
            className="px-10 py-4 rounded-full text-white font-bold text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {content.hero.ctaText}
          </button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-8 py-32 max-w-6xl mx-auto border-t" style={{ borderColor: `${theme.textColor}10` }}>
        <h2 className="text-xs font-black tracking-widest uppercase mb-10" style={{ color: theme.secondaryColor }}>{content.about.title}</h2>
        <p className="text-2xl md:text-4xl leading-snug font-medium opacity-90 max-w-4xl">
          {content.about.content}
        </p>
      </section>

      {/* Experience */}
      <section id="experience" className="px-8 py-32 max-w-6xl mx-auto border-t bg-black/5" style={{ borderColor: `${theme.textColor}10`, backgroundColor: `${theme.textColor}03` }}>
        <h2 className="text-xs font-black tracking-widest uppercase mb-16" style={{ color: theme.secondaryColor }}>Experience</h2>
        <div className="space-y-20">
          {content.experience.map((exp, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-20 group">
              <div className="md:w-1/4 shrink-0 font-bold text-sm tracking-widest uppercase mt-2 opacity-50">
                {exp.period}
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-extrabold mb-3 group-hover:translate-x-2 transition-transform duration-300">{exp.role}</h3>
                <div className="text-xl mb-8 font-semibold" style={{ color: theme.primaryColor }}>{exp.company}</div>
                <ul className="space-y-4 opacity-75">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="leading-relaxed flex gap-4 text-lg">
                      <span className="font-bold opacity-50" style={{ color: theme.primaryColor }}>/</span>
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
      <section className="px-8 py-32 max-w-6xl mx-auto border-t" style={{ borderColor: `${theme.textColor}10` }}>
        <h2 className="text-xs font-black tracking-widest uppercase mb-16" style={{ color: theme.secondaryColor }}>Expertise</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {content.skills.categories.map((cat, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-extrabold mb-8">{cat.name}</h3>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((skill, sIdx) => (
                  <span key={sIdx} className="px-5 py-2.5 rounded-full text-sm font-bold bg-black/5 dark:bg-white/5 transition-colors hover:bg-black/10 dark:hover:bg-white/10" style={{ backgroundColor: `${theme.textColor}08` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-40 mx-auto text-center" style={{ backgroundColor: `${theme.primaryColor}08` }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">{content.contact.heading}</h2>
          <p className="text-xl md:text-2xl opacity-75 mb-16 max-w-2xl mx-auto font-medium">{content.contact.message}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {content.contact.email && (
              <a href={`mailto:${content.contact.email}`} className="px-10 py-5 rounded-full font-bold text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all text-lg" style={{ backgroundColor: theme.primaryColor }}>
                Email Me
              </a>
            )}
            {content.contact.linkedin && (
              <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="px-10 py-5 rounded-full font-bold border-2 hover:bg-black/5 transition-all text-lg" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
                Connect on LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-xs font-bold opacity-40 uppercase tracking-widest bg-black/5" style={{ backgroundColor: `${theme.textColor}05` }}>
        © {new Date().getFullYear()} {content.hero.name}. All rights reserved.
      </footer>
    </div>
  )
}
