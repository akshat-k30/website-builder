"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

export default function ExecutivePro({ content, theme }: TemplateProps) {
  return (
    <div 
      className="min-h-screen font-sans transition-colors duration-500 bg-white"
      style={{
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor
      }}
    >
      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b" style={{ borderColor: `${theme.textColor}15` }}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tight" style={{ color: theme.primaryColor }}>
            {content.hero.name.split(" ")[0]}<span style={{ color: theme.secondaryColor }}>{content.hero.name.split(" ").slice(1).join(" ")}</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wider" style={{ color: theme.textColor }}>
            <a href="#overview" className="hover:opacity-60 transition-opacity">Overview</a>
            <a href="#experience" className="hover:opacity-60 transition-opacity">Experience</a>
            <a href="#expertise" className="hover:opacity-60 transition-opacity">Expertise</a>
          </div>
          <a 
            href="#contact" 
            className="hidden md:inline-flex px-6 py-2.5 rounded-lg text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-2" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
            Executive Portfolio
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            {content.hero.tagline}
          </h1>
          <p className="text-xl md:text-2xl opacity-75 max-w-2xl leading-relaxed font-light">
            {content.about.content.split(".")[0]}.
          </p>
          <div className="flex gap-4 pt-4">
            <a 
              href="#contact" 
              className="px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {content.hero.ctaText}
            </a>
          </div>
        </div>
        
        {content.hero.photoUrl && (
          <div className="w-48 h-48 md:w-80 md:h-80 shrink-0 relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl" style={{ backgroundColor: theme.primaryColor }}></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={content.hero.photoUrl} 
              alt={content.hero.name}
              className="w-full h-full object-cover rounded-3xl relative z-10 border-4 shadow-xl"
              style={{ borderColor: theme.backgroundColor }}
            />
          </div>
        )}
      </section>

      {/* About / Executive Summary */}
      <section id="overview" className="py-24 px-6 relative" style={{ backgroundColor: `${theme.primaryColor}05` }}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold" style={{ color: theme.primaryColor }}>{content.about.title}</h2>
          <p className="text-xl md:text-2xl leading-relaxed font-medium opacity-90">
            "{content.about.content}"
          </p>
        </div>
      </section>

      {/* Professional Experience */}
      <section id="experience" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-extrabold sticky top-32" style={{ color: theme.primaryColor }}>
              Professional <br/>Journey
            </h2>
          </div>
          <div className="md:w-2/3 space-y-12">
            {content.experience.map((exp, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" style={{ borderColor: `${theme.textColor}10` }}>
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                    <div className="text-lg font-semibold" style={{ color: theme.secondaryColor }}>{exp.company}</div>
                  </div>
                  <div className="px-4 py-1.5 rounded-lg text-sm font-bold bg-black/5 whitespace-nowrap">
                    {exp.period}
                  </div>
                </div>
                <ul className="space-y-3">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex gap-4 opacity-80 leading-relaxed text-lg">
                      <span className="font-bold" style={{ color: theme.primaryColor }}>✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Competencies (Skills) */}
      <section id="expertise" className="py-24 px-6" style={{ backgroundColor: `${theme.primaryColor}05` }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-16" style={{ color: theme.primaryColor }}>
            Core Competencies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.skills.categories.map((cat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border" style={{ borderColor: `${theme.textColor}10` }}>
                <h3 className="text-xl font-bold mb-6 pb-4 border-b" style={{ borderColor: `${theme.textColor}10`, color: theme.secondaryColor }}>
                  {cat.name}
                </h3>
                <ul className="space-y-4">
                  {cat.items.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-3 font-medium opacity-90">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-12 md:p-20 text-center shadow-xl border" style={{ borderColor: `${theme.textColor}10` }}>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: theme.primaryColor }}>
              {content.contact.heading}
            </h2>
            <p className="text-xl opacity-75 mb-12 max-w-2xl mx-auto">
              {content.contact.message}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {content.contact.email && (
                <a 
                  href={`mailto:${content.contact.email}`} 
                  className="px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {content.contact.email}
                </a>
              )}
              {content.contact.linkedin && (
                <a 
                  href={content.contact.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-8 py-4 rounded-xl font-bold border-2 transition-all hover:bg-black/5"
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                >
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm font-bold opacity-40 uppercase tracking-widest border-t" style={{ borderColor: `${theme.textColor}10` }}>
        © {new Date().getFullYear()} {content.hero.name}
      </footer>
    </div>
  )
}
