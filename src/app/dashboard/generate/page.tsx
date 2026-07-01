"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { WebsiteContent } from "@/types/website"

type PageStatus = "loading" | "empty" | "generating" | "ready" | "error"

export default function GenerateContentPage() {
  const [content, setContent] = useState<WebsiteContent | null>(null)
  const [status, setStatus] = useState<PageStatus>("loading")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/generate-content")
      if (res.status === 404) {
        setStatus("empty")
        return
      }
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setContent(data.content)
      setStatus("ready")
    } catch {
      setStatus("empty")
    }
  }

  const handleGenerate = async () => {
    setStatus("generating")
    setError("")

    try {
      const res = await fetch("/api/generate-content", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setContent(data.content)
      setStatus("ready")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStatus("error")
    }
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch("/api/generate-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error("Failed to save")
      
      // Redirect to choose templates
      router.push("/dashboard/templates")
    } catch {
      setError("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    })
  }

  const updateAbout = (value: string) => {
    if (!content) return
    setContent({
      ...content,
      about: { ...content.about, content: value },
    })
  }

  const updateExperienceHighlight = (
    expIdx: number,
    hlIdx: number,
    value: string
  ) => {
    if (!content) return
    const updated = [...content.experience]
    const highlights = [...updated[expIdx].highlights]
    highlights[hlIdx] = value
    updated[expIdx] = { ...updated[expIdx], highlights }
    setContent({ ...content, experience: updated })
  }

  const updateContact = (field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      contact: { ...content.contact, [field]: value },
    })
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-background py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-border rounded w-1/3" />
            <div className="h-48 bg-card rounded-2xl border border-border" />
            <div className="h-32 bg-card rounded-2xl border border-border" />
          </div>
        </div>
      </div>
    )
  }

  // Empty state — no content yet
  if (status === "empty" || status === "error") {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-background flex flex-col items-center justify-center py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors"
          >
            ← Back to Dashboard
          </Link>

          <div className="bg-card p-10 rounded-3xl shadow-xl border border-border">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Generate Website Content</h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Our AI will transform your LinkedIn profile into polished, professional website copy — ready to publish.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-left">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="w-full px-8 py-3.5 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
            >
              Generate with AI
            </button>
            <p className="text-xs font-medium text-muted-foreground mt-4">
              Takes about 10 seconds
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Generating state
  if (status === "generating") {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-background flex flex-col items-center justify-center py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-card p-12 rounded-3xl shadow-xl border border-border flex flex-col items-center">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Crafting your content...</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Analyzing your LinkedIn profile and writing professional website copy.
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Ready state — show generated content
  if (!content) return null

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Review Content</h1>
            <p className="text-muted-foreground text-sm">
              Click any section to edit manually, or save to pick a template.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="text-sm font-semibold px-4 py-2.5 rounded-lg border border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors shadow-sm"
          >
            Regenerate AI
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Hero Section Preview */}
        <section
          className={`mb-6 rounded-2xl overflow-hidden cursor-pointer bg-card border transition-all duration-200 shadow-sm ${
            editingSection === "hero"
              ? "border-primary ring-1 ring-primary"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => setEditingSection(editingSection === "hero" ? null : "hero")}
        >
          <div className="p-10 text-center">
            {editingSection === "hero" ? (
              <div className="space-y-4 max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-left">Name</label>
                  <input
                    type="text"
                    value={content.hero.name}
                    onChange={(e) => updateHero("name", e.target.value)}
                    className="w-full text-center text-3xl font-bold bg-background border border-border rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-left">Tagline</label>
                  <input
                    type="text"
                    value={content.hero.tagline}
                    onChange={(e) => updateHero("tagline", e.target.value)}
                    className="w-full text-center text-lg bg-background border border-border rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-left">Button Text</label>
                  <input
                    type="text"
                    value={content.hero.ctaText}
                    onChange={(e) => updateHero("ctaText", e.target.value)}
                    className="w-full text-center text-sm bg-background border border-border rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-foreground mb-3">{content.hero.name}</h2>
                <p className="text-lg text-muted-foreground mb-8 font-medium">{content.hero.tagline}</p>
                <span className="inline-block px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/20">
                  {content.hero.ctaText}
                </span>
              </>
            )}
          </div>
          <div className="bg-muted px-6 py-3 flex items-center justify-between border-t border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hero Section</span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Click to {editingSection === "hero" ? "close" : "edit"}</span>
          </div>
        </section>

        {/* About Section Preview */}
        <section
          className={`mb-6 rounded-2xl overflow-hidden cursor-pointer bg-card border transition-all duration-200 shadow-sm ${
            editingSection === "about"
              ? "border-primary ring-1 ring-primary"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => setEditingSection(editingSection === "about" ? null : "about")}
        >
          <div className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">{content.about.title}</h3>
            {editingSection === "about" ? (
              <div onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={content.about.content}
                  onChange={(e) => updateAbout(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y transition-colors leading-relaxed"
                />
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                {content.about.content}
              </p>
            )}
          </div>
          <div className="bg-muted px-6 py-3 flex items-center justify-between border-t border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">About Section</span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Click to {editingSection === "about" ? "close" : "edit"}</span>
          </div>
        </section>

        {/* Experience Section Preview */}
        <section
          className={`mb-6 rounded-2xl overflow-hidden cursor-pointer bg-card border transition-all duration-200 shadow-sm ${
            editingSection === "experience"
              ? "border-primary ring-1 ring-primary"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => setEditingSection(editingSection === "experience" ? null : "experience")}
        >
          <div className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-8">Experience</h3>
            <div className="space-y-8">
              {content.experience.map((exp, i) => (
                <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-border last:before:bottom-auto last:before:h-full">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-primary ring-4 ring-card"></div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-foreground">{exp.role}</h4>
                      <p className="text-sm font-medium text-primary">{exp.company}</p>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded ml-4 whitespace-nowrap">{exp.period}</span>
                  </div>
                  {editingSection === "experience" ? (
                    <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
                      {exp.highlights.map((hl, j) => (
                        <input
                          key={j}
                          type="text"
                          value={hl}
                          onChange={(e) =>
                            updateExperienceHighlight(i, j, e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2 mt-3">
                      {exp.highlights.map((hl, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex gap-3">
                          <span className="text-primary/50 mt-1">•</span>
                          <span className="leading-relaxed">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted px-6 py-3 flex items-center justify-between border-t border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Experience Section</span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Click to {editingSection === "experience" ? "close" : "edit"}</span>
          </div>
        </section>

        {/* Skills Section Preview */}
        <section
          className="mb-6 rounded-2xl overflow-hidden bg-card border border-border shadow-sm"
        >
          <div className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Skills</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {content.skills.categories.map((cat, i) => (
                <div key={i} className="bg-background rounded-xl p-5 border border-border">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                    {cat.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((skill, j) => (
                      <span
                        key={j}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border text-foreground shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted px-6 py-3 flex items-center justify-between border-t border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skills Section</span>
          </div>
        </section>

        {/* Contact Section Preview */}
        <section
          className={`mb-6 rounded-2xl overflow-hidden cursor-pointer bg-card border transition-all duration-200 shadow-sm ${
            editingSection === "contact"
              ? "border-primary ring-1 ring-primary"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => setEditingSection(editingSection === "contact" ? null : "contact")}
        >
          <div className="p-8 text-center max-w-lg mx-auto">
            {editingSection === "contact" ? (
              <div className="space-y-4 text-left" onClick={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Heading</label>
                  <input
                    type="text"
                    value={content.contact.heading}
                    onChange={(e) => updateContact("heading", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    value={content.contact.message}
                    onChange={(e) => updateContact("message", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground mb-3">{content.contact.heading}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {content.contact.message}
                </p>
                {content.contact.email && (
                  <div className="inline-block px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground mb-2">
                    {content.contact.email}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="bg-muted px-6 py-3 flex items-center justify-between border-t border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Section</span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Click to {editingSection === "contact" ? "close" : "edit"}</span>
          </div>
        </section>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/dashboard/linkedin/review"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              ← Edit Profile Data
            </Link>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className={`
                px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md
                ${saving
                  ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover shadow-primary/25 active:scale-[0.98]"
                }
              `}
            >
              {saving ? "Saving..." : "Save & Choose Template →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
