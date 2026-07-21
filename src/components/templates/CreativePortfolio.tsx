import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

/**
 * Creative Portfolio — elegant, editorial, serif-driven.
 * STATIC-SAFE: pure CSS. Letter-spacing reveals, clip-path image reveal,
 * horizontal scroll-snap experience rail, line-draw dividers.
 */
export default function CreativePortfolio({ content, theme }: TemplateProps) {
  const { hero, about, experience, skills, contact } = content

  const rootVars = {
    "--p": theme.primaryColor,
    "--s": theme.secondaryColor,
    "--bg": theme.backgroundColor,
    "--tx": theme.textColor,
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: `${theme.fontFamily}, Georgia, serif`,
  } as React.CSSProperties

  return (
    <div className="cp-root" style={rootVars}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: CP_CSS }} />

      {/* Nav */}
      <nav className="cp-nav">
        <a href="#top" className="cp-brand">{hero.name}</a>
        <div className="cp-nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="cp-hero">
        <p className="cp-eyebrow css-reveal rv-letters">{about.title}</p>
        <h1 className="cp-title css-reveal rv-up">{hero.name}</h1>
        <p className="cp-tagline css-reveal rv-up" style={{ animationDelay: ".12s" }}>{hero.tagline}</p>
        {hero.photoUrl && (
          <div className="cp-hero-img css-reveal rv-clip" style={{ animationDelay: ".2s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.photoUrl} alt={hero.name} />
          </div>
        )}
        <a href="#contact" className="cp-hero-cta css-reveal rv-up" style={{ animationDelay: ".28s" }}>{hero.ctaText} <span aria-hidden="true">→</span></a>
      </header>

      <div className="cp-wrap"><div className="cp-divider css-reveal rv-line" aria-hidden="true" /></div>

      {/* About — magazine, drop cap */}
      <section id="about" className="cp-section">
        <div className="cp-wrap cp-about">
          <h2 className="cp-section-label css-reveal rv-letters">About</h2>
          <p className="cp-about-body css-reveal rv-up" data-firstletter={about.content.charAt(0)}>
            {about.content.slice(1)}
          </p>
        </div>
      </section>

      <div className="cp-wrap"><div className="cp-divider css-reveal rv-line" aria-hidden="true" /></div>

      {/* Experience — horizontal scroll rail */}
      <section id="work" className="cp-section">
        <div className="cp-wrap"><h2 className="cp-section-label css-reveal rv-letters">Selected Work</h2></div>
        <div className="cp-rail" role="list">
          {experience.map((exp, i) => (
            <article key={i} className="cp-rail-card" role="listitem">
              <span className="cp-rail-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="cp-rail-period">{exp.period}</span>
              <h3 className="cp-rail-role">{exp.role}</h3>
              <p className="cp-rail-company">{exp.company}</p>
              <ul className="cp-rail-points">
                {exp.highlights.slice(0, 3).map((h, hi) => <li key={hi}>{h}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className="cp-wrap"><p className="cp-rail-hint">Scroll horizontally →</p></div>
      </section>

      <div className="cp-wrap"><div className="cp-divider css-reveal rv-line" aria-hidden="true" /></div>

      {/* Skills — magazine grid */}
      <section className="cp-section">
        <div className="cp-wrap">
          <h2 className="cp-section-label css-reveal rv-letters">Expertise</h2>
          <div className="cp-skills">
            {skills.categories.map((cat, i) => (
              <div key={i} className="cp-skill css-reveal rv-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <h3 className="cp-skill-name">{cat.name}</h3>
                <p className="cp-skill-items">{cat.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="cp-section cp-contact">
        <div className="cp-wrap">
          <h2 className="cp-contact-title css-reveal rv-up">{contact.heading}</h2>
          <p className="cp-contact-msg css-reveal rv-up" style={{ animationDelay: ".1s" }}>{contact.message}</p>
          <div className="cp-contact-links css-reveal rv-up" style={{ animationDelay: ".18s" }}>
            {contact.email && <a href={`mailto:${contact.email}`} className="cp-link">{contact.email}</a>}
            {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="cp-link">LinkedIn</a>}
          </div>
        </div>
      </section>

      <footer className="cp-footer">
        <span className="cp-footer-name">{hero.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

const CP_CSS = `
.cp-root { position: relative; min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.cp-root * { box-sizing: border-box; }
.cp-wrap { max-width: 1000px; margin: 0 auto; padding: 0 28px; }
.cp-section { padding: clamp(56px, 10vw, 130px) 0; }

/* Nav */
.cp-nav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; max-width: 1000px; margin: 0 auto; padding: 22px 28px;
  background: color-mix(in srgb, var(--bg) 78%, transparent); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
.cp-brand { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; font-style: italic; text-decoration: none; color: var(--tx); letter-spacing: .01em; }
.cp-nav-links { display: flex; gap: 28px; }
.cp-nav-links a { font-family: 'Cormorant Garamond', serif; font-size: 18px; text-decoration: none; color: color-mix(in srgb, var(--tx) 70%, transparent); position: relative; transition: color .3s; }
.cp-nav-links a::after { content:''; position:absolute; left:0; bottom:-3px; height:1px; width:0; background: var(--p); transition: width .35s ease; }
.cp-nav-links a:hover { color: var(--p); } .cp-nav-links a:hover::after { width: 100%; }
@media (max-width: 560px){ .cp-nav-links { gap: 18px; } }

/* Hero */
.cp-hero { max-width: 1000px; margin: 0 auto; padding: clamp(50px, 9vw, 110px) 28px 70px; text-align: center; }
.cp-eyebrow { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(16px, 2.4vw, 22px); color: var(--p); margin: 0 0 22px; text-transform: uppercase; }
.cp-title { font-family: 'Playfair Display', serif; font-weight: 800; font-size: clamp(52px, 12vw, 140px); line-height: 0.94; letter-spacing: -0.03em; margin: 0; color: var(--tx); }
.cp-tagline { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 3.2vw, 32px); font-style: italic; color: color-mix(in srgb, var(--tx) 68%, transparent); margin: 26px auto 0; max-width: 640px; line-height: 1.35; }
.cp-hero-img { margin: 46px auto 0; width: min(560px, 90%); aspect-ratio: 16/10; overflow: hidden; border-radius: 4px; }
.cp-hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cp-hero-cta { display: inline-block; margin-top: 44px; font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--tx); text-decoration: none; border-bottom: 1px solid var(--p); padding-bottom: 3px; transition: color .3s; }
.cp-hero-cta span { display: inline-block; transition: transform .3s; }
.cp-hero-cta:hover { color: var(--p); } .cp-hero-cta:hover span { transform: translateX(6px); }

/* Divider line-draw */
.cp-divider { height: 1px; background: color-mix(in srgb, var(--tx) 20%, transparent); transform-origin: center; }
.cp-divider.is-visible { animation: cpLine 1.1s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes cpLine { from { transform: scaleX(0);} to { transform: scaleX(1);} }

/* Section label */
.cp-section-label { font-family: 'Playfair Display', serif; font-weight: 600; font-style: italic; font-size: clamp(28px, 5vw, 52px); margin: 0 0 40px; color: var(--tx); letter-spacing: -0.01em; }

/* About */
.cp-about-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 2.6vw, 27px); line-height: 1.6; color: color-mix(in srgb, var(--tx) 82%, transparent); max-width: 760px; }
.cp-about-body[data-firstletter]::before { content: attr(data-firstletter); float: left; font-family: 'Playfair Display', serif; font-weight: 800; font-size: 5.4em; line-height: .74; padding: 6px 14px 0 0; color: var(--p); }

/* Experience rail (horizontal scroll) */
.cp-rail { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 8px 28px 28px; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
.cp-rail::-webkit-scrollbar { height: 6px; } .cp-rail::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--tx) 20%, transparent); border-radius: 3px; }
.cp-rail-card { scroll-snap-align: center; flex: 0 0 min(420px, 82vw); padding: 40px; border: 1px solid color-mix(in srgb, var(--tx) 14%, transparent); border-radius: 6px; background: color-mix(in srgb, var(--tx) 2.5%, transparent); transition: transform .4s, box-shadow .4s, border-color .4s; }
.cp-rail-card:hover { transform: translateY(-6px); border-color: color-mix(in srgb, var(--p) 40%, transparent); box-shadow: 0 30px 60px -30px color-mix(in srgb, var(--tx) 40%, transparent); }
.cp-rail-num { font-family: 'Playfair Display', serif; font-size: 46px; font-weight: 800; color: color-mix(in srgb, var(--p) 30%, transparent); display: block; }
.cp-rail-period { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 17px; color: var(--p); }
.cp-rail-role { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; margin: 8px 0 2px; }
.cp-rail-company { font-family: 'Cormorant Garamond', serif; font-size: 19px; color: color-mix(in srgb, var(--tx) 60%, transparent); margin: 0 0 18px; }
.cp-rail-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.cp-rail-points li { position: relative; padding-left: 20px; font-size: 15.5px; line-height: 1.55; color: color-mix(in srgb, var(--tx) 74%, transparent); }
.cp-rail-points li::before { content: '—'; position: absolute; left: 0; color: var(--p); }
.cp-rail-hint { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; color: color-mix(in srgb, var(--tx) 45%, transparent); margin: 14px 0 0; }

/* Skills */
.cp-skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2px; background: color-mix(in srgb, var(--tx) 12%, transparent); border: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); }
.cp-skill { background: var(--bg); padding: 34px 28px; transition: background .35s; }
.cp-skill:hover { background: color-mix(in srgb, var(--p) 6%, var(--bg)); }
.cp-skill-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; margin: 0 0 12px; }
.cp-skill-items { font-family: 'Cormorant Garamond', serif; font-size: 19px; line-height: 1.5; color: color-mix(in srgb, var(--tx) 66%, transparent); margin: 0; }

/* Contact */
.cp-contact { text-align: center; }
.cp-contact-title { font-family: 'Playfair Display', serif; font-weight: 800; font-size: clamp(40px, 8vw, 88px); line-height: 1; margin: 0 0 22px; letter-spacing: -0.02em; }
.cp-contact-msg { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 3vw, 26px); font-style: italic; color: color-mix(in srgb, var(--tx) 66%, transparent); max-width: 560px; margin: 0 auto 34px; line-height: 1.5; }
.cp-contact-links { display: flex; gap: 34px; justify-content: center; flex-wrap: wrap; }
.cp-link { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--tx); text-decoration: none; border-bottom: 1px solid var(--p); padding-bottom: 2px; transition: color .3s; }
.cp-link:hover { color: var(--p); }

/* Footer */
.cp-footer { display: flex; justify-content: space-between; max-width: 1000px; margin: 0 auto; padding: 40px 28px; border-top: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); font-family: 'Cormorant Garamond', serif; font-size: 16px; color: color-mix(in srgb, var(--tx) 55%, transparent); }
.cp-footer-name { font-style: italic; }

/* Reveal engine */
.css-reveal { opacity: 0; animation-fill-mode: both; animation-duration: 1s; animation-timing-function: cubic-bezier(.22,1,.36,1); }
.css-reveal.is-visible.rv-up { animation-name: cpUp; }
.css-reveal.is-visible.rv-letters { animation-name: cpLetters; }
.css-reveal.is-visible.rv-clip { animation-name: cpClip; }
@keyframes cpUp { from { opacity:0; transform: translateY(34px);} to { opacity:1; transform:none;} }
@keyframes cpLetters { from { opacity:0; letter-spacing: .5em; } to { opacity:1; letter-spacing: normal; } }
@keyframes cpClip { from { opacity: 1; clip-path: inset(0 100% 0 0);} to { opacity:1; clip-path: inset(0 0 0 0);} }

@media (prefers-reduced-motion: reduce) {
  .css-reveal, .cp-divider { animation: none !important; opacity: 1 !important; transform: none !important; letter-spacing: normal !important; clip-path: none !important; }
}
`
