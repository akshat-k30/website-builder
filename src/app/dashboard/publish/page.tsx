"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export default function PublishPage() {
  const router = useRouter()
  const [subdomain, setSubdomain] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [availability, setAvailability] = useState<{
    available: boolean
    reason: string | null
  } | null>(null)

  // Current publish state
  const [currentStatus, setCurrentStatus] = useState<string>("draft")
  const [_currentSubdomain, setCurrentSubdomain] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [cloudfrontDomain, setCloudfrontDomain] = useState<string | null>(null)
  const [_userName, setUserName] = useState<string>("")

  // Load current website state
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

        // Pre-fill subdomain from current or from user's name
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

  // Debounced subdomain availability check
  const checkAvailability = useCallback(async (value: string) => {
    if (value.length < 3) {
      setAvailability(null)
      return
    }
    setIsChecking(true)
    try {
      const res = await fetch(
        `/api/publish/check?subdomain=${encodeURIComponent(value)}`
      )
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
      if (subdomain.length >= 3) {
        checkAvailability(subdomain)
      } else {
        setAvailability(null)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [subdomain, checkAvailability])

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 30)
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
      // Redirect to success page with URL info
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
    if (!confirm("Are you sure you want to unpublish your website? The URL will stop working and visitors will see a \"not found\" page.")) return
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

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-73px)] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground font-medium">Loading publish settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push("/dashboard/editor")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Editor
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Publish Your Website</h1>
          <p className="text-muted-foreground text-sm">
            Choose your website address and go live in seconds.
          </p>
        </div>

        {/* Already Published Banner */}
        {currentStatus === "published" && currentUrl && (
          <div className="mb-8 p-5 rounded-2xl border-2 border-green-500/30 bg-green-500/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground mb-1">Your website is live!</h3>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary font-semibold hover:underline break-all"
                >
                  {currentUrl}
                </a>
                <div className="flex items-center gap-3 mt-4">
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                  >
                    View Site ↗
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentUrl!)
                      alert("URL copied to clipboard!")
                    }}
                    className="px-4 py-2 bg-card border border-border text-sm font-bold rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={handleUnpublish}
                    disabled={isUnpublishing}
                    className="px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                  >
                    {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subdomain Input Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-foreground mb-1">
            {currentStatus === "published" ? "Change Your Address" : "Choose Your Website Address"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            This will be the URL where people can visit your website.
          </p>

          {/* URL Preview + Input */}
          <div className="rounded-xl border-2 border-border focus-within:border-primary/50 bg-background transition-colors overflow-hidden">
            <div className="flex items-center">
              <span className="px-4 py-4 text-sm text-muted-foreground font-mono bg-muted/50 border-r border-border whitespace-nowrap select-none">
                {cloudfrontDomain ? `${cloudfrontDomain}/` : `${baseUrl}/sites/`}
              </span>
              <input
                type="text"
                value={subdomain}
                onChange={handleSubdomainChange}
                placeholder="your-name"
                className="flex-1 px-4 py-4 text-base font-mono font-semibold text-foreground bg-transparent outline-none placeholder:text-muted-foreground/50"
                maxLength={30}
              />
              {/* Status indicator */}
              <div className="pr-4 shrink-0">
                {isChecking && (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                )}
                {!isChecking && availability?.available && (
                  <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {!isChecking && availability && !availability.available && (
                  <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Availability message */}
          <div className="mt-3 h-5">
            {!isChecking && availability?.available && (
              <p className="text-sm font-semibold text-green-600 flex items-center gap-1.5">
                <span>✓</span> This address is available!
              </p>
            )}
            {!isChecking && availability && !availability.available && (
              <p className="text-sm font-semibold text-red-500 flex items-center gap-1.5">
                <span>✕</span> {availability.reason || "This address is not available."}
              </p>
            )}
            {subdomain.length > 0 && subdomain.length < 3 && (
              <p className="text-sm text-muted-foreground">
                Minimum 3 characters required.
              </p>
            )}
          </div>
        </div>

        {/* Pre-publish Checklist */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span>📋</span> Before you publish
          </h2>
          <div className="space-y-3">
            {[
              "Your hero section headline looks good",
              "Contact information is correct",
              "All experience entries are accurate",
              "Skills are up to date",
              "You've reviewed the live preview in the editor",
            ].map((item, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-2 border-border text-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          disabled={isPublishing || !availability?.available || subdomain.length < 3}
          className="w-full py-4.5 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.99] flex items-center justify-center gap-3"
        >
          {isPublishing ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Publishing your site...
            </>
          ) : currentStatus === "published" ? (
            <>
              🔄 Republish with Latest Changes
            </>
          ) : (
            <>
              🚀 Publish Now
            </>
          )}
        </button>

        {currentStatus !== "published" && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            You can always change the address or unpublish later.
          </p>
        )}
      </div>
    </div>
  )
}
