import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface TemplateProps {
  content: WebsiteContent
  theme: TemplateTheme
}

/**
 * Bold Developer — dark, terminal-inspired.
 * STATIC-SAFE: pure CSS. Hero tagline types out via a ch-based CSS
 * keyframe (font is monospace, so ch width is exact). Ambient
 * "code rain" columns are CSS-only translateY loops.
 */
export default function BoldDeveloper({ content, theme }: TemplateProps) {
  const { hero, about, experience, skills, contact } = content

  // Force a dark canvas even if the incoming theme is light.
  const bg = isLight(theme.backgroundColor) ? "#0b0f19" : theme.backgroundColor
  const tx = isLight(theme.backgroundColor) ? "#e5e9f0" : theme.textColor

  const rootVars = {
    "--p": theme.primaryColor,
    "--s": theme.secondaryColor,
    "--bg": bg,
    "--tx": tx,
    backgroundColor: bg,
    color: tx,
    fontFamily: `'Fira Code', ${theme.fontFamily}, monospace`,
  } as React.CSSProperties

  const firstName = hero.name.split(" ")[0] || hero.name
  const taglineLen = Math.min(hero.tagline.length, 48)
  const typingStyle = {
    width: 0,
    "--ch": `${taglineLen}ch`,
    animation: `bdType 3.2s steps(${taglineLen}) .5s forwards, bdBlink .8s step-end infinite`,
  } as React.CSSProperties

  const codeSkills = skills.categories[0]?.items.slice(0, 3) ?? []

  return (
    <div className="bd-root" style={rootVars}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: BD_CSS }} />

      {/* Code rain */}
      <div className="bd-rain" aria-hidden="true">
        {RAIN_COLS.map((col, i) => (
          <span key={i} className="bd-rain-col" style={{ left: `${(i / RAIN_COLS.length) * 100}%`, animationDuration: `${col.dur}s`, animationDelay: `${col.delay}s` }}>
            {col.chars}
          </span>
        ))}
      </div>

      {/* Nav */}
      <nav className="bd-nav">
        <span className="bd-logo">&lt;{firstName}/&gt;</span>
        <div className="bd-nav-links">
          <a href="#about">~/about</a>
          <a href="#exp">~/exp</a>
          <a href="#skills">~/skills</a>
          <a href="#contact">~/contact</a>
        </div>
      </nav>

      {/* Hero */}
      <header className="bd-hero">
        <div className="bd-hero-copy">
          <p className="bd-prompt css-reveal rv-up"><span className="bd-dollar">$</span> whoami</p>
          <h1 className="bd-name css-reveal rv-up" style={{ animationDelay: ".08s" }}>{hero.name}</h1>
          <p className="bd-typing-line"><span className="bd-typing" style={typingStyle}>{hero.tagline}</span></p>
          <p className="bd-about css-reveal rv-up" style={{ animationDelay: ".2s" }}>{truncate(about.content, 160)}</p>
          <a href="#contact" className="bd-btn css-reveal rv-up" style={{ animationDelay: ".28s" }}>{hero.ctaText} <span className="bd-cursor">_</span></a>
        </div>

        {/* Code window */}
        <div className="bd-window css-reveal rv-scale" style={{ animationDelay: ".16s" }}>
          <div className="bd-window-bar">
            <span className="bd-dot" style={{ background: "#ff5f56" }} />
            <span className="bd-dot" style={{ background: "#ffbd2e" }} />
            <span className="bd-dot" style={{ background: "#27c93f" }} />
            <span className="bd-window-title">developer.ts</span>
          </div>
          <pre className="bd-code"><code>
<span className="c-key">const</span> <span className="c-var">dev</span> <span className="c-op">=</span> {"{"}{"\n"}
{"  "}<span className="c-prop">name</span>: <span className="c-str">&quot;{hero.name}&quot;</span>,{"\n"}
{"  "}<span className="c-prop">skills</span>: [{"\n"}
{codeSkills.map((s, i) => (
  <span key={i}>{"    "}<span className="c-str">&quot;{s}&quot;</span>{i < codeSkills.length - 1 ? "," : ""}{"\n"}</span>
))}
{"  "}],{"\n"}
{"  "}<span className="c-prop">available</span>: <span className="c-bool">true</span>,{"\n"}
{"}"};{"\n\n"}
<span className="c-var">dev</span>.<span className="c-fn">ship</span>();
          </code></pre>
        </div>
      </header>

      {/* Experience */}
      <section id="exp" className="bd-section">
        <h2 className="bd-h2 css-reveal rv-up"><span className="bd-dollar">$</span> git log --experience</h2>
        <div className="bd-exp-list">
          {experience.map((exp, i) => (
            <article key={i} className="bd-exp css-reveal rv-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="bd-exp-head">
                <h3 className="bd-exp-role">{exp.role}</h3>
                <span className="bd-exp-at">@ {exp.company}</span>
                <span className="bd-exp-period">{exp.period}</span>
              </div>
              <ul className="bd-exp-points">
                {exp.highlights.map((h, hi) => (
                  <li key={hi}><span className="bd-arrow">→</span>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Skills grid-reveal */}
      <section id="skills" className="bd-section">
        <h2 className="bd-h2 css-reveal rv-up"><span className="bd-dollar">$</span> ls ./capabilities</h2>
        <div className="bd-skills">
          {skills.categories.map((cat, i) => (
            <div key={i} className="bd-skill-card css-reveal rv-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <h3 className="bd-skill-title">./{slug(cat.name)}</h3>
              <div className="bd-tags">
                {cat.items.map((s, si) => (
                  <span key={si} className="bd-tag css-reveal rv-scale" style={{ animationDelay: `${0.1 + si * 0.04}s` }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bd-section bd-contact">
        <h2 className="bd-contact-h css-reveal rv-up">{contact.heading}</h2>
        <p className="bd-contact-msg css-reveal rv-up" style={{ animationDelay: ".08s" }}>{contact.message}</p>
        <div className="bd-contact-btns css-reveal rv-up" style={{ animationDelay: ".16s" }}>
          {contact.email && <a href={`mailto:${contact.email}`} className="bd-btn">{contact.email}</a>}
          {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="bd-btn bd-btn-ghost">LinkedIn ↗</a>}
        </div>
      </section>

      <footer className="bd-footer">{"// EOF — © "}{new Date().getFullYear()} {hero.name}</footer>
    </div>
  )
}

/* helpers */
function isLight(hex: string) {
  const h = hex.replace("#", "")
  if (h.length < 6) return true
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 150
}
function truncate(s: string, n: number) { return s.length > n ? s.slice(0, n).trimEnd() + "…" : s }
function slug(s: string) { return s.toLowerCase().replace(/\s+/g, "-") }

const RAIN_COLS = [
  { chars: "01001 λ => {} const 10110 async 001", dur: 9, delay: 0 },
  { chars: "function() 1010 => [] 0x1F 110 npm", dur: 12, delay: 1.5 },
  { chars: "git push 0110 <T> 1001 await 010", dur: 10, delay: 0.8 },
  { chars: "return 1100 && || 0101 => null 11", dur: 13, delay: 2.2 },
  { chars: "0xFF 1010 map() 0011 => yield 100", dur: 11, delay: 0.4 },
  { chars: "export 010 => Promise 1101 011 &&", dur: 14, delay: 1.1 },
  { chars: "type UI = 1010 => 0110 build 001", dur: 10.5, delay: 2.8 },
  { chars: "1001 => try {} catch 0110 throw 11", dur: 12.5, delay: 0.2 },
]

const BD_CSS = `
.bd-root { position: relative; min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.bd-root * { box-sizing: border-box; }
.bd-section { max-width: 1100px; margin: 0 auto; padding: clamp(56px, 10vw, 120px) 24px; position: relative; z-index: 2; }

/* Code rain */
.bd-rain { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; opacity: .12; }
.bd-rain-col { position: absolute; top: -40%; font-size: 13px; line-height: 1.9; color: var(--p); white-space: pre-wrap; width: 11%; word-break: break-all;
  writing-mode: vertical-rl; text-orientation: upright; letter-spacing: 2px; animation-name: bdRain; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes bdRain { from { transform: translateY(-60%);} to { transform: translateY(160%);} }

/* Nav */
.bd-nav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; max-width: 1100px; margin: 0 auto; padding: 18px 24px;
  background: color-mix(in srgb, var(--bg) 72%, transparent); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
.bd-logo { font-weight: 700; font-size: 18px; color: var(--p); }
.bd-nav-links { display: flex; gap: 22px; font-size: 13.5px; }
.bd-nav-links a { color: color-mix(in srgb, var(--tx) 65%, transparent); text-decoration: none; transition: color .2s; }
.bd-nav-links a:hover { color: var(--p); }
@media (max-width: 640px){ .bd-nav-links a { display:none;} }

/* Hero */
.bd-hero { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; padding: clamp(40px, 8vw, 90px) 24px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: center; }
@media (max-width: 900px){ .bd-hero { grid-template-columns: 1fr; } }
.bd-prompt { font-size: 14px; color: color-mix(in srgb, var(--tx) 55%, transparent); margin: 0 0 12px; }
.bd-dollar { color: #27c93f; margin-right: 8px; }
.bd-name { font-family: 'Space Grotesk', sans-serif; font-size: clamp(40px, 7vw, 76px); font-weight: 700; line-height: 1; margin: 0; letter-spacing: -0.02em;
  background: linear-gradient(120deg, var(--p), var(--s)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.bd-typing-line { margin: 18px 0 0; height: 1.5em; }
.bd-typing { display: inline-block; overflow: hidden; white-space: nowrap; border-right: .12em solid var(--p); font-size: clamp(15px, 2.4vw, 22px); font-weight: 500; color: color-mix(in srgb, var(--tx) 85%, transparent); max-width: 100%; }
@keyframes bdType { to { width: var(--ch); } }
@keyframes bdBlink { 50% { border-color: transparent; } }
.bd-about { margin: 22px 0 0; max-width: 460px; font-size: 15px; line-height: 1.7; color: color-mix(in srgb, var(--tx) 60%, transparent); }
.bd-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 30px; padding: 14px 26px; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none;
  background: var(--p); color: #fff; border: 1px solid transparent; transition: transform .25s, box-shadow .25s, background .25s; box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 60%, transparent); }
.bd-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px -6px color-mix(in srgb, var(--p) 70%, transparent), 0 0 20px color-mix(in srgb, var(--p) 40%, transparent); }
.bd-btn-ghost { background: transparent; color: var(--p); border-color: color-mix(in srgb, var(--p) 50%, transparent); }
.bd-cursor { animation: bdBlink 1s step-end infinite; }

/* Code window */
.bd-window { background: #05070d; border: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); border-radius: 12px; overflow: hidden; box-shadow: 0 30px 70px -30px #000, 0 0 40px -20px color-mix(in srgb, var(--p) 60%, transparent); }
.bd-window-bar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #0a0e17; border-bottom: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); }
.bd-dot { width: 12px; height: 12px; border-radius: 50%; }
.bd-window-title { margin-left: 10px; font-size: 12px; color: color-mix(in srgb, var(--tx) 45%, transparent); }
.bd-code { margin: 0; padding: 22px; font-size: 13.5px; line-height: 1.75; overflow-x: auto; color: #c9d1d9; }
.c-key { color: #ff7b72; } .c-var { color: #79c0ff; } .c-op { color: #ff7b72; } .c-prop { color: #7ee787; }
.c-str { color: #a5d6ff; } .c-bool { color: #ffa657; } .c-fn { color: #d2a8ff; }

/* Section headers */
.bd-h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 3.4vw, 34px); font-weight: 700; margin: 0 0 40px; letter-spacing: -0.01em; }

/* Experience */
.bd-exp-list { display: flex; flex-direction: column; gap: 16px; }
.bd-exp { border: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); border-left: 3px solid var(--p); border-radius: 10px; padding: 24px; background: color-mix(in srgb, var(--tx) 3%, transparent);
  transition: transform .3s, border-color .3s, box-shadow .3s; }
.bd-exp:hover { transform: translateX(6px); border-color: color-mix(in srgb, var(--p) 60%, transparent); box-shadow: -6px 0 30px -12px color-mix(in srgb, var(--p) 60%, transparent), 0 0 24px -14px color-mix(in srgb, var(--p) 50%, transparent); }
.bd-exp-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
.bd-exp-role { font-size: 19px; font-weight: 700; margin: 0; }
.bd-exp-at { color: color-mix(in srgb, var(--tx) 55%, transparent); font-size: 15px; }
.bd-exp-period { margin-left: auto; font-size: 12px; padding: 4px 12px; border-radius: 6px; background: color-mix(in srgb, var(--p) 15%, transparent); color: var(--p); font-weight: 600; }
.bd-exp-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.bd-exp-points li { display: flex; gap: 10px; font-size: 14.5px; line-height: 1.6; color: color-mix(in srgb, var(--tx) 68%, transparent); }
.bd-arrow { color: var(--p); }

/* Skills */
.bd-skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.bd-skill-card { padding: 24px; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--tx) 12%, transparent); background: color-mix(in srgb, var(--tx) 3%, transparent); transition: border-color .3s, box-shadow .3s; }
.bd-skill-card:hover { border-color: color-mix(in srgb, var(--s) 55%, transparent); box-shadow: 0 0 30px -16px color-mix(in srgb, var(--s) 70%, transparent); }
.bd-skill-title { font-size: 15px; font-weight: 600; color: var(--s); margin: 0 0 16px; padding-bottom: 12px; border-bottom: 1px dashed color-mix(in srgb, var(--tx) 15%, transparent); }
.bd-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.bd-tag { padding: 6px 12px; font-size: 13px; border-radius: 6px; background: color-mix(in srgb, var(--tx) 6%, transparent); border: 1px solid color-mix(in srgb, var(--tx) 10%, transparent); transition: transform .2s, background .2s, color .2s, border-color .2s; }
.bd-tag:hover { transform: translateY(-2px); background: var(--p); color: #fff; border-color: var(--p); }

/* Contact */
.bd-contact { text-align: center; }
.bd-contact-h { font-family: 'Space Grotesk'; font-size: clamp(32px, 6vw, 64px); font-weight: 700; margin: 0 0 16px; letter-spacing: -0.02em;
  background: linear-gradient(120deg, var(--p), var(--s)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.bd-contact-msg { max-width: 540px; margin: 0 auto 34px; font-size: 16px; line-height: 1.7; color: color-mix(in srgb, var(--tx) 62%, transparent); }
.bd-contact-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.bd-footer { position: relative; z-index: 2; text-align: center; padding: 32px; font-size: 13px; color: color-mix(in srgb, var(--tx) 35%, transparent); border-top: 1px solid color-mix(in srgb, var(--tx) 8%, transparent); }

/* Reveal engine */
.css-reveal { opacity: 0; animation-fill-mode: both; animation-duration: .8s; animation-timing-function: cubic-bezier(.22,1,.36,1); }
.css-reveal.is-visible.rv-up { animation-name: bdUp; }
.css-reveal.is-visible.rv-scale { animation-name: bdScale; }
@keyframes bdUp { from { opacity:0; transform: translateY(30px);} to { opacity:1; transform:none;} }
@keyframes bdScale { from { opacity:0; transform: scale(.92);} to { opacity:1; transform:none;} }

@media (prefers-reduced-motion: reduce) {
  .css-reveal, .bd-rain-col, .bd-cursor { animation: none !important; opacity: 1 !important; transform: none !important; }
  .bd-typing { width: var(--ch) !important; animation: none !important; border-right: none; }
  .bd-rain { display: none; }
}
`
