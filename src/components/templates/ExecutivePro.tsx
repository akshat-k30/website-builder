import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

/**
 * Executive Pro — corporate, clean, sticky sidebar layout.
 * STATIC-SAFE: pure CSS. Staggered slide-up entrances, a timeline whose
 * connecting line draws in on reveal (scaleY), and stat tiles that
 * animate on appearance (values themselves are static).
 *
 * Note: true scroll-spy highlighting requires JS; the sidebar uses
 * smooth-scroll anchors + hover states, and :target highlights the
 * destination section heading on click.
 */
export default function ExecutivePro({ content, theme }: TemplateProps) {
  const { hero, about, experience, skills, contact } = content

  const rootVars = {
    "--p": theme.primaryColor,
    "--s": theme.secondaryColor,
    "--bg": theme.backgroundColor,
    "--tx": theme.textColor,
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: `${theme.fontFamily}, 'Inter', sans-serif`,
  } as React.CSSProperties

  const totalSkills = skills.categories.reduce((n, c) => n + c.items.length, 0)
  const stats = [
    { v: `${experience.length}`, l: "Positions" },
    { v: `${totalSkills}+`, l: "Competencies" },
    { v: `${skills.categories.length}`, l: "Domains" },
    { v: "100%", l: "Commitment" },
  ]

  return (
    <div className="ep-root" style={rootVars}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: EP_CSS }} />

      <div className="ep-shell">
        {/* Sticky sidebar */}
        <aside className="ep-sidebar">
          <div className="ep-side-inner">
            {hero.photoUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.photoUrl} alt={hero.name} className="ep-avatar" />
              </>
            )}
            <h1 className="ep-side-name">{hero.name}</h1>
            <p className="ep-side-role">{hero.tagline}</p>
            <nav className="ep-side-nav">
              <a href="#about"><span className="ep-nav-dot" />Profile</a>
              <a href="#experience"><span className="ep-nav-dot" />Experience</a>
              <a href="#skills"><span className="ep-nav-dot" />Expertise</a>
              <a href="#contact"><span className="ep-nav-dot" />Contact</a>
            </nav>
            <div className="ep-side-contact">
              {contact.email && <a href={`mailto:${contact.email}`} className="ep-side-cta">{hero.ctaText}</a>}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="ep-main">
          {/* Intro */}
          <section className="ep-hero">
            <div className="ep-hero-bg" aria-hidden="true" />
            <p className="ep-kicker css-reveal rv-up">{about.title}</p>
            <h2 className="ep-hero-title css-reveal rv-up" style={{ animationDelay: ".08s" }}>{hero.tagline}</h2>
            <p className="ep-hero-lede css-reveal rv-up" style={{ animationDelay: ".16s" }}>{truncate(about.content, 220)}</p>

            {/* Stats */}
            <div className="ep-stats">
              {stats.map((s, i) => (
                <div key={i} className="ep-stat css-reveal rv-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  <span className="ep-stat-v">{s.v}</span>
                  <span className="ep-stat-l">{s.l}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Profile */}
          <section id="about" className="ep-block">
            <h3 className="ep-block-title css-reveal rv-up"><span className="ep-block-bar" />Profile</h3>
            <p className="ep-prose css-reveal rv-up" style={{ animationDelay: ".08s" }}>{about.content}</p>
          </section>

          {/* Experience timeline */}
          <section id="experience" className="ep-block">
            <h3 className="ep-block-title css-reveal rv-up"><span className="ep-block-bar" />Experience</h3>
            <div className="ep-timeline">
              <span className="ep-timeline-line css-reveal rv-line" aria-hidden="true" />
              {experience.map((exp, i) => (
                <article key={i} className="ep-tl-item css-reveal rv-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="ep-tl-dot" aria-hidden="true" />
                  <div className="ep-tl-card">
                    <div className="ep-tl-head">
                      <h4 className="ep-tl-role">{exp.role}</h4>
                      <span className="ep-tl-period">{exp.period}</span>
                    </div>
                    <p className="ep-tl-company">{exp.company}</p>
                    <ul className="ep-tl-points">
                      {exp.highlights.map((h, hi) => <li key={hi}>{h}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="ep-block">
            <h3 className="ep-block-title css-reveal rv-up"><span className="ep-block-bar" />Areas of Expertise</h3>
            <div className="ep-skills">
              {skills.categories.map((cat, i) => (
                <div key={i} className="ep-skill css-reveal rv-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <h4 className="ep-skill-name">{cat.name}</h4>
                  <div className="ep-skill-tags">
                    {cat.items.map((s, si) => <span key={si} className="ep-skill-tag">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="ep-block ep-contact">
            <h3 className="ep-contact-title css-reveal rv-up">{contact.heading}</h3>
            <p className="ep-contact-msg css-reveal rv-up" style={{ animationDelay: ".08s" }}>{contact.message}</p>
            <div className="ep-contact-actions css-reveal rv-up" style={{ animationDelay: ".16s" }}>
              {contact.email && <a href={`mailto:${contact.email}`} className="ep-btn">{contact.email}</a>}
              {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="ep-btn ep-btn-outline">LinkedIn ↗</a>}
            </div>
          </section>

          <footer className="ep-footer">© {new Date().getFullYear()} {hero.name}. All rights reserved.</footer>
        </main>
      </div>
    </div>
  )
}

function truncate(s: string, n: number) { return s.length > n ? s.slice(0, n).trimEnd() + "…" : s }

const EP_CSS = `
.ep-root { position: relative; min-height: 100vh; -webkit-font-smoothing: antialiased; }
.ep-root * { box-sizing: border-box; }
.ep-shell { display: grid; grid-template-columns: 320px 1fr; max-width: 1320px; margin: 0 auto; }
@media (max-width: 900px){ .ep-shell { grid-template-columns: 1fr; } }

/* Sidebar */
.ep-sidebar { position: relative; }
.ep-side-inner { position: sticky; top: 0; height: 100vh; padding: 48px 36px; display: flex; flex-direction: column;
  background: color-mix(in srgb, var(--p) 5%, var(--bg)); border-right: 1px solid color-mix(in srgb, var(--tx) 10%, transparent); }
@media (max-width: 900px){ .ep-side-inner { position: static; height: auto; border-right: none; border-bottom: 1px solid color-mix(in srgb, var(--tx) 10%, transparent); align-items: flex-start; } }
.ep-avatar { width: 96px; height: 96px; border-radius: 16px; object-fit: cover; margin-bottom: 24px; border: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); box-shadow: 0 12px 30px -12px color-mix(in srgb, var(--tx) 35%, transparent); }
.ep-side-name { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 0; line-height: 1.1; }
.ep-side-role { font-size: 15px; color: color-mix(in srgb, var(--tx) 60%, transparent); margin: 8px 0 32px; line-height: 1.4; }
.ep-side-nav { display: flex; flex-direction: column; gap: 4px; }
.ep-side-nav a { display: flex; align-items: center; gap: 12px; padding: 10px 12px; margin-left: -12px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;
  color: color-mix(in srgb, var(--tx) 70%, transparent); transition: color .25s, background .25s, padding .25s; }
.ep-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: color-mix(in srgb, var(--tx) 30%, transparent); transition: background .25s, transform .25s; }
.ep-side-nav a:hover { color: var(--p); background: color-mix(in srgb, var(--p) 8%, transparent); padding-left: 16px; }
.ep-side-nav a:hover .ep-nav-dot { background: var(--p); transform: scale(1.6); }
.ep-side-contact { margin-top: auto; padding-top: 28px; }
@media (max-width: 900px){ .ep-side-contact { margin-top: 24px; } }
.ep-side-cta { display: inline-block; padding: 12px 22px; border-radius: 10px; background: var(--p); color: #fff; font-weight: 700; font-size: 14px; text-decoration: none; transition: transform .25s, box-shadow .25s; box-shadow: 0 10px 24px -10px color-mix(in srgb, var(--p) 60%, transparent); }
.ep-side-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 32px -10px color-mix(in srgb, var(--p) 70%, transparent); }

/* Main */
.ep-main { padding: 0 clamp(24px, 5vw, 72px); }
.ep-block { padding: clamp(48px, 7vw, 96px) 0; scroll-margin-top: 24px; }
.ep-block:not(:last-child) { border-bottom: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); }
.ep-block-title { display: flex; align-items: center; gap: 14px; font-size: clamp(20px, 3vw, 28px); font-weight: 800; letter-spacing: -0.01em; margin: 0 0 32px; }
.ep-block-bar { width: 26px; height: 3px; border-radius: 2px; background: var(--p); }

/* Hero */
.ep-hero { position: relative; padding: clamp(64px, 10vw, 120px) 0 clamp(48px, 6vw, 80px); scroll-margin-top: 24px; }
.ep-hero-bg { position: absolute; inset: -40px -40px auto -40px; height: 340px; z-index: 0; opacity: .5;
  background: radial-gradient(600px 300px at 20% 0%, color-mix(in srgb, var(--p) 22%, transparent), transparent 70%),
              radial-gradient(500px 260px at 90% 10%, color-mix(in srgb, var(--s) 18%, transparent), transparent 70%);
  animation: epShift 12s ease-in-out infinite alternate; }
@keyframes epShift { from { transform: translateX(-14px);} to { transform: translateX(14px);} }
.ep-kicker { position: relative; text-transform: uppercase; letter-spacing: .22em; font-size: 12.5px; font-weight: 700; color: var(--p); margin: 0 0 16px; }
.ep-hero-title { position: relative; font-size: clamp(30px, 5vw, 52px); font-weight: 800; line-height: 1.08; letter-spacing: -0.025em; margin: 0; max-width: 720px; }
.ep-hero-lede { position: relative; font-size: clamp(15px, 2vw, 18px); line-height: 1.7; color: color-mix(in srgb, var(--tx) 65%, transparent); margin: 22px 0 0; max-width: 620px; }

/* Stats */
.ep-stats { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 44px; }
@media (max-width: 640px){ .ep-stats { grid-template-columns: repeat(2, 1fr); } }
.ep-stat { padding: 22px; border-radius: 14px; border: 1px solid color-mix(in srgb, var(--tx) 10%, transparent); background: color-mix(in srgb, var(--tx) 2.5%, transparent); transition: transform .3s, border-color .3s, box-shadow .3s; }
.ep-stat:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--p) 40%, transparent); box-shadow: 0 18px 40px -20px color-mix(in srgb, var(--p) 45%, transparent); }
.ep-stat-v { display: block; font-size: clamp(28px, 4vw, 40px); font-weight: 900; letter-spacing: -0.03em; color: var(--p); line-height: 1; }
.ep-stat-l { display: block; margin-top: 8px; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: color-mix(in srgb, var(--tx) 55%, transparent); }

.ep-prose { font-size: clamp(15px, 2vw, 18px); line-height: 1.8; color: color-mix(in srgb, var(--tx) 78%, transparent); max-width: 720px; margin: 0; }

/* Timeline */
.ep-timeline { position: relative; padding-left: 34px; }
.ep-timeline-line { position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px; transform-origin: top; background: linear-gradient(180deg, var(--p), color-mix(in srgb, var(--p) 15%, transparent)); }
.ep-timeline-line.is-visible { animation: epDraw 1s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes epDraw { from { transform: scaleY(0);} to { transform: scaleY(1);} }
.ep-tl-item { position: relative; padding-bottom: 28px; }
.ep-tl-item:last-child { padding-bottom: 0; }
.ep-tl-dot { position: absolute; left: -34px; top: 22px; width: 14px; height: 14px; border-radius: 50%; background: var(--bg); border: 3px solid var(--p); box-shadow: 0 0 0 4px color-mix(in srgb, var(--p) 12%, transparent); }
.ep-tl-card { padding: 24px 28px; border-radius: 14px; border: 1px solid color-mix(in srgb, var(--tx) 10%, transparent); background: var(--bg); transition: transform .3s, box-shadow .3s, border-color .3s; }
.ep-tl-card:hover { transform: translateX(6px); border-color: color-mix(in srgb, var(--p) 35%, transparent); box-shadow: 0 20px 44px -22px color-mix(in srgb, var(--tx) 40%, transparent); }
.ep-tl-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.ep-tl-role { font-size: 19px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.ep-tl-period { font-size: 13px; font-weight: 600; color: var(--p); white-space: nowrap; }
.ep-tl-company { font-size: 15px; color: color-mix(in srgb, var(--tx) 58%, transparent); margin: 4px 0 14px; font-weight: 500; }
.ep-tl-points { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 8px; }
.ep-tl-points li { font-size: 14.5px; line-height: 1.6; color: color-mix(in srgb, var(--tx) 72%, transparent); }
.ep-tl-points li::marker { color: var(--p); }

/* Skills */
.ep-skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.ep-skill { padding: 26px; border-radius: 14px; border: 1px solid color-mix(in srgb, var(--tx) 10%, transparent); background: color-mix(in srgb, var(--tx) 2%, transparent); transition: transform .3s, border-color .3s, box-shadow .3s; }
.ep-skill:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--p) 35%, transparent); box-shadow: 0 18px 40px -22px color-mix(in srgb, var(--p) 40%, transparent); }
.ep-skill-name { font-size: 16px; font-weight: 700; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); }
.ep-skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.ep-skill-tag { padding: 6px 13px; border-radius: 8px; font-size: 13px; font-weight: 600; background: color-mix(in srgb, var(--p) 9%, transparent); color: var(--p); transition: background .25s, color .25s; }
.ep-skill-tag:hover { background: var(--p); color: #fff; }

/* Contact */
.ep-contact-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 14px; }
.ep-contact-msg { font-size: clamp(15px, 2vw, 18px); line-height: 1.7; color: color-mix(in srgb, var(--tx) 62%, transparent); max-width: 560px; margin: 0 0 30px; }
.ep-contact-actions { display: flex; gap: 14px; flex-wrap: wrap; }
.ep-btn { display: inline-flex; align-items: center; padding: 14px 26px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; background: var(--p); color: #fff; transition: transform .25s, box-shadow .25s; box-shadow: 0 10px 26px -10px color-mix(in srgb, var(--p) 60%, transparent); }
.ep-btn:hover { transform: translateY(-3px); box-shadow: 0 18px 40px -12px color-mix(in srgb, var(--p) 70%, transparent); }
.ep-btn-outline { background: transparent; color: var(--tx); border: 1.5px solid color-mix(in srgb, var(--tx) 20%, transparent); box-shadow: none; }
.ep-btn-outline:hover { border-color: var(--p); color: var(--p); }

.ep-footer { padding: 40px 0; font-size: 13px; color: color-mix(in srgb, var(--tx) 45%, transparent); }

/* Reveal engine */
.css-reveal { opacity: 0; animation-fill-mode: both; animation-duration: .8s; animation-timing-function: cubic-bezier(.22,1,.36,1); }
.css-reveal.is-visible.rv-up { animation-name: epUp; }
@keyframes epUp { from { opacity:0; transform: translateY(26px);} to { opacity:1; transform:none;} }

@media (prefers-reduced-motion: reduce) {
  .css-reveal, .ep-hero-bg, .ep-timeline-line { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`
