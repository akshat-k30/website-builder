"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Lock, Circle, Loader2, Check } from "lucide-react"
import { WebsiteContent } from "@/types/website"
import EditorSidebar from "@/components/editor/EditorSidebar"
import ErrorBoundary from "@/components/ErrorBoundary"
import LivePreview from "@/components/editor/LivePreview"
import EditPanel from "@/components/editor/EditPanel"
import AiPromptPanel from "@/components/editor/AiPromptPanel"
import { TemplateTheme, availableTemplates } from "@/lib/templates"

export type SectionType = "hero" | "about" | "experience" | "skills" | "contact" | "theme"

export default function EditorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState<WebsiteContent | null>(null)
  const [aiContent, setAiContent] = useState<WebsiteContent | null>(null)
  const [theme, setTheme] = useState<TemplateTheme | null>(null)
  const [templateId, setTemplateId] = useState<string>("modern-minimal")
  const [websiteStatus, setWebsiteStatus] = useState<string>("draft")
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  // AI Undo history
  const [history, setHistory] = useState<{ content: WebsiteContent; theme: TemplateTheme }[]>([])
  const [activeSection, setActiveSection] = useState<SectionType>("hero")

  // Auto-save: ensures the DB always matches the preview so Publish is never stale
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const hydrated = useRef(false)
  // Undo: coalesces rapid edits (e.g. typing) into a single history step
  const lastSnapshotAt = useRef(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/website")
        if (res.status === 404) {
          setIsLoading(false)
          return
        }
        if (!res.ok) {
          setIsLoading(false)
          return
        }
        const data = await res.json()

        setContent(data.content)
        setAiContent(data.aiContent)
        setTheme(data.themeSettings)
        if (data.templateId) setTemplateId(data.templateId)
        setWebsiteStatus(data.status || "draft")
        setPublishedUrl(data.publishedUrl || null)
      } catch (_err) {
        // Ignore network errors gracefully
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Debounced auto-save on any content/theme change (skips the initial hydration)
  useEffect(() => {
    if (!content || !theme) return
    if (!hydrated.current) {
      hydrated.current = true
      return
    }
    setSaveState("saving")
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/website", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, themeSettings: theme }),
        })
        if (!res.ok) throw new Error("Failed to auto-save")
        setSaveState("saved")
      } catch (err) {
        console.error(err)
        setSaveState("idle")
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [content, theme])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, themeSettings: theme }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setSaveState("saved")
    } catch (err) {
      console.error(err)
      setSaveState("idle")
      alert("Error saving.")
    } finally {
      setIsSaving(false)
    }
  }

  // Snapshot the current state onto the undo stack. `debounce` collapses rapid
  // edits (typing) into one step; capped at 50 entries.
  const pushSnapshot = (debounce: boolean) => {
    if (!content || !theme) return
    const now = Date.now()
    // Increased debounce time to 2500ms so slow typing is grouped into a single undo step
    if (debounce && now - lastSnapshotAt.current < 2500) return
    lastSnapshotAt.current = now
    setHistory((prev) => [...prev.slice(-49), { content, theme }])
  }

  const handleAiUpdate = (newContent: WebsiteContent, newTheme: TemplateTheme) => {
    pushSnapshot(false)
    setContent(newContent)
    setTheme(newTheme)
  }

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1]
      setContent(previousState.content)
      setTheme(previousState.theme)
      setHistory((prev) => prev.slice(0, -1))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateSection = (section: SectionType, data: any) => {
    pushSnapshot(true)
    if (section === "theme") {
      setTheme(data)
    } else {
      setContent((prev) => (prev ? { ...prev, [section]: data } : null))
    }
  }

  // Reset to AI original: restores the AI-generated text AND the selected
  // template's original colors/theme.
  const handleRevert = () => {
    if (!aiContent) return
    pushSnapshot(false)
    setContent(aiContent)
    const defaultTheme = availableTemplates.find((t) => t.id === templateId)?.defaultTheme
    if (defaultTheme) setTheme(defaultTheme)
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/website", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete website")
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Error deleting website.")
      setIsLoading(false)
    }
  }

  if (isLoading) return <EditorSkeleton />

  if (!content || !theme) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-3xl border border-border bg-card p-12 text-center shadow-[var(--shadow-xl)]"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">No website found</h2>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            You haven&apos;t generated your website yet. Upload your profile and generate content to get started.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/dashboard/linkedin")}
              className="w-full rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Start LinkedIn import
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-xl border border-border bg-card px-6 py-3.5 font-bold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              Return to dashboard
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const displayUrl = publishedUrl ? publishedUrl.replace(/^https?:\/\//, "") : "yoursite.profilio.app"

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <EditorSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onSave={handleSave}
        isSaving={isSaving}
        onRevert={aiContent ? handleRevert : undefined}
        onDelete={handleDelete}
        websiteStatus={websiteStatus}
        publishedUrl={publishedUrl}
      />

      {/* Center: Live Preview */}
      <div className="relative flex-1 overflow-y-auto bg-gradient-to-b from-muted/40 to-muted/10 p-6 lg:p-8">
        <div className="relative mx-auto min-h-[800px] w-full max-w-[1200px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-xl)]">
          {/* Browser chrome */}
          <div className="absolute inset-x-0 top-0 z-10 flex h-10 items-center gap-2 border-b border-border bg-muted/70 px-4 backdrop-blur">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <div className="mx-auto flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span className="font-mono">{displayUrl}</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground" aria-live="polite">
              {saveState === "saving" ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
              ) : saveState === "saved" ? (
                <><Check className="h-3 w-3 text-success" /> Saved</>
              ) : null}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                websiteStatus === "published" ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-600"
              }`}
            >
              {websiteStatus === "published" ? "Live" : "Draft"}
            </span>
          </div>
          <div className="h-full pt-10">
            <ErrorBoundary resetKey={content}>
              <LivePreview content={content} theme={theme} templateId={templateId} />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Editor (scrolls) + AI panel (pinned at bottom) */}
      <div className="flex w-[400px] shrink-0 flex-col border-l border-border bg-card shadow-[-8px_0_24px_-16px_rgba(17,24,39,0.2)]">
        <div className="min-h-0 flex-1 overflow-y-auto bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <EditPanel activeSection={activeSection} content={content} theme={theme} onUpdate={handleUpdateSection} />
            </motion.div>
          </AnimatePresence>
        </div>
        <AiPromptPanel content={content} theme={theme} onApply={handleAiUpdate} onUndo={handleUndo} canUndo={history.length > 0} />
      </div>
    </div>
  )
}

/* Three-panel loading skeleton */
function EditorSkeleton() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* left rail */}
      <div className="hidden w-64 shrink-0 flex-col gap-3 border-r border-border bg-card p-4 sm:flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 rounded-xl bg-muted/70 [animation:pulse_1.6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 90}ms` }} />
        ))}
        <div className="mt-auto h-11 rounded-xl bg-muted/70 [animation:pulse_1.6s_ease-in-out_infinite]" />
      </div>
      {/* center */}
      <div className="flex-1 p-8">
        <div className="mx-auto h-full max-w-[1200px] overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/60 px-4">
            <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="space-y-6 p-10">
            <div className="mx-auto h-10 w-2/3 rounded-lg bg-muted/70 [animation:pulse_1.6s_ease-in-out_infinite]" />
            <div className="mx-auto h-4 w-1/2 rounded bg-muted/60 [animation:pulse_1.6s_ease-in-out_infinite]" />
            <div className="grid grid-cols-3 gap-4 pt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-muted/60 [animation:pulse_1.6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="hidden w-[400px] shrink-0 flex-col gap-4 border-l border-border bg-card p-6 lg:flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-muted/70 [animation:pulse_1.6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 90}ms` }} />
        ))}
        <div className="flex items-center justify-center gap-2 pt-4 text-xs font-medium text-muted-foreground">
          <Circle className="h-3 w-3 animate-spin" /> Loading editor…
        </div>
      </div>
    </div>
  )
}
