import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

/**
 * Modern Minimal — light, whitespace-heavy, glassmorphism.
 * STATIC-SAFE: renders to an HTML string. No hooks, no JS libs.
 * All animation is pure CSS; scroll reveals use the shell's
 * IntersectionObserver (.css-reveal -> .is-visible).
 */
export default function ModernMinimal({ content, theme }: TemplateProps) {
  const { hero, about, experience, skills, contact } = content

  const rootVars = {
    "--p": theme.primaryColor,
    "--s": theme.secondaryColor,
    "--bg": theme.backgroundColor,
    "--tx": theme.textColor,
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: `'Inter', ${theme.fontFamily}`,
  } as React.CSSProperties

  return (
    <div className="mm-root" style={rootVars}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style dangerouslySetInnerHTML={{ __html: MM_CSS }} />

      {/* Ambient gradient orbs */}
      <div className="mm-orbs" aria-hidden="true">
        <span className="mm-orb mm-orb-1" />
        <span className="mm-orb mm-orb-2" />
        <span className="mm-orb mm-orb-3" />
      </div>
      {/* Noise texture */}
      <div className="mm-noise" aria-hidden="true" />

      {/* Nav */}
      <nav className="mm-nav">
        <div className="mm-nav-inner">
          <a href="#top" className="mm-brand">{hero.name}</a>
          <div className="mm-nav-links">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#skills">Skills</a>
            <a href="#contact" className="mm-nav-cta">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="mm-hero">
        <div className="mm-hero-inner">
          {hero.photoUrl && (
            <div className="mm-photo-wrap css-reveal rv-scale">
              <div className="mm-photo-blob" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.photoUrl} alt={hero.name} className="mm-photo" />
            </div>
          )}
          <p className="mm-eyebrow css-reveal rv-up">{about.title}</p>
          <h1 className="mm-title css-reveal rv-up" style={{ animationDelay: "0.08s" }}>
            <span className="mm-name">{hero.name}</span>
            <span className="mm-tagline">{hero.tagline}</span>
          </h1>
          <p className="mm-lede css-reveal rv-up" style={{ animationDelay: "0.16s" }}>
            {truncate(about.content, 180)}
          </p>
          <div className="mm-cta-row css-reveal rv-up" style={{ animationDelay: "0.24s" }}>
            <a href="#contact" className="mm-btn mm-btn-primary">{hero.ctaText}</a>
            <a href="#work" className="mm-btn mm-btn-ghost">View work</a>
          </div>
        </div>
        <div className="mm-scroll-hint" aria-hidden="true"><span /></div>
      </header>

      {/* About */}
      <section id="about" className="mm-section">
        <div className="mm-wrap">
          <p className="mm-quote css-reveal rv-up">{about.content}</p>
        </div>
      </section>

      <Divider />

      {/* Experience — glass cards */}
      <section id="work" className="mm-section">
        <div className="mm-wrap">
          <SectionHead index="01" title="Experience" />
          <div className="mm-exp-list">
            {experience.map((exp, i) => (
              <article
                key={i}
                className="mm-glass mm-exp css-reveal rv-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="mm-exp-head">
                  <div>
                    <h3 className="mm-exp-role">{exp.role}</h3>
                    <p className="mm-exp-company">{exp.company}</p>
                  </div>
                  <span className="mm-chip">{exp.period}</span>
                </div>
                <ul className="mm-exp-points">
                  {exp.highlights.map((h, hi) => (
                    <li key={hi}><span className="mm-bullet" aria-hidden="true" />{h}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* Skills — bento grid */}
      <section id="skills" className="mm-section">
        <div className="mm-wrap">
          <SectionHead index="02" title="Skills & Tools" />
          <div className="mm-bento">
            {skills.categories.map((cat, i) => (
              <div
                key={i}
                className={`mm-glass mm-bento-cell css-reveal rv-scale mm-bento-${(i % 3) + 1}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <h3 className="mm-bento-title">{cat.name}</h3>
                <div className="mm-tags">
                  {cat.items.map((s, si) => (
                    <span key={si} className="mm-tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mm-section">
        <div className="mm-wrap">
          <div className="mm-contact css-reveal rv-scale">
            <div className="mm-noise" aria-hidden="true" />
            <h2 className="mm-contact-title">{contact.heading}</h2>
            <p className="mm-contact-msg">{contact.message}</p>
            <div className="mm-cta-row mm-center">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="mm-btn mm-btn-invert">{contact.email}</a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="mm-btn mm-btn-outline-invert">LinkedIn</a>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="mm-footer">
        <span>{hero.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

/* -------------------- small presentational helpers -------------------- */
function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <div className="mm-head css-reveal rv-up">
      <span className="mm-head-index">{index}</span>
      <h2 className="mm-head-title">{title}</h2>
    </div>
  )
}
function Divider() {
  return (
    <div className="mm-wrap">
      <div className="mm-divider css-reveal rv-line" aria-hidden="true" />
    </div>
  )
}
function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s
}

/* --------------------------------- CSS --------------------------------- */
const MM_CSS = `
.mm-root { position: relative; min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.mm-root * { box-sizing: border-box; }
.mm-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }
.mm-section { padding: clamp(64px, 12vw, 140px) 0; position: relative; z-index: 2; }

/* Orbs */
.mm-orbs { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.mm-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.5; }
.mm-orb-1 { width: 46vw; height: 46vw; max-width: 560px; max-height: 560px; top: -8%; left: -6%;
  background: radial-gradient(circle, color-mix(in srgb, var(--p) 70%, transparent), transparent 70%);
  animation: mmFloat 22s ease-in-out infinite alternate; }
.mm-orb-2 { width: 40vw; height: 40vw; max-width: 520px; max-height: 520px; bottom: -12%; right: -8%;
  background: radial-gradient(circle, color-mix(in srgb, var(--s) 60%, transparent), transparent 70%);
  animation: mmFloat 26s ease-in-out infinite alternate-reverse; }
.mm-orb-3 { width: 30vw; height: 30vw; max-width: 420px; max-height: 420px; top: 42%; left: 46%;
  background: radial-gradient(circle, color-mix(in srgb, var(--p) 40%, transparent), transparent 70%);
  animation: mmFloat 30s ease-in-out infinite alternate; }
@keyframes mmFloat { 0% { transform: translate(0,0) scale(1);} 50%{ transform: translate(30px,-40px) scale(1.12);} 100%{ transform: translate(-20px,24px) scale(0.94);} }

.mm-noise { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 150px 150px; }

/* Nav */
.mm-nav { position: sticky; top: 0; z-index: 40; padding: 14px 0; }
.mm-nav-inner { max-width: 1080px; margin: 0 auto; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;
  border-radius: 999px; background: color-mix(in srgb, var(--bg) 72%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(160%); backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); box-shadow: 0 8px 30px -12px color-mix(in srgb, var(--tx) 22%, transparent); margin-left: 20px; margin-right: 20px; }
.mm-brand { font-weight: 800; letter-spacing: -0.02em; text-decoration: none; color: var(--tx); font-family: 'Outfit', sans-serif; }
.mm-nav-links { display: flex; align-items: center; gap: 26px; }
.mm-nav-links a { position: relative; text-decoration: none; color: color-mix(in srgb, var(--tx) 70%, transparent); font-weight: 600; font-size: 14px; transition: color .25s; }
.mm-nav-links a::after { content:''; position:absolute; left:0; bottom:-5px; height:2px; width:0; background: var(--p); transition: width .28s cubic-bezier(.22,1,.36,1); }
.mm-nav-links a:hover { color: var(--tx); } .mm-nav-links a:hover::after { width: 100%; }
.mm-nav-cta { padding: 8px 16px; border-radius: 999px; background: var(--p); color: #fff !important; } .mm-nav-cta::after { display:none; }
.mm-nav-cta:hover { filter: brightness(1.06); }
@media (max-width: 640px) { .mm-nav-links a:not(.mm-nav-cta) { display: none; } }

/* Hero */
.mm-hero { position: relative; z-index: 2; min-height: 92vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 24px 80px; }
.mm-hero-inner { max-width: 860px; }
.mm-photo-wrap { position: relative; width: 132px; height: 132px; margin: 0 auto 32px; }
.mm-photo-blob { position: absolute; inset: -10px; background: linear-gradient(135deg, var(--p), var(--s)); animation: mmMorph 8s ease-in-out infinite; filter: blur(2px); opacity: .9; }
.mm-photo { position: relative; z-index: 1; width: 132px; height: 132px; object-fit: cover; border-radius: 30% 70% 62% 38% / 42% 40% 60% 58%; animation: mmMorph 8s ease-in-out infinite; border: 3px solid var(--bg); }
@keyframes mmMorph { 0%,100%{border-radius:30% 70% 62% 38%/42% 40% 60% 58%;} 50%{border-radius:62% 38% 40% 60%/54% 62% 38% 46%;} }
.mm-eyebrow { text-transform: uppercase; letter-spacing: 0.32em; font-size: 12px; font-weight: 700; color: var(--p); margin: 0 0 20px; }
.mm-title { margin: 0; font-family: 'Outfit', sans-serif; line-height: 1.02; letter-spacing: -0.03em; }
.mm-name { display: block; font-size: clamp(40px, 8vw, 88px); font-weight: 900;
  background: linear-gradient(100deg, var(--p), var(--s), var(--p)); background-size: 220% auto;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
  animation: mmGrad 6s linear infinite; }
@keyframes mmGrad { to { background-position: 220% center; } }
.mm-tagline { display: block; font-size: clamp(18px, 3vw, 26px); font-weight: 600; color: color-mix(in srgb, var(--tx) 82%, transparent); margin-top: 14px; letter-spacing: -0.01em; }
.mm-lede { max-width: 620px; margin: 26px auto 0; font-size: clamp(15px, 2vw, 18px); line-height: 1.7; color: color-mix(in srgb, var(--tx) 62%, transparent); }
.mm-cta-row { display: flex; gap: 14px; margin-top: 36px; flex-wrap: wrap; }
.mm-center { justify-content: center; }
.mm-hero .mm-cta-row { justify-content: center; }

/* Buttons (magnetic-feel via transform) */
.mm-btn { display: inline-flex; align-items: center; gap: 8px; padding: 15px 28px; border-radius: 14px; font-weight: 700; font-size: 15px; text-decoration: none;
  transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s, filter .3s, background .3s; will-change: transform; }
.mm-btn-primary { background: var(--p); color: #fff; box-shadow: 0 10px 30px -8px color-mix(in srgb, var(--p) 60%, transparent); }
.mm-btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 18px 44px -10px color-mix(in srgb, var(--p) 70%, transparent); }
.mm-btn-ghost { background: color-mix(in srgb, var(--tx) 6%, transparent); color: var(--tx); border: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); }
.mm-btn-ghost:hover { transform: translateY(-3px); border-color: var(--p); color: var(--p); }
.mm-btn-invert { background: var(--bg); color: var(--p); } .mm-btn-invert:hover { transform: translateY(-3px) scale(1.02); }
.mm-btn-outline-invert { border: 1.5px solid color-mix(in srgb, #fff 60%, transparent); color: #fff; } .mm-btn-outline-invert:hover { transform: translateY(-3px); background: color-mix(in srgb,#fff 12%, transparent); }

.mm-scroll-hint { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); width: 24px; height: 38px; border-radius: 14px; border: 2px solid color-mix(in srgb, var(--tx) 30%, transparent); display:flex; justify-content:center; padding-top:7px; }
.mm-scroll-hint span { width: 4px; height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--tx) 45%, transparent); animation: mmScroll 1.6s ease-in-out infinite; }
@keyframes mmScroll { 0%,100%{ transform: translateY(0); opacity: 1;} 50%{ transform: translateY(8px); opacity:.4;} }

/* About quote */
.mm-quote { font-family: 'Outfit', sans-serif; font-size: clamp(24px, 4.4vw, 46px); font-weight: 600; line-height: 1.28; letter-spacing: -0.02em; max-width: 900px;
  background: linear-gradient(180deg, var(--tx), color-mix(in srgb, var(--tx) 55%, var(--bg))); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }

/* Section head */
.mm-head { display: flex; align-items: baseline; gap: 16px; margin-bottom: 44px; }
.mm-head-index { font-family: 'Outfit'; font-weight: 800; font-size: 14px; color: var(--p); letter-spacing: .1em; }
.mm-head-title { font-family: 'Outfit'; font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.02em; margin: 0; }

/* Divider line-draw */
.mm-divider { height: 1px; transform-origin: left; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--tx) 22%, transparent), transparent); }
.mm-divider.is-visible { animation: mmLine 1s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes mmLine { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }

/* Glass */
.mm-glass { background: color-mix(in srgb, var(--bg) 55%, #fff 8%); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  border: 1px solid color-mix(in srgb, var(--tx) 9%, transparent); border-radius: 20px; box-shadow: 0 12px 40px -18px color-mix(in srgb, var(--tx) 40%, transparent); }

/* Experience */
.mm-exp-list { display: flex; flex-direction: column; gap: 20px; }
.mm-exp { padding: 28px; transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s, border-color .4s; }
.mm-exp:hover { transform: translateY(-6px); border-color: color-mix(in srgb, var(--p) 45%, transparent); box-shadow: 0 24px 60px -22px color-mix(in srgb, var(--p) 50%, transparent); }
.mm-exp-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.mm-exp-role { font-family:'Outfit'; font-size: 21px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.mm-exp-company { margin: 4px 0 0; color: var(--p); font-weight: 600; font-size: 15px; }
.mm-chip { padding: 6px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 700; white-space: nowrap; background: color-mix(in srgb, var(--p) 12%, transparent); color: var(--p); }
.mm-exp-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.mm-exp-points li { display: flex; gap: 12px; align-items: flex-start; font-size: 15px; line-height: 1.6; color: color-mix(in srgb, var(--tx) 72%, transparent); }
.mm-bullet { flex: none; width: 7px; height: 7px; margin-top: 8px; border-radius: 50%; background: linear-gradient(135deg, var(--p), var(--s)); }

/* Bento */
.mm-bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.mm-bento-cell { padding: 26px; transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s, border-color .4s; }
.mm-bento-cell:hover { transform: translateY(-6px) scale(1.01); border-color: color-mix(in srgb, var(--p) 40%, transparent); box-shadow: 0 24px 56px -22px color-mix(in srgb, var(--p) 45%, transparent); }
.mm-bento-1 { grid-column: span 2; } .mm-bento-2 { grid-column: span 2; } .mm-bento-3 { grid-column: span 2; }
.mm-bento-title { font-family:'Outfit'; font-size: 17px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.01em; }
.mm-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.mm-tag { padding: 7px 13px; border-radius: 10px; font-size: 13px; font-weight: 600; background: color-mix(in srgb, var(--tx) 5%, transparent); border: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); transition: transform .2s, background .2s, color .2s; }
.mm-tag:hover { transform: translateY(-2px); background: var(--p); color: #fff; border-color: var(--p); }
@media (max-width: 860px) { .mm-bento { grid-template-columns: 1fr 1fr; } .mm-bento-cell { grid-column: span 1 !important; } }
@media (max-width: 520px) { .mm-bento { grid-template-columns: 1fr; } }

/* Contact */
.mm-contact { position: relative; overflow: hidden; border-radius: 32px; padding: clamp(40px, 7vw, 80px); text-align: center; color: #fff;
  background: linear-gradient(135deg, var(--p), var(--s)); box-shadow: 0 40px 90px -30px color-mix(in srgb, var(--p) 70%, transparent); }
.mm-contact .mm-noise { opacity: 0.12; }
.mm-contact-title { position: relative; font-family:'Outfit'; font-size: clamp(30px, 5vw, 54px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
.mm-contact-msg { position: relative; max-width: 560px; margin: 0 auto 34px; font-size: clamp(15px, 2vw, 18px); line-height: 1.7; opacity: .92; }

/* Footer */
.mm-footer { position: relative; z-index: 2; display: flex; justify-content: space-between; max-width: 1080px; margin: 0 auto; padding: 40px 24px; font-size: 13px; font-weight: 600;
  color: color-mix(in srgb, var(--tx) 45%, transparent); border-top: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); }

/* Reveal engine */
.css-reveal { opacity: 0; animation-fill-mode: both; animation-duration: .85s; animation-timing-function: cubic-bezier(.22,1,.36,1); }
.css-reveal.is-visible.rv-up { animation-name: mmUp; }
.css-reveal.is-visible.rv-scale { animation-name: mmScale; }
@keyframes mmUp { from { opacity:0; transform: translateY(38px);} to { opacity:1; transform:none;} }
@keyframes mmScale { from { opacity:0; transform: scale(.94);} to { opacity:1; transform:none;} }

@media (prefers-reduced-motion: reduce) {
  .css-reveal, .mm-orb, .mm-name, .mm-photo, .mm-photo-blob, .mm-scroll-hint span { animation: none !important; opacity: 1 !important; transform: none !important; }
  .mm-name { -webkit-text-fill-color: initial; color: var(--p); }
}
`
