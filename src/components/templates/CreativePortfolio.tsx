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
      className="min-h-screen transition-colors duration-500 font-serif"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily || "Georgia, serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <header className="py-12 flex justify-between items-center border-b" style={{ borderColor: `${theme.textColor}15` }}>
          <div className="text-2xl font-bold tracking-widest uppercase" style={{ color: theme.primaryColor }}>
            {content.hero.name}
          </div>
          <div className="flex gap-10 text-xs uppercase tracking-[0.2em] font-bold">
            <a href="#about" className="hover:opacity-60 transition-opacity">About</a>
            <a href="#work" className="hover:opacity-60 transition-opacity">Work</a>
            <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </header>

        {/* Hero */}
        <section className="py-32 md:py-48 text-center max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.4em] font-bold mb-10 opacity-70" style={{ color: theme.secondaryColor }}>
            Welcome to my portfolio
          </p>
          <h1 className="text-5xl md:text-8xl font-normal leading-tight mb-16 italic" style={{ color: theme.primaryColor }}>
            {content.hero.tagline}
          </h1>
          <button 
            className="px-12 py-5 uppercase tracking-widest text-sm font-bold border transition-all hover:scale-105"
            style={{ 
              borderColor: theme.primaryColor,
              color: theme.primaryColor,
              backgroundColor: "transparent"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.primaryColor;
              e.currentTarget.style.color = theme.backgroundColor;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme.primaryColor;
            }}
          >
            {content.hero.ctaText}
          </button>
        </section>

        {/* About */}
        <section id="about" className="py-32 border-t grid md:grid-cols-12 gap-16" style={{ borderColor: `${theme.textColor}15` }}>
          <div className="md:col-span-4">
            <h2 className="text-4xl md:text-5xl font-normal italic" style={{ color: theme.primaryColor }}>
              {content.about.title}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-4xl leading-relaxed font-light opacity-90">
              {content.about.content}
            </p>
          </div>
        </section>

        {/* Experience (Work) */}
        <section id="work" className="py-32 border-t" style={{ borderColor: `${theme.textColor}15` }}>
          <h2 className="text-4xl md:text-6xl font-normal mb-24 text-center italic" style={{ color: theme.primaryColor }}>
            Selected Experience
          </h2>
          <div className="space-y-32">
            {content.experience.map((exp, idx) => (
              <div key={idx} className="grid md:grid-cols-12 gap-12 items-start group">
                <div className="md:col-span-3 text-sm font-bold uppercase tracking-widest opacity-50 mt-3 border-t pt-4" style={{ borderColor: `${theme.textColor}10` }}>
                  {exp.period}
                </div>
                <div className="md:col-span-9">
                  <h3 className="text-5xl font-normal mb-6 group-hover:translate-x-4 transition-transform duration-500" style={{ color: theme.primaryColor }}>
                    {exp.role}
                  </h3>
                  <div className="text-2xl font-sans mb-10 tracking-wide font-light opacity-80" style={{ color: theme.secondaryColor }}>
                    {exp.company}
                  </div>
                  <ul className="space-y-6 font-sans text-lg opacity-75 max-w-3xl">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="leading-relaxed border-l-2 pl-6 py-1" style={{ borderColor: `${theme.primaryColor}50` }}>
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
        <section className="py-32 border-t" style={{ borderColor: `${theme.textColor}15` }}>
           <h2 className="text-4xl md:text-6xl font-normal mb-24 text-center italic" style={{ color: theme.primaryColor }}>
            Skills & Expertise
          </h2>
          <div className="grid md:grid-cols-3 gap-20 text-center font-sans">
            {content.skills.categories.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-10 pb-4 border-b inline-block" style={{ color: theme.secondaryColor, borderColor: `${theme.textColor}20` }}>
                  {cat.name}
                </h3>
                <div className="flex flex-col gap-5 text-lg opacity-80 font-light">
                  {cat.items.map((skill, sIdx) => (
                    <span key={sIdx}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-40 border-t text-center" style={{ borderColor: `${theme.textColor}15` }}>
          <h2 className="text-6xl md:text-8xl font-normal mb-10 italic" style={{ color: theme.primaryColor }}>
            {content.contact.heading}
          </h2>
          <p className="text-2xl md:text-3xl font-light opacity-80 mb-20 max-w-3xl mx-auto leading-relaxed">
            {content.contact.message}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-12 font-sans">
            {content.contact.email && (
              <a href={`mailto:${content.contact.email}`} className="text-2xl font-light border-b border-transparent hover:border-current pb-2 transition-all" style={{ color: theme.primaryColor }}>
                Email Me →
              </a>
            )}
            {content.contact.linkedin && (
              <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="text-2xl font-light border-b border-transparent hover:border-current pb-2 transition-all" style={{ color: theme.primaryColor }}>
                LinkedIn →
              </a>
            )}
          </div>
        </section>
        
        <footer className="py-16 text-center text-xs font-sans uppercase tracking-[0.3em] opacity-40 border-t" style={{ borderColor: `${theme.textColor}15` }}>
          © {new Date().getFullYear()} {content.hero.name}
        </footer>
      </div>
    </div>
  )
}
