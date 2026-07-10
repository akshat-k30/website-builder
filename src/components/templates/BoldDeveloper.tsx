"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

export default function BoldDeveloper({ content, theme }: TemplateProps) {
  // A dark, high-contrast theme suited for developers
  const bgColor = theme.backgroundColor === "#ffffff" ? "#0f1115" : theme.backgroundColor
  const textColor = theme.textColor === "#111827" ? "#f8fafc" : theme.textColor

  return (
    <div 
      className="min-h-screen font-mono transition-colors duration-500"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: theme.primaryColor }}></div>
      
      {/* Header */}
      <header className="p-8 md:p-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter">
          &lt;{content.hero.name.split(" ")[0]} /&gt;
        </div>
        <div className="flex gap-6 text-sm font-bold">
          <a href="#about" className="hover:opacity-70 transition-opacity">~/about</a>
          <a href="#exp" className="hover:opacity-70 transition-opacity">~/exp</a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">~/contact</a>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 md:px-12 py-20 md:py-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          {content.hero.photoUrl && (
            <div className="mb-8 inline-block relative">
              <div className="absolute inset-0 blur-lg opacity-50" style={{ backgroundColor: theme.primaryColor }}></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={content.hero.photoUrl} 
                alt={content.hero.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover relative z-10 border-2"
                style={{ borderColor: theme.primaryColor }}
              />
            </div>
          )}
          <div className="inline-block px-4 py-2 rounded font-bold text-sm mb-8" style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
            {content.about.title}
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-8 tracking-tighter">
            {content.hero.tagline}
          </h1>
          <p className="text-xl opacity-70 mb-10 max-w-lg leading-relaxed">
            {content.about.content.substring(0, 150)}...
          </p>
          <a 
            href="#contact" 
            className="inline-block px-8 py-4 font-bold text-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
            style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
          >
            {content.hero.ctaText} _
          </a>
        </div>
        <div className="hidden md:flex justify-end">
          {/* Decorative Code Block */}
          <div className="rounded-xl p-8 w-full max-w-md shadow-2xl border" style={{ backgroundColor: '#000', borderColor: `${textColor}15` }}>
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <pre className="text-sm text-green-400 overflow-x-auto">
              <code>
{`const developer = {
  name: "${content.hero.name}",
  skills: [
    ${content.skills.categories[0]?.items.slice(0, 3).map(s => `"${s}"`).join(",\n    ")}
  ],
  passion: "Building awesome things",
  hireable: true
};

developer.init();`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="exp" className="px-8 md:px-12 py-24 border-t border-dashed" style={{ borderColor: `${textColor}20` }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tighter">
            System.Log(<span style={{ color: theme.primaryColor }}>&ldquo;Experience&rdquo;</span>)
          </h2>
          <div className="space-y-8">
            {content.experience.map((exp, idx) => (
              <div key={idx} className="group border-l-2 pl-8 py-2 transition-all hover:pl-10" style={{ borderColor: theme.primaryColor }}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h3 className="text-2xl font-bold">{exp.role}</h3>
                  <span className="text-xl font-medium opacity-60">@ {exp.company}</span>
                  <span className="md:ml-auto px-3 py-1 rounded text-sm font-bold bg-white/10">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-2 opacity-70">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex gap-3">
                      <span style={{ color: theme.primaryColor }}>&gt;</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills terminal */}
      <section className="px-8 md:px-12 py-24 border-t border-dashed" style={{ borderColor: `${textColor}20` }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tighter">
            Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.skills.categories.map((cat, idx) => (
              <div key={idx} className="p-6 border rounded-lg" style={{ borderColor: `${textColor}20`, backgroundColor: `${textColor}05` }}>
                <h3 className="text-xl font-bold mb-6 pb-2 border-b border-dashed" style={{ borderColor: `${textColor}20`, color: theme.primaryColor }}>
                  ./{cat.name.toLowerCase().replace(/\s+/g, '-')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, sIdx) => (
                    <span key={sIdx} className="px-3 py-1 bg-white/5 border rounded font-medium text-sm" style={{ borderColor: `${textColor}10` }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 md:px-12 py-32 border-t border-dashed text-center" style={{ borderColor: `${textColor}20` }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            {content.contact.heading}
          </h2>
          <p className="text-xl opacity-70 mb-12">
            {content.contact.message}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {content.contact.email && (
              <a 
                href={`mailto:${content.contact.email}`} 
                className="px-8 py-4 font-bold text-lg transition-transform hover:-translate-y-1"
                style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
              >
                {content.contact.email}
              </a>
            )}
            {content.contact.linkedin && (
              <a 
                href={content.contact.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="px-8 py-4 font-bold text-lg border-2 transition-transform hover:-translate-y-1"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>
      
      <footer className="p-8 text-center text-sm font-bold opacity-30 border-t border-dashed" style={{ borderColor: `${textColor}20` }}>
        EOF © {new Date().getFullYear()} {content.hero.name}
      </footer>
    </div>
  )
}
