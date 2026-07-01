"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

export default function BoldDeveloper({ content, theme }: TemplateProps) {
  return (
    <div 
      className="min-h-screen font-mono transition-colors duration-300 selection:bg-white/20"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Header */}
      <header className="px-6 py-8 border-b-4 border-double" style={{ borderColor: theme.primaryColor }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black uppercase tracking-widest">
            {content.hero.name}
          </div>
          <div className="hidden md:flex gap-4 text-sm font-bold uppercase">
            <a href="#about" className="hover:underline decoration-2" style={{ textDecorationColor: theme.secondaryColor }}>[ About ]</a>
            <a href="#experience" className="hover:underline decoration-2" style={{ textDecorationColor: theme.secondaryColor }}>[ Experience ]</a>
            <a href="#contact" className="hover:underline decoration-2" style={{ textDecorationColor: theme.secondaryColor }}>[ Contact ]</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-32 max-w-6xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-1 mb-8 font-bold text-sm" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}>
            HELLO WORLD
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-10 leading-none tracking-tighter" style={{ textShadow: `4px 4px 0px ${theme.secondaryColor}` }}>
            {content.hero.tagline}
          </h1>
          <button 
            className="px-8 py-4 font-bold text-lg uppercase border-4 hover:scale-105 transition-transform"
            style={{ 
              backgroundColor: theme.backgroundColor, 
              color: theme.textColor,
              borderColor: theme.primaryColor,
              boxShadow: `8px 8px 0px ${theme.primaryColor}`
            }}
          >
            {content.hero.ctaText}
          </button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="p-10 border-4 border-dashed" style={{ borderColor: theme.secondaryColor }}>
          <h2 className="text-4xl font-black mb-8 uppercase flex items-center gap-4">
            <span style={{ color: theme.primaryColor }}>#</span> {content.about.title}
          </h2>
          <p className="text-xl leading-loose font-medium">
            {content.about.content}
          </p>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-black mb-12 uppercase flex items-center gap-4">
          <span style={{ color: theme.primaryColor }}>$</span> Experience
        </h2>
        <div className="grid gap-8">
          {content.experience.map((exp, idx) => (
            <div key={idx} className="p-8 border-l-8 bg-black/20" style={{ borderColor: theme.secondaryColor }}>
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ color: theme.primaryColor }}>{exp.role}</h3>
                  <div className="text-xl font-bold">{exp.company}</div>
                </div>
                <div className="font-bold mt-2 md:mt-0 opacity-60">
                  {exp.period}
                </div>
              </div>
              <ul className="space-y-4">
                {exp.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="flex gap-4">
                    <span style={{ color: theme.secondaryColor }}>{">"}</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-black mb-12 uppercase flex items-center gap-4">
          <span style={{ color: theme.primaryColor }}>{"{"}</span> Skills <span style={{ color: theme.primaryColor }}>{"}"}</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {content.skills.categories.map((cat, idx) => (
            <div key={idx} className="border-2 p-6" style={{ borderColor: theme.primaryColor }}>
              <h3 className="text-xl font-bold mb-6 uppercase" style={{ color: theme.secondaryColor }}>{cat.name}</h3>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((skill, sIdx) => (
                  <span key={sIdx} className="px-3 py-1 bg-white/10 font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 py-32 border-t-4" style={{ borderColor: theme.primaryColor }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase">{content.contact.heading}</h2>
          <p className="text-2xl mb-12">{content.contact.message}</p>
          <div className="flex justify-center gap-6">
             <button 
              className="px-10 py-5 font-bold text-xl uppercase border-4 hover:-translate-y-2 transition-transform"
              style={{ 
                backgroundColor: theme.primaryColor, 
                color: theme.backgroundColor,
                borderColor: theme.primaryColor,
              }}
            >
              Contact Me
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
