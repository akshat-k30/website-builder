"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { PartyPopper, ExternalLink, Copy, Check, Loader2, ArrowLeft } from "lucide-react"
import Confetti from "@/components/Confetti"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url") || ""
  const _subdomain = searchParams.get("subdomain") || ""
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!url) router.push("/dashboard")
  }, [url, router])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!url) return null

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-background px-6">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]" />
      </div>

      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-xl)]">
          <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-success/20 blur-3xl" />

          {/* Celebration icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
            className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-success to-accent text-white shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)]"
          >
            <PartyPopper className="h-9 w-9" />
          </motion.div>

          <h1 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground">
            Your website is live!
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Congratulations! Your site is published and accessible to anyone with the link.
          </p>

          {/* URL */}
          <div className="my-8 rounded-xl border-2 border-primary/20 bg-background p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Your website address</p>
            <a href={url} target="_blank" rel="noreferrer" className="break-all text-lg font-bold leading-relaxed text-primary hover:underline">
              {url}
            </a>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              <ExternalLink className="h-5 w-5" /> View your site
            </a>
            <button
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-4 text-base font-bold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              {copied ? <><Check className="h-5 w-5 text-success" /> <span className="text-success">Copied!</span></> : <><Copy className="h-5 w-5" /> Copy link</>}
            </button>
          </div>

          {/* Share */}
          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Share your website</p>
            <div className="flex items-center justify-center gap-3">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="rounded-lg bg-[#0077b5]/10 px-5 py-2.5 text-sm font-bold text-[#0077b5] transition-colors hover:bg-[#0077b5]/20">
                LinkedIn
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Check out my new website: ${url}`)}`} target="_blank" rel="noreferrer" className="rounded-lg bg-[#25d366]/10 px-5 py-2.5 text-sm font-bold text-[#25d366] transition-colors hover:bg-[#25d366]/20">
                WhatsApp
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Just published my personal website! 🚀")}`} target="_blank" rel="noreferrer" className="rounded-lg bg-foreground/10 px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-foreground/20">
                𝕏 / Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function PublishSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-background">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
