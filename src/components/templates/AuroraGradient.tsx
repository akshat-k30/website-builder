import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import { safeUrl } from "@/lib/sanitize"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

/**
 * Aurora — vibrant, gradient-forward creative portfolio.
 * STATIC-SAFE: pure CSS. Animated mesh-gradient hero, gradient display type,
 * glassmorphism cards, a CSS marquee skill ribbon, scroll reveals.
 * Fonts: Syne (display) + Manrope (body).
 */
export default function AuroraGradient({ content, theme }: TemplateProps) {
  const { hero, about, experience, skills, contact } = content
  const allSkills = skills.categories.flatMap((c) => c.items)

  const rootVars = {
    "--p": theme.primaryColor,
    "--s": theme.secondaryColor,
    "--bg": theme.backgroundColor,
    "--tx": theme.textColor,
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
  } as React.CSSProperties

  return (
    <div className="au-root" style={rootVars}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: AU_CSS }} />

      {/* Animated mesh gradient background */}
      <div className="au-mesh" aria-hidden="true" />
      <div className="au-noise" aria-hidden="true" />

      {/* Nav */}
      <nav className="au-nav">
        <a href="#top" className="au-brand">{hero.name}</a>
        <div className="au-nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact" className="au-nav-cta">Let&apos;s talk</a>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="au-hero">
        <div className="au-hero-inner">
          {hero.photoUrl && (
            <div className="au-hero-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.photoUrl} alt={hero.name} />
            </div>
          )}
          <span className="au-badge css-reveal rv-up">{about.title}</span>
          <h1 className="au-title css-reveal rv-up" style={{ animationDelay: ".08s" }}>
            <span className="au-line">{hero.name}</span>
          </h1>
          <p className="au-tagline css-reveal rv-up" style={{ animationDelay: ".16s" }}>{hero.tagline}</p>
          <div className="au-cta-row css-reveal rv-up" style={{ animationDelay: ".24s" }}>
            <a href="#contact" className="au-btn">{hero.ctaText}</a>
            <a href="#work" className="au-btn au-btn-ghost">See my work →</a>
          </div>
        </div>
      </header>

      {/* Skill marquee ribbon */}
      {allSkills.length > 0 && (
        <div className="au-marquee" aria-hidden="true">
          <div className="au-marquee-track">
            {[...allSkills, ...allSkills].map((s, i) => (
              <span key={i} className="au-marquee-item">{s}<span className="au-dot">✦</span></span>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      <section id="about" className="au-section">
        <div className="au-wrap">
          <p className="au-about css-reveal rv-up">{about.content}</p>
        </div>
      </section>

      {/* Experience */}
      <section id="work" className="au-section">
        <div className="au-wrap">
          <div className="au-head css-reveal rv-up"><span className="au-head-num">01</span><h2>Experience</h2></div>
          <div className="au-exp-list">
            {experience.map((exp, i) => (
              <article key={i} className="au-glass au-exp css-reveal rv-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="au-exp-index">{String(i + 1).padStart(2, "0")}</span>
                <div className="au-exp-main">
                  <div className="au-exp-top">
                    <div>
                      <h3>{exp.role}</h3>
                      <p className="au-exp-co">{exp.company}</p>
                    </div>
                    <span className="au-chip">{exp.period}</span>
                  </div>
                  <ul>
                    {exp.highlights.map((h, hi) => <li key={hi}>{h}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="au-section">
        <div className="au-wrap">
          <div className="au-head css-reveal rv-up"><span className="au-head-num">02</span><h2>What I do</h2></div>
          <div className="au-skills">
            {skills.categories.map((cat, i) => (
              <div key={i} className="au-glass au-skill css-reveal rv-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <h3 className="au-skill-name">{cat.name}</h3>
                <div className="au-tags">
                  {cat.items.map((s, si) => <span key={si} className="au-tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="au-section">
        <div className="au-wrap">
          <div className="au-contact css-reveal rv-scale">
            <div className="au-noise" aria-hidden="true" />
            <h2>{contact.heading}</h2>
            <p>{contact.message}</p>
            <div className="au-contact-links">
              {contact.email && <a href={`mailto:${contact.email}`} className="au-btn au-btn-white">{contact.email}</a>}
              {contact.linkedin && <a href={safeUrl(contact.linkedin)} target="_blank" rel="noreferrer" className="au-btn au-btn-outline-white">LinkedIn ↗</a>}
            </div>
          </div>
        </div>
      </section>

      <footer className="au-footer"><span>{hero.name}</span><span>© {new Date().getFullYear()}</span></footer>
    </div>
  )
}

const AU_CSS = `
.au-root { position: relative; min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.au-root * { box-sizing: border-box; }
.au-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.au-section { padding: clamp(56px, 10vw, 120px) 0; position: relative; z-index: 2; }

/* Animated mesh gradient */
.au-mesh { position: fixed; inset: -20%; z-index: 0; pointer-events: none; opacity: .9; filter: blur(60px);
  background:
    radial-gradient(40% 40% at 20% 20%, color-mix(in srgb, var(--p) 55%, transparent), transparent 70%),
    radial-gradient(38% 38% at 82% 15%, color-mix(in srgb, var(--s) 50%, transparent), transparent 70%),
    radial-gradient(45% 45% at 70% 80%, color-mix(in srgb, var(--p) 40%, transparent), transparent 70%),
    radial-gradient(40% 40% at 15% 85%, color-mix(in srgb, var(--s) 45%, transparent), transparent 70%);
  background-repeat: no-repeat; animation: auMesh 20s ease-in-out infinite alternate; }
@keyframes auMesh {
  0% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(3%, -2%, 0) scale(1.08); }
  100% { transform: translate3d(-3%, 2%, 0) scale(1.04); }
}
.au-noise { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: .04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 150px 150px; }

/* Nav */
.au-nav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; max-width: 1080px; margin: 14px auto 0; padding: 12px 20px;
  background: color-mix(in srgb, var(--bg) 60%, transparent); -webkit-backdrop-filter: blur(18px) saturate(160%); backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); border-radius: 999px; }
.au-brand { font-family: 'Syne'; font-weight: 800; font-size: 18px; text-decoration: none; color: var(--tx); }
.au-nav-links { display: flex; align-items: center; gap: 22px; }
.au-nav-links a { text-decoration: none; color: color-mix(in srgb, var(--tx) 72%, transparent); font-weight: 600; font-size: 14px; transition: color .25s; }
.au-nav-links a:hover { color: var(--tx); }
.au-nav-cta { padding: 9px 18px; border-radius: 999px; color: #fff !important; background: linear-gradient(120deg, var(--p), var(--s)); }
@media (max-width: 640px){ .au-nav-links a:not(.au-nav-cta){ display:none; } }

/* Hero */
.au-hero { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; padding: clamp(48px, 9vw, 110px) 24px; text-align: center; }
.au-hero-inner { max-width: 780px; margin: 0 auto; }
.au-hero-avatar { width: 128px; height: 128px; margin: 0 auto 26px; border-radius: 50%; overflow: hidden; border: 3px solid var(--bg);
  box-shadow: 0 14px 44px -10px color-mix(in srgb, var(--p) 60%, transparent), 0 0 0 3px color-mix(in srgb, var(--p) 35%, transparent); }
.au-hero-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.au-badge { display: inline-block; padding: 7px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; color: var(--p);
  background: color-mix(in srgb, var(--p) 12%, transparent); border: 1px solid color-mix(in srgb, var(--p) 25%, transparent); margin-bottom: 22px; }
.au-title { margin: 0; font-family: 'Syne'; font-weight: 800; line-height: .95; letter-spacing: -0.03em; }
.au-line { display: block; font-size: clamp(46px, 9vw, 104px);
  background: linear-gradient(115deg, var(--p), var(--s), var(--p)); background-size: 220% auto;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: auGrad 6s linear infinite; }
@keyframes auGrad { to { background-position: 220% center; } }
.au-tagline { font-size: clamp(18px, 2.6vw, 26px); font-weight: 500; color: color-mix(in srgb, var(--tx) 72%, transparent); margin: 22px auto 0; max-width: 560px; line-height: 1.4; }
.au-cta-row { display: flex; gap: 14px; margin-top: 34px; flex-wrap: wrap; justify-content: center; }

/* Buttons */
.au-btn { display: inline-flex; align-items: center; gap: 8px; padding: 15px 28px; border-radius: 14px; font-weight: 700; font-size: 15px; text-decoration: none; color: #fff;
  background: linear-gradient(120deg, var(--p), var(--s)); box-shadow: 0 12px 30px -10px color-mix(in srgb, var(--p) 60%, transparent);
  transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s; }
.au-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 20px 44px -12px color-mix(in srgb, var(--p) 70%, transparent); }
.au-btn-ghost { background: color-mix(in srgb, var(--tx) 6%, transparent); color: var(--tx); box-shadow: none; }
.au-btn-ghost:hover { background: color-mix(in srgb, var(--tx) 10%, transparent); }
.au-btn-white { background: #fff; color: var(--p); }
.au-btn-outline-white { background: transparent; border: 1.5px solid color-mix(in srgb, #fff 55%, transparent); color: #fff; box-shadow: none; }

/* Marquee */
.au-marquee { position: relative; z-index: 2; overflow: hidden; padding: 18px 0; border-top: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--tx) 8%, transparent);
  background: color-mix(in srgb, var(--bg) 50%, transparent); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.au-marquee-track { display: inline-flex; white-space: nowrap; animation: auMarquee 30s linear infinite; }
@keyframes auMarquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }
.au-marquee-item { font-family: 'Syne'; font-weight: 700; font-size: clamp(18px, 3vw, 30px); color: color-mix(in srgb, var(--tx) 78%, transparent); padding: 0 4px; display: inline-flex; align-items: center; }
.au-dot { color: var(--p); margin: 0 26px; font-size: .6em; }

/* About */
.au-about { font-family: 'Syne'; font-weight: 600; font-size: clamp(24px, 4vw, 42px); line-height: 1.3; letter-spacing: -0.02em; max-width: 880px; color: var(--tx); }

/* Section head */
.au-head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 40px; }
.au-head-num { font-family: 'Syne'; font-weight: 800; font-size: 15px; color: var(--p); }
.au-head h2 { font-family: 'Syne'; font-weight: 800; font-size: clamp(28px, 4.5vw, 46px); letter-spacing: -0.02em; margin: 0; }

/* Glass */
.au-glass { background: color-mix(in srgb, var(--bg) 55%, #fff 6%); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px);
  border: 1px solid color-mix(in srgb, var(--tx) 9%, transparent); border-radius: 22px; box-shadow: 0 16px 44px -22px color-mix(in srgb, var(--tx) 40%, transparent); }

/* Experience */
.au-exp-list { display: flex; flex-direction: column; gap: 18px; }
.au-exp { display: flex; gap: 20px; padding: 28px; transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s, border-color .4s; }
.au-exp:hover { transform: translateY(-6px); border-color: color-mix(in srgb, var(--p) 40%, transparent); box-shadow: 0 30px 60px -26px color-mix(in srgb, var(--p) 50%, transparent); }
.au-exp-index { font-family: 'Syne'; font-weight: 800; font-size: 34px; line-height: 1; color: color-mix(in srgb, var(--p) 35%, transparent); flex: none; }
.au-exp-main { flex: 1; min-width: 0; }
.au-exp-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
.au-exp h3 { font-family: 'Syne'; font-size: 21px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.au-exp-co { color: var(--p); font-weight: 600; font-size: 15px; margin: 4px 0 0; }
.au-chip { padding: 6px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 700; white-space: nowrap; color: #fff; background: linear-gradient(120deg, var(--p), var(--s)); }
.au-exp ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.au-exp li { position: relative; padding-left: 20px; font-size: 15px; line-height: 1.6; color: color-mix(in srgb, var(--tx) 72%, transparent); }
.au-exp li::before { content: ''; position: absolute; left: 0; top: 9px; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(120deg, var(--p), var(--s)); }

/* Skills */
.au-skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.au-skill { padding: 26px; transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s, border-color .4s; }
.au-skill:hover { transform: translateY(-6px); border-color: color-mix(in srgb, var(--p) 40%, transparent); box-shadow: 0 30px 60px -26px color-mix(in srgb, var(--s) 50%, transparent); }
.au-skill-name { font-family: 'Syne'; font-size: 18px; font-weight: 700; margin: 0 0 16px; }
.au-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.au-tag { padding: 7px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; background: color-mix(in srgb, var(--p) 8%, transparent); border: 1px solid color-mix(in srgb, var(--p) 18%, transparent); color: color-mix(in srgb, var(--tx) 85%, transparent); transition: transform .2s, background .2s, color .2s; }
.au-tag:hover { transform: translateY(-2px); background: linear-gradient(120deg, var(--p), var(--s)); color: #fff; border-color: transparent; }

/* Contact */
.au-contact { position: relative; overflow: hidden; border-radius: 32px; padding: clamp(40px, 7vw, 84px); text-align: center; color: #fff;
  background: linear-gradient(130deg, var(--p), var(--s)); box-shadow: 0 40px 90px -30px color-mix(in srgb, var(--p) 70%, transparent); }
.au-contact h2 { position: relative; font-family: 'Syne'; font-size: clamp(30px, 5.5vw, 60px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
.au-contact p { position: relative; max-width: 560px; margin: 0 auto 32px; font-size: clamp(15px, 2vw, 18px); line-height: 1.7; opacity: .92; }
.au-contact-links { position: relative; display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

.au-footer { position: relative; z-index: 2; display: flex; justify-content: space-between; max-width: 1080px; margin: 0 auto; padding: 40px 24px; font-family: 'Syne'; font-weight: 600; font-size: 14px; color: color-mix(in srgb, var(--tx) 50%, transparent); border-top: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); }

/* Reveal engine */
.css-reveal { opacity: 0; animation-fill-mode: both; animation-duration: .85s; animation-timing-function: cubic-bezier(.22,1,.36,1); }
.css-reveal.is-visible.rv-up { animation-name: auUp; }
.css-reveal.is-visible.rv-scale { animation-name: auScale; }
@keyframes auUp { from { opacity:0; transform: translateY(38px);} to { opacity:1; transform:none;} }
@keyframes auScale { from { opacity:0; transform: scale(.94);} to { opacity:1; transform:none;} }

@media (prefers-reduced-motion: reduce) {
  .css-reveal, .au-mesh, .au-line, .au-marquee-track { animation: none !important; opacity: 1 !important; transform: none !important; }
  .au-line { -webkit-text-fill-color: initial; color: var(--p); }
}
`
