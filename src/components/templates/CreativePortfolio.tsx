"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

export default function CreativePortfolio({ content, theme }: TemplateProps) {
  return (
    <div 
      className="min-h-screen font-serif transition-colors duration-500"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <header className="py-10 flex justify-between items-center border-b" style={{ borderColor: `${theme.textColor}20` }}>
          <div className="text-2xl font-bold tracking-widest uppercase" style={{ color: theme.primaryColor }}>
            {content.hero.name}
          </div>
          <div className="flex gap-8 text-sm uppercase tracking-widest font-semibold">
            <a href="#about" className="hover:opacity-60 transition-opacity">About</a>
            <a href="#work" className="hover:opacity-60 transition-opacity">Work</a>
            <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </header>

        {/* Hero */}
        <section className="py-32 md:py-48 text-center max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] font-semibold mb-8" style={{ color: theme.secondaryColor }}>
            Welcome to my portfolio
          </p>
          <h1 className="text-6xl md:text-8xl font-medium leading-tight mb-12" style={{ color: theme.primaryColor }}>
            {content.hero.tagline}
          </h1>
          <button 
            className="px-10 py-5 uppercase tracking-widest text-sm font-semibold border transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            style={{ 
              borderColor: theme.primaryColor,
              color: theme.primaryColor
            }}
          >
            {content.hero.ctaText}
          </button>
        </section>

        {/* About */}
        <section id="about" className="py-24 border-t grid md:grid-cols-12 gap-12" style={{ borderColor: `${theme.textColor}20` }}>
          <div className="md:col-span-4">
            <h2 className="text-4xl md:text-5xl font-medium" style={{ color: theme.primaryColor }}>
              {content.about.title}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-3xl leading-relaxed font-light opacity-90">
              {content.about.content}
            </p>
          </div>
        </section>

        {/* Experience (Work) */}
        <section id="work" className="py-24 border-t" style={{ borderColor: `${theme.textColor}20` }}>
          <h2 className="text-4xl md:text-5xl font-medium mb-20 text-center" style={{ color: theme.primaryColor }}>
            Selected Experience
          </h2>
          <div className="space-y-24">
            {content.experience.map((exp, idx) => (
              <div key={idx} className="grid md:grid-cols-12 gap-8 items-start group">
                <div className="md:col-span-3 text-sm font-semibold uppercase tracking-widest opacity-60 mt-2">
                  {exp.period}
                </div>
                <div className="md:col-span-9">
                  <h3 className="text-4xl font-medium mb-4 group-hover:translate-x-2 transition-transform" style={{ color: theme.primaryColor }}>
                    {exp.role}
                  </h3>
                  <div className="text-xl font-sans mb-8 tracking-wide" style={{ color: theme.secondaryColor }}>
                    {exp.company}
                  </div>
                  <ul className="space-y-4 font-sans text-lg opacity-80 max-w-3xl">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
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
        <section className="py-24 border-t" style={{ borderColor: `${theme.textColor}20` }}>
           <h2 className="text-4xl md:text-5xl font-medium mb-16 text-center" style={{ color: theme.primaryColor }}>
            Skills & Expertise
          </h2>
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {content.skills.categories.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-xl uppercase tracking-widest font-semibold mb-8" style={{ color: theme.secondaryColor }}>
                  {cat.name}
                </h3>
                <div className="flex flex-col gap-4 font-sans text-lg opacity-80">
                  {cat.items.map((skill, sIdx) => (
                    <span key={sIdx}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32 border-t text-center" style={{ borderColor: `${theme.textColor}20` }}>
          <h2 className="text-6xl md:text-7xl font-medium mb-8" style={{ color: theme.primaryColor }}>
            {content.contact.heading}
          </h2>
          <p className="text-2xl font-light opacity-80 mb-16 max-w-2xl mx-auto">
            {content.contact.message}
          </p>
          <div className="flex justify-center gap-8 font-sans">
            {content.contact.email && (
              <a href={`mailto:${content.contact.email}`} className="text-xl border-b-2 pb-1 hover:opacity-50 transition-opacity" style={{ borderColor: theme.primaryColor }}>
                Email Me
              </a>
            )}
            {content.contact.linkedin && (
              <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="text-xl border-b-2 pb-1 hover:opacity-50 transition-opacity" style={{ borderColor: theme.primaryColor }}>
                LinkedIn
              </a>
            )}
          </div>
        </section>
        
        <footer className="py-12 text-center text-sm uppercase tracking-widest opacity-40 border-t" style={{ borderColor: `${theme.textColor}20` }}>
          © {new Date().getFullYear()} {content.hero.name}
        </footer>
      </div>
    </div>
  )
}
