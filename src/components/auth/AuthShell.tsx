"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Check } from "lucide-react"

interface AuthShellProps {
  eyebrow: string
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}

const PERKS = [
  "AI writes your portfolio copy in seconds",
  "Four designer templates, fully themeable",
  "Published as blazing-fast static sites",
]

export default function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-[calc(100dvh-64px)] items-stretch overflow-hidden bg-background">
      {/* Left: brand panel (desktop) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
        <div aria-hidden className="absolute inset-0 opacity-20 noise-overlay" />
        <div aria-hidden className="pointer-events-none absolute -left-10 top-10 h-72 w-72 rounded-full bg-white/25 blur-3xl [animation:aurora_16s_ease-in-out_infinite_alternate]" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/20 blur-3xl [animation:aurora_20s_ease-in-out_infinite_alternate]" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">WebsiteBuilder</span>
          </Link>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md font-[var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight"
            >
              Turn your LinkedIn into a site that gets noticed.
            </motion.h2>
            <ul className="mt-8 space-y-3">
              {PERKS.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/20">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {p}
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/70">Free to start — no credit card required.</p>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        {/* Ambient background for mobile / small screens */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 lg:hidden">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 shadow-[var(--shadow-xl)] sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
            <h1 className="mt-2 font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
