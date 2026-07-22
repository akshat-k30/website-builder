"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import InteractiveHero from "./InteractiveHero"
import {
  Sparkles,
  Wand2,
  Upload,
  Palette,
  Rocket,
  Globe,
  Gauge,
  ShieldCheck,
  LayoutTemplate,
  ArrowRight,
  ArrowUpRight,
  Check,
  Zap,
  Mail,
} from "lucide-react"

/* ---------------------------------------------------------------- */
/*  Motion helpers                                                  */
/* ---------------------------------------------------------------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------------------------------------------------------------- */
/*  Data                                                            */
/* ---------------------------------------------------------------- */
const FEATURES = [
  {
    icon: Wand2,
    title: "AI writes your copy",
    desc: "Paste a LinkedIn URL and our AI drafts a polished hero, about, experience and skills section in seconds.",
    span: "lg:col-span-2",
  },
  { icon: LayoutTemplate, title: "Designer templates", desc: "Four hand-crafted, award-worthy layouts — from minimal to bold." },
  { icon: Palette, title: "Live theming", desc: "Recolor everything instantly with dynamic theme tokens." },
  { icon: Gauge, title: "Blazing fast", desc: "Published as pure static HTML on CloudFront. No JS runtime, perfect Lighthouse scores.", span: "lg:col-span-2" },
  { icon: ShieldCheck, title: "Yours forever", desc: "Custom subdomain, SSL, and a site you fully own." },
]

const STEPS = [
  { icon: Upload, step: "01", title: "Import LinkedIn", desc: "Drop your profile URL or PDF. We parse your entire career instantly." },
  { icon: Sparkles, step: "02", title: "Generate & edit", desc: "AI drafts every section. Refine copy and colors in a live editor." },
  { icon: Rocket, step: "03", title: "Publish live", desc: "One click ships your site to a global CDN with your own subdomain." },
]

const TEMPLATES = [
  { name: "Aurora", tag: "Vibrant · Gradient · Glass", grad: "from-violet-500 via-fuchsia-500 to-pink-500" },
  { name: "Noir Luxe", tag: "Dark · Editorial · Gold", grad: "from-neutral-900 via-stone-800 to-amber-600" },
  { name: "Modern Minimal", tag: "Clean · Glass · Gradient", grad: "from-indigo-500 via-violet-500 to-cyan-400" },
  { name: "Bold Developer", tag: "Dark · Terminal · Neon", grad: "from-slate-800 via-slate-900 to-emerald-500" },
  { name: "Creative Portfolio", tag: "Editorial · Serif · Elegant", grad: "from-rose-400 via-fuchsia-500 to-indigo-500" },
  { name: "Executive Pro", tag: "Corporate · Timeline · Trust", grad: "from-blue-600 via-sky-500 to-teal-400" },
]

const CAPABILITIES = [
  { icon: Wand2, label: "AI-assisted copy", sub: "Drafted from your profile" },
  { icon: LayoutTemplate, label: "Designer templates", sub: "Fully themeable" },
  { icon: Gauge, label: "Static & fast", sub: "No JS runtime" },
  { icon: Globe, label: "Your own subdomain", sub: "With SSL" },
]

/* ---------------------------------------------------------------- */
/*  Page                                                            */
/* ---------------------------------------------------------------- */
export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* ============================= HERO ============================= */}
      <section className="relative isolate flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center px-6 pb-24 pt-16 text-center">
        {/* Interactive, mouse-reactive background */}
        <InteractiveHero />
        {/* Noise texture */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] noise-overlay" />

        <motion.div variants={stagger} initial="hidden" animate="show" className="mx-auto max-w-4xl">
          <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            AI-powered portfolios in minutes
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-balance font-[var(--font-display)] text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Your LinkedIn becomes a{" "}
            <span className="text-gradient-animated">stunning website</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Paste your profile, let AI craft the content, pick a designer template, and publish a
            lightning-fast portfolio — all in under an hour. No code required.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover active:translate-y-0"
            >
              <span className="relative z-10">Get started free</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 shimmer" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 px-7 py-4 text-base font-bold text-foreground backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No code required</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free to start</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Published in minutes</span>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/40 p-1.5">
            <div className="h-2 w-1 rounded-full bg-muted-foreground/60 [animation:float_1.6s_ease-in-out_infinite]" />
          </div>
        </motion.div>
      </section>

      {/* ============================= CAPABILITY STRIP ============================= */}
      <section className="border-y border-border/60 bg-card/40 backdrop-blur">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4"
        >
          {CAPABILITIES.map((c) => (
            <motion.div key={c.label} variants={fadeUp} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <div className="text-sm font-bold text-foreground">{c.label}</div>
              <div className="text-xs text-muted-foreground">{c.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================= FEATURES ============================= */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Everything included</span>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            A portfolio that looks{" "}
            <span className="text-gradient">expensive</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every detail is handled — from the words to the pixels to the hosting.
          </p>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className={`card-glow group p-7 ${f.span ?? ""}`}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================= HOW IT WORKS ============================= */}
      <section className="relative overflow-hidden py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-60" />
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">How it works</span>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Three steps to live
            </h2>
          </Reveal>

          <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Connecting line */}
            <div aria-hidden className="absolute left-0 top-8 hidden h-px w-full bg-gradient-to-r from-transparent via-border to-transparent md:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.12} className="relative text-center">
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-[var(--shadow-md)]">
                  <s.icon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= TEMPLATES ============================= */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Templates</span>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Pick your vibe
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four distinct, professionally designed looks. Switch anytime.
          </p>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {TEMPLATES.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]"
            >
              <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${t.grad}`}>
                <div className="absolute inset-0 opacity-30 noise-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-48 rounded-lg bg-white/15 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.tag}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================= FINAL CTA ============================= */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent px-8 py-16 text-center shadow-[var(--shadow-xl)] sm:px-16">
            <div aria-hidden className="absolute inset-0 opacity-20 noise-overlay" />
            <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 h-60 w-60 rounded-full bg-white/20 blur-3xl [animation:float_8s_ease-in-out_infinite]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-white/20 blur-3xl [animation:float_10s_ease-in-out_infinite]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Your best portfolio is one paste away
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/85">
                Turn your experience into a site you&apos;re proud to share.
              </p>
              <Link
                href="/signup"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Build mine free
                <Zap className="h-5 w-5" />
              </Link>
              <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/75">
                <Check className="h-4 w-4" /> No credit card required
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================= FOOTER ============================= */}
      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/profilio-icon-indigo.svg" alt="Profilio" className="h-8 w-8 rounded-lg" />
            Profilio
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Profilio. Built for makers.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="mailto:hello@example.com" className="transition-colors hover:text-primary" aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
            <Link href="/login" className="text-sm font-semibold transition-colors hover:text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
