"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  Check,
  X,
  ExternalLink,
  Copy,
  Rocket,
  RefreshCw,
  CircleCheck,
} from "lucide-react"

export default function PublishPage() {
  const router = useRouter()
  const [subdomain, setSubdomain] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [availability, setAvailability] = useState<{ available: boolean; reason: string | null } | null>(null)

  const [currentStatus, setCurrentStatus] = useState<string>("draft")
  const [_currentSubdomain, setCurrentSubdomain] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [cloudfrontDomain, setCloudfrontDomain] = useState<string | null>(null)
  const [_userName, setUserName] = useState<string>("")

  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch("/api/website")
        if (!res.ok) {
          router.push("/dashboard")
          return
        }
        const data = await res.json()
        setCurrentStatus(data.status)
        setCurrentSubdomain(data.subdomain)
        setCurrentUrl(data.publishedUrl)
        setCloudfrontDomain(data.cloudfrontDomain)

        if (data.subdomain) {
          setSubdomain(data.subdomain)
        } else if (data.content?.hero?.name) {
          const suggested = data.content.hero.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 30)
          setSubdomain(suggested)
          setUserName(data.content.hero.name)
        }
      } catch {
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }
    fetchState()
  }, [router])

  const checkAvailability = useCallback(async (value: string) => {
    if (value.length < 3) {
      setAvailability(null)
      return
    }
    setIsChecking(true)
    try {
      const res = await fetch(`/api/publish/check?subdomain=${encodeURIComponent(value)}`)
      const data = await res.json()
      setAvailability(data)
    } catch {
      setAvailability(null)
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (subdomain.length >= 3) checkAvailability(subdomain)
      else setAvailability(null)
    }, 400)
    return () => clearTimeout(timer)
  }, [subdomain, checkAvailability])

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 30)
    setSubdomain(value)
  }

  const handlePublish = async () => {
    if (!subdomain || !availability?.available) return
    setIsPublishing(true)
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to publish")
        return
      }
      router.push(
        `/dashboard/publish/success?url=${encodeURIComponent(data.publishedUrl)}&subdomain=${encodeURIComponent(data.subdomain)}`
      )
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    if (!confirm('Are you sure you want to unpublish your website? The URL will stop working and visitors will see a "not found" page.')) return
    setIsUnpublishing(true)
    try {
      const res = await fetch("/api/publish", { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Failed to unpublish")
        return
      }
      setCurrentStatus("draft")
      setCurrentSubdomain(null)
      setCurrentUrl(null)
    } catch {
      alert("Something went wrong.")
    } finally {
      setIsUnpublishing(false)
    }
  }

  const handleCopy = () => {
    if (!currentUrl) return
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading publish settings…</p>
        </div>
      </div>
    )
  }

  const canPublish = !!availability?.available && subdomain.length >= 3

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-72 bg-grid bg-grid-fade opacity-50" />

      <div className="relative mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push("/dashboard/editor")}
            className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to editor
          </button>
          <h1 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground">
            Publish your website
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Choose your address and go live in seconds.</p>
        </div>

        {/* Live banner (glow) */}
        {currentStatus === "published" && currentUrl && (
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-success/30 bg-success/5 p-5 shadow-[0_0_40px_-12px_rgba(16,185,129,0.4)]">
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-success/20 blur-2xl [animation:aurora_10s_ease-in-out_infinite_alternate]" />
            <div className="relative flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-success/15 text-success">
                <CircleCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-foreground">Your website is live!</h3>
                <a href={currentUrl} target="_blank" rel="noreferrer" className="break-all text-sm font-semibold text-primary hover:underline">
                  {currentUrl}
                </a>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    <ExternalLink className="h-4 w-4" /> View site
                  </a>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={handleUnpublish}
                    disabled={isUnpublishing}
                    className="ml-auto rounded-lg px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {isUnpublishing ? "Unpublishing…" : "Unpublish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subdomain card */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-md)]">
          <h2 className="text-lg font-bold text-foreground">
            {currentStatus === "published" ? "Change your address" : "Choose your website address"}
          </h2>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">This will be the URL where people visit your website.</p>

          <div className="overflow-hidden rounded-xl border-2 border-border bg-background transition-colors focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
            <div className="flex items-center">
              <span className="select-none whitespace-nowrap border-r border-border bg-muted/50 px-4 py-4 font-mono text-sm text-muted-foreground">
                {cloudfrontDomain ? `${cloudfrontDomain}/` : `${baseUrl}/sites/`}
              </span>
              <input
                type="text"
                value={subdomain}
                onChange={handleSubdomainChange}
                placeholder="your-name"
                maxLength={30}
                className="flex-1 bg-transparent px-4 py-4 font-mono text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
              />
              <div className="shrink-0 pr-4">
                {isChecking && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                {!isChecking && availability?.available && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {!isChecking && availability && !availability.available && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 text-red-500">
                    <X className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 h-5 text-sm font-semibold">
            {!isChecking && availability?.available && (
              <p className="flex items-center gap-1.5 text-success"><Check className="h-4 w-4" /> This address is available!</p>
            )}
            {!isChecking && availability && !availability.available && (
              <p className="flex items-center gap-1.5 text-red-500"><X className="h-4 w-4" /> {availability.reason || "This address is not available."}</p>
            )}
            {subdomain.length > 0 && subdomain.length < 3 && (
              <p className="font-normal text-muted-foreground">Minimum 3 characters required.</p>
            )}
          </div>
        </div>

        {/* Publish button + progress */}
        <button
          onClick={handlePublish}
          disabled={isPublishing || !canPublish}
          className="relative w-full overflow-hidden rounded-2xl bg-primary py-5 text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            {isPublishing ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Publishing your site…</>
            ) : currentStatus === "published" ? (
              <><RefreshCw className="h-5 w-5" /> Republish with latest changes</>
            ) : (
              <><Rocket className="h-5 w-5" /> Publish now</>
            )}
          </span>
          {/* Indeterminate progress sweep while publishing */}
          {isPublishing && (
            <span aria-hidden className="absolute bottom-0 left-0 h-1 w-1/4 bg-white/70 [animation:progress-indeterminate_1.2s_ease-in-out_infinite]" />
          )}
        </button>

        {currentStatus !== "published" && (
          <p className="mt-4 text-center text-xs text-muted-foreground">You can always change the address or unpublish later.</p>
        )}
      </div>
    </div>
  )
}
