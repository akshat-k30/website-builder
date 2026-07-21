import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

/**
 * Noir Luxe — dark, editorial luxury magazine.
 * STATIC-SAFE: pure CSS. Oversized Bodoni display, thin rules that draw in,
 * gold accent, refined hover underlines, magazine grid, scroll reveals.
 * Fonts: Libre Bodoni (display) + Public Sans (body).
 */
export default function NoirLuxe({ content, theme }: TemplateProps) {
  const { hero, about, experience, skills, contact } = content

  // Ensure a dark canvas regardless of incoming theme.
  const bg = isLight(theme.backgroundColor) ? "#0e0e10" : theme.backgroundColor
  const tx = isLight(theme.backgroundColor) ? "#ece8e1" : theme.textColor

  const rootVars = {
    "--p": theme.primaryColor,
    "--s": theme.secondaryColor,
    "--bg": bg,
    "--tx": tx,
    backgroundColor: bg,
    color: tx,
    fontFamily: `'Public Sans', ${theme.fontFamily}, sans-serif`,
  } as React.CSSProperties

  return (
    <div className="nl-root" style={rootVars}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,500;0,600;0,700;1,500&family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: NL_CSS }} />

      <div className="nl-grain" aria-hidden="true" />

      {/* Nav */}
      <nav className="nl-nav">
        <a href="#top" className="nl-brand">{hero.name}</a>
        <div className="nl-nav-links">
          <a href="#about">Profile</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="nl-hero">
        <div className="nl-wrap">
          <p className="nl-kicker css-reveal rv-up"><span className="nl-rule" />{about.title}</p>
          <h1 className="nl-title css-reveal rv-up" style={{ animationDelay: ".08s" }}>{hero.name}</h1>
          <p className="nl-tagline css-reveal rv-up" style={{ animationDelay: ".16s" }}>{hero.tagline}</p>
          <div className="nl-hero-foot css-reveal rv-up" style={{ animationDelay: ".24s" }}>
            <a href="#contact" className="nl-btn">{hero.ctaText}</a>
            {hero.photoUrl && (
              <div className="nl-hero-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.photoUrl} alt={hero.name} />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="nl-wrap"><div className="nl-divider css-reveal rv-line" aria-hidden="true" /></div>

      {/* About */}
      <section id="about" className="nl-section">
        <div className="nl-wrap nl-about-grid">
          <span className="nl-label css-reveal rv-up">The Profile</span>
          <p className="nl-about css-reveal rv-up" style={{ animationDelay: ".08s" }}>{about.content}</p>
        </div>
      </section>

      <div className="nl-wrap"><div className="nl-divider css-reveal rv-line" aria-hidden="true" /></div>

      {/* Experience */}
      <section id="work" className="nl-section">
        <div className="nl-wrap">
          <span className="nl-label css-reveal rv-up">Selected Experience</span>
          <div className="nl-exp-list">
            {experience.map((exp, i) => (
              <article key={i} className="nl-exp css-reveal rv-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="nl-exp-left">
                  <span className="nl-exp-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nl-exp-period">{exp.period}</span>
                </div>
                <div className="nl-exp-body">
                  <h3 className="nl-exp-role">{exp.role}</h3>
                  <p className="nl-exp-co">{exp.company}</p>
                  <ul>
                    {exp.highlights.map((h, hi) => <li key={hi}>{h}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="nl-wrap"><div className="nl-divider css-reveal rv-line" aria-hidden="true" /></div>

      {/* Skills */}
      <section className="nl-section">
        <div className="nl-wrap">
          <span className="nl-label css-reveal rv-up">Expertise</span>
          <div className="nl-skills">
            {skills.categories.map((cat, i) => (
              <div key={i} className="nl-skill css-reveal rv-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <h3 className="nl-skill-name">{cat.name}</h3>
                <ul className="nl-skill-items">
                  {cat.items.map((s, si) => <li key={si}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="nl-section nl-contact">
        <div className="nl-wrap">
          <h2 className="nl-contact-title css-reveal rv-up">{contact.heading}</h2>
          <p className="nl-contact-msg css-reveal rv-up" style={{ animationDelay: ".08s" }}>{contact.message}</p>
          <div className="nl-contact-links css-reveal rv-up" style={{ animationDelay: ".16s" }}>
            {contact.email && <a href={`mailto:${contact.email}`} className="nl-link">{contact.email}</a>}
            {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="nl-link">LinkedIn</a>}
          </div>
        </div>
      </section>

      <footer className="nl-footer">
        <span className="nl-footer-name">{hero.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

function isLight(hex: string) {
  const h = hex.replace("#", "")
  if (h.length < 6) return true
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 150
}

const NL_CSS = `
.nl-root { position: relative; min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.nl-root * { box-sizing: border-box; }
.nl-wrap { max-width: 1080px; margin: 0 auto; padding: 0 28px; }
.nl-section { padding: clamp(56px, 9vw, 120px) 0; position: relative; z-index: 2; }
.nl-grain { position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 140px 140px; }

/* Nav */
.nl-nav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; max-width: 1080px; margin: 0 auto; padding: 22px 28px;
  background: color-mix(in srgb, var(--bg) 80%, transparent); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
.nl-brand { font-family: 'Libre Bodoni'; font-weight: 600; font-size: 20px; text-decoration: none; color: var(--tx); letter-spacing: .01em; }
.nl-nav-links { display: flex; gap: 28px; }
.nl-nav-links a { text-transform: uppercase; letter-spacing: .16em; font-size: 11.5px; font-weight: 600; text-decoration: none; color: color-mix(in srgb, var(--tx) 60%, transparent); position: relative; transition: color .3s; }
.nl-nav-links a::after { content:''; position:absolute; left:0; bottom:-4px; height:1px; width:0; background: var(--p); transition: width .35s ease; }
.nl-nav-links a:hover { color: var(--p); } .nl-nav-links a:hover::after { width:100%; }
@media (max-width: 560px){ .nl-nav-links { gap: 16px; } }

/* Hero */
.nl-hero { padding: clamp(48px, 9vw, 100px) 0 clamp(40px, 6vw, 70px); position: relative; z-index: 2; }
.nl-kicker { display: flex; align-items: center; gap: 14px; text-transform: uppercase; letter-spacing: .28em; font-size: 12px; font-weight: 600; color: var(--p); margin: 0 0 26px; }
.nl-rule { width: 42px; height: 1px; background: var(--p); display: inline-block; }
.nl-title { font-family: 'Libre Bodoni'; font-weight: 700; font-size: clamp(52px, 11vw, 132px); line-height: .92; letter-spacing: -0.02em; margin: 0; color: var(--tx); }
.nl-tagline { font-family: 'Libre Bodoni'; font-style: italic; font-weight: 500; font-size: clamp(20px, 3vw, 30px); color: color-mix(in srgb, var(--tx) 70%, transparent); margin: 26px 0 0; max-width: 680px; line-height: 1.4; }
.nl-hero-foot { display: flex; align-items: center; gap: 28px; margin-top: 40px; flex-wrap: wrap; }
.nl-hero-photo { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 1px solid color-mix(in srgb, var(--p) 40%, transparent); }
.nl-hero-photo img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(0.2); }

/* Button */
.nl-btn { display: inline-flex; align-items: center; padding: 15px 34px; border: 1px solid var(--p); border-radius: 0; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: .14em; text-decoration: none; color: var(--p); background: transparent; transition: background .35s, color .35s; }
.nl-btn:hover { background: var(--p); color: var(--bg); }

/* Divider */
.nl-divider { height: 1px; background: color-mix(in srgb, var(--tx) 18%, transparent); transform-origin: left; }
.nl-divider.is-visible { animation: nlLine 1.1s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes nlLine { from { transform: scaleX(0);} to { transform: scaleX(1);} }

/* Label */
.nl-label { display: block; text-transform: uppercase; letter-spacing: .24em; font-size: 12px; font-weight: 600; color: var(--p); margin-bottom: 36px; }

/* About */
.nl-about-grid { display: grid; grid-template-columns: 200px 1fr; gap: 32px; align-items: start; }
@media (max-width: 720px){ .nl-about-grid { grid-template-columns: 1fr; gap: 16px; } }
.nl-about-grid .nl-label { margin-bottom: 0; padding-top: 10px; }
.nl-about { font-family: 'Libre Bodoni'; font-weight: 500; font-size: clamp(22px, 3vw, 32px); line-height: 1.5; color: color-mix(in srgb, var(--tx) 88%, transparent); margin: 0; }

/* Experience */
.nl-exp-list { display: flex; flex-direction: column; }
.nl-exp { display: grid; grid-template-columns: 140px 1fr; gap: 32px; padding: 34px 0; border-top: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); transition: padding-left .35s ease; }
.nl-exp:hover { padding-left: 12px; }
.nl-exp:first-child { border-top: none; padding-top: 0; }
@media (max-width: 640px){ .nl-exp { grid-template-columns: 1fr; gap: 10px; } }
.nl-exp-left { display: flex; flex-direction: column; gap: 6px; }
.nl-exp-num { font-family: 'Libre Bodoni'; font-size: 30px; font-weight: 600; color: var(--p); line-height: 1; }
.nl-exp-period { font-size: 13px; letter-spacing: .06em; color: color-mix(in srgb, var(--tx) 55%, transparent); }
.nl-exp-role { font-family: 'Libre Bodoni'; font-size: clamp(22px, 3vw, 30px); font-weight: 600; margin: 0; letter-spacing: -0.01em; }
.nl-exp-co { font-size: 15px; color: var(--p); margin: 4px 0 16px; font-weight: 500; }
.nl-exp ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.nl-exp li { position: relative; padding-left: 22px; font-size: 15px; line-height: 1.6; color: color-mix(in srgb, var(--tx) 68%, transparent); }
.nl-exp li::before { content: '—'; position: absolute; left: 0; color: var(--p); }

/* Skills */
.nl-skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px; }
.nl-skill { border-top: 1px solid color-mix(in srgb, var(--p) 40%, transparent); padding-top: 20px; }
.nl-skill-name { font-family: 'Libre Bodoni'; font-size: 20px; font-weight: 600; margin: 0 0 16px; }
.nl-skill-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.nl-skill-items li { font-size: 14.5px; color: color-mix(in srgb, var(--tx) 72%, transparent); transition: color .2s, transform .2s; }
.nl-skill-items li:hover { color: var(--p); transform: translateX(4px); }

/* Contact */
.nl-contact { text-align: center; }
.nl-contact-title { font-family: 'Libre Bodoni'; font-weight: 700; font-size: clamp(40px, 8vw, 92px); line-height: 1; letter-spacing: -0.02em; margin: 0 0 22px; }
.nl-contact-msg { font-family: 'Libre Bodoni'; font-style: italic; font-size: clamp(19px, 2.6vw, 26px); color: color-mix(in srgb, var(--tx) 66%, transparent); max-width: 580px; margin: 0 auto 36px; line-height: 1.5; }
.nl-contact-links { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; }
.nl-link { text-transform: uppercase; letter-spacing: .12em; font-size: 14px; font-weight: 600; color: var(--tx); text-decoration: none; border-bottom: 1px solid var(--p); padding-bottom: 4px; transition: color .3s; }
.nl-link:hover { color: var(--p); }

.nl-footer { position: relative; z-index: 2; display: flex; justify-content: space-between; max-width: 1080px; margin: 0 auto; padding: 40px 28px; border-top: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); font-size: 13px; letter-spacing: .06em; color: color-mix(in srgb, var(--tx) 50%, transparent); }
.nl-footer-name { font-family: 'Libre Bodoni'; font-style: italic; }

/* Reveal engine */
.css-reveal { opacity: 0; animation-fill-mode: both; animation-duration: .9s; animation-timing-function: cubic-bezier(.22,1,.36,1); }
.css-reveal.is-visible.rv-up { animation-name: nlUp; }
@keyframes nlUp { from { opacity:0; transform: translateY(32px);} to { opacity:1; transform:none;} }

@media (prefers-reduced-motion: reduce) {
  .css-reveal, .nl-divider { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`
