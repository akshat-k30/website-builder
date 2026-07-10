"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url") || ""
  const _subdomain = searchParams.get("subdomain") || ""
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  // Redirect to dashboard if no URL param — do this in useEffect, not during render
  useEffect(() => {
    if (!url) {
      router.push("/dashboard")
    }
  }, [url, router])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
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

  // If no url param, show nothing while the useEffect redirect fires
  if (!url) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] animate-pulse"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.05] animate-pulse"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)", animationDelay: "1s" }}
        ></div>
      </div>

      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => {
            const CONFETTI_COLORS = ["#4361ee", "#f72585", "#4cc9f0", "#7209b7", "#f77f00", "#06d6a0"]
            return (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${(i * 37 + 13) % 100}%`,
                  top: `-${(i * 7 + 5) % 20 + 5}%`,
                  animationDuration: `${(i % 3) + 2}s`,
                  animationDelay: `${(i % 10) * 0.1}s`,
                  opacity: ((i * 3) % 7 + 3) / 10,
                }}
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    transform: `rotate(${(i * 47) % 360}deg)`,
                  }}
                ></div>
              </div>
            )
          })}
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg">
        {/* Success Card */}
        <div className="bg-card rounded-3xl border border-border shadow-xl p-10 text-center">
          {/* Celebration Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-4xl">🎉</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">
            Your Website is Live!
          </h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            Congratulations! Your personal website has been published and is now accessible to anyone with the link.
          </p>

          {/* URL Display */}
          <div className="bg-background rounded-xl border-2 border-primary/20 p-4 mb-6">
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Your website address</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-bold text-lg hover:underline break-all leading-relaxed"
            >
              {url}
            </a>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 bg-primary text-primary-foreground font-bold text-base rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Your Site
            </a>

            <button
              onClick={handleCopy}
              className="w-full py-4 bg-card border-2 border-border text-foreground font-bold text-base rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>

          {/* Share Section */}
          <div className="border-t border-border pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Share your website</p>
            <div className="flex items-center justify-center gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#0077b5]/10 text-[#0077b5] text-sm font-bold rounded-lg hover:bg-[#0077b5]/20 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my new website: ${url}`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#25d366]/10 text-[#25d366] text-sm font-bold rounded-lg hover:bg-[#25d366]/20 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Just published my personal website! 🚀")}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-foreground/10 text-foreground text-sm font-bold rounded-lg hover:bg-foreground/20 transition-colors"
              >
                𝕏 / Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PublishSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-73px)] items-center justify-center bg-background">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
