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
      className="min-h-screen font-sans antialiased"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Sidebar Layout for Desktop */}
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* Fixed Sidebar */}
        <aside 
          className="md:w-80 lg:w-96 p-10 md:fixed md:h-screen overflow-y-auto flex flex-col justify-between"
          style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}
        >
          <div>
            <div className="w-24 h-24 mb-8 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
              {content.hero.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-bold mb-4">{content.hero.name}</h1>
            <p className="text-lg opacity-80 leading-relaxed mb-10">
              {content.hero.tagline}
            </p>
            
            <nav className="flex flex-col gap-4 font-semibold tracking-wide uppercase text-sm mb-12">
              <a href="#about" className="hover:opacity-60 transition-opacity">About Me</a>
              <a href="#experience" className="hover:opacity-60 transition-opacity">Professional Experience</a>
              <a href="#skills" className="hover:opacity-60 transition-opacity">Core Competencies</a>
              <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
            </nav>
          </div>
          
          <div className="text-sm opacity-60">
            © {new Date().getFullYear()} {content.hero.name}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-80 lg:ml-96 p-8 md:p-16 lg:p-24 space-y-32">
          
          {/* Hero Mobile (Hidden on Desktop) */}
          <section className="md:hidden pt-8">
            <h2 className="text-4xl font-bold mb-4" style={{ color: theme.primaryColor }}>
              {content.hero.name}
            </h2>
            <p className="text-xl" style={{ color: theme.secondaryColor }}>
              {content.hero.tagline}
            </p>
          </section>

          {/* About */}
          <section id="about">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-4 uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <span className="w-8 h-1 bg-current rounded"></span>
              {content.about.title}
            </h2>
            <p className="text-xl leading-relaxed text-opacity-90 max-w-4xl font-medium">
              {content.about.content}
            </p>
          </section>

          {/* Experience */}
          <section id="experience">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-4 uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <span className="w-8 h-1 bg-current rounded"></span>
              Experience
            </h2>
            <div className="space-y-12">
              {content.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-8 border-l-2" style={{ borderColor: theme.secondaryColor }}>
                  <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1" style={{ backgroundColor: theme.primaryColor }}></div>
                  <div className="mb-2">
                    <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded mb-4 inline-block" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
                      {exp.period}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                  <div className="text-lg font-medium mb-6" style={{ color: theme.secondaryColor }}>
                    {exp.company}
                  </div>
                  <ul className="space-y-2 opacity-80 list-disc list-inside">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-4 uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <span className="w-8 h-1 bg-current rounded"></span>
              Core Competencies
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
              {content.skills.categories.map((cat, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-bold mb-6 border-b pb-2" style={{ borderColor: `${theme.textColor}20` }}>
                    {cat.name}
                  </h3>
                  <ul className="space-y-3 font-medium opacity-80">
                    {cat.items.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-3">
                        <svg className="w-5 h-5" style={{ color: theme.secondaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-12 lg:p-16 text-center shadow-lg border" style={{ borderColor: `${theme.textColor}10` }}>
            <h2 className="text-4xl font-bold mb-6" style={{ color: theme.primaryColor }}>{content.contact.heading}</h2>
            <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">{content.contact.message}</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {content.contact.email && (
                <a href={`mailto:${content.contact.email}`} className="px-8 py-4 rounded font-bold shadow-md hover:shadow-xl transition-shadow" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}>
                  Send an Email
                </a>
              )}
              {content.contact.linkedin && (
                <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="px-8 py-4 rounded font-bold border-2 hover:bg-black/5 transition-colors" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
                  View LinkedIn Profile
                </a>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
