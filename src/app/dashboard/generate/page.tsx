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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    )
  }

  // Empty state — no content yet
  if (status === "empty" || status === "error") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-12"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Generate Website Content</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
            Our AI will transform your LinkedIn profile into polished, professional website copy — ready to publish.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-left max-w-md mx-auto">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
          id="btn-generate"
        >
          ✨ Generate with AI
        </button>

        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4">
          Powered by Google Gemini · Takes about 10 seconds
        </p>
      </div>
    )
  }

  // Generating state
  if (status === "generating") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Generating your website content...</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            AI is crafting professional copy from your LinkedIn profile. This takes about 10 seconds.
          </p>
        </div>
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Ready state — show generated content
  if (!content) return null

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Website Content</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Click any section to edit. Changes are saved when you click &quot;Save Edits&quot;.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
          id="btn-regenerate"
        >
          🔄 Regenerate
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Hero Section Preview */}
      <section
        className={`mb-6 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
          editingSection === "hero"
            ? "ring-2 ring-violet-500"
            : "hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600"
        }`}
        onClick={() => setEditingSection(editingSection === "hero" ? null : "hero")}
      >
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 text-white p-10 text-center">
          {editingSection === "hero" ? (
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              <label className="block text-xs text-zinc-400 uppercase tracking-wide">Name</label>
              <input
                type="text"
                value={content.hero.name}
                onChange={(e) => updateHero("name", e.target.value)}
                className="w-full text-center text-3xl font-bold bg-transparent border-b border-zinc-600 focus:border-violet-400 outline-none pb-1"
              />
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mt-4">Tagline</label>
              <input
                type="text"
                value={content.hero.tagline}
                onChange={(e) => updateHero("tagline", e.target.value)}
                className="w-full text-center text-lg bg-transparent border-b border-zinc-600 focus:border-violet-400 outline-none pb-1 text-zinc-300"
              />
              <label className="block text-xs text-zinc-400 uppercase tracking-wide mt-4">Button Text</label>
              <input
                type="text"
                value={content.hero.ctaText}
                onChange={(e) => updateHero("ctaText", e.target.value)}
                className="w-full text-center text-sm bg-transparent border-b border-zinc-600 focus:border-violet-400 outline-none pb-1 text-zinc-300"
              />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-3">{content.hero.name}</h2>
              <p className="text-lg text-zinc-300 mb-6">{content.hero.tagline}</p>
              <span className="inline-block px-6 py-2.5 rounded-lg bg-white text-zinc-900 font-semibold text-sm">
                {content.hero.ctaText}
              </span>
            </>
          )}
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">HERO SECTION</span>
          <span className="text-xs text-zinc-400">Click to {editingSection === "hero" ? "close" : "edit"}</span>
        </div>
      </section>

      {/* About Section Preview */}
      <section
        className={`mb-6 rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 ${
          editingSection === "about"
            ? "ring-2 ring-violet-500 border-transparent"
            : "border-zinc-200 dark:border-zinc-800 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600"
        }`}
        onClick={() => setEditingSection(editingSection === "about" ? null : "about")}
      >
        <div className="p-8">
          <h3 className="text-xl font-bold mb-4">{content.about.title}</h3>
          {editingSection === "about" ? (
            <div onClick={(e) => e.stopPropagation()}>
              <textarea
                value={content.about.content}
                onChange={(e) => updateAbout(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-y"
              />
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {content.about.content}
            </p>
          )}
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">ABOUT SECTION</span>
          <span className="text-xs text-zinc-400">Click to {editingSection === "about" ? "close" : "edit"}</span>
        </div>
      </section>

      {/* Experience Section Preview */}
      <section
        className={`mb-6 rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 ${
          editingSection === "experience"
            ? "ring-2 ring-violet-500 border-transparent"
            : "border-zinc-200 dark:border-zinc-800 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600"
        }`}
        onClick={() => setEditingSection(editingSection === "experience" ? null : "experience")}
      >
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6">Experience</h3>
          <div className="space-y-6">
            {content.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-5">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{exp.role}</h4>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap ml-4">{exp.period}</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{exp.company}</p>
                {editingSection === "experience" ? (
                  <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                    {exp.highlights.map((hl, j) => (
                      <input
                        key={j}
                        type="text"
                        value={hl}
                        onChange={(e) =>
                          updateExperienceHighlight(i, j, e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {exp.highlights.map((hl, j) => (
                      <li key={j} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2">
                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                        {hl}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">EXPERIENCE SECTION</span>
          <span className="text-xs text-zinc-400">Click to {editingSection === "experience" ? "close" : "edit"}</span>
        </div>
      </section>

      {/* Skills Section Preview */}
      <section
        className={`mb-6 rounded-xl border overflow-hidden transition-all duration-200 ${
          editingSection === "skills"
            ? "ring-2 ring-violet-500 border-transparent"
            : "border-zinc-200 dark:border-zinc-800 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600"
        }`}
      >
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6">Skills</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.skills.categories.map((cat, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                  {cat.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, j) => (
                    <span
                      key={j}
                      className="px-3 py-1.5 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">SKILLS SECTION</span>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section
        className={`mb-6 rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 ${
          editingSection === "contact"
            ? "ring-2 ring-violet-500 border-transparent"
            : "border-zinc-200 dark:border-zinc-800 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600"
        }`}
        onClick={() => setEditingSection(editingSection === "contact" ? null : "contact")}
      >
        <div className="p-8 text-center">
          {editingSection === "contact" ? (
            <div className="space-y-3 text-left" onClick={(e) => e.stopPropagation()}>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Heading</label>
                <input
                  type="text"
                  value={content.contact.heading}
                  onChange={(e) => updateContact("heading", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Message</label>
                <textarea
                  value={content.contact.message}
                  onChange={(e) => updateContact("message", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Email</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-3">{content.contact.heading}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                {content.contact.message}
              </p>
              {content.contact.email && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">{content.contact.email}</p>
              )}
              {content.contact.linkedin && (
                <p className="text-sm text-blue-600 dark:text-blue-400">{content.contact.linkedin}</p>
              )}
            </>
          )}
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">CONTACT SECTION</span>
          <span className="text-xs text-zinc-400">Click to {editingSection === "contact" ? "close" : "edit"}</span>
        </div>
      </section>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 -mx-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`
              px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
              ${saving
                ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              }
            `}
            id="btn-save-edits"
          >
            {saving ? "Saving..." : "Save & Choose Template →"}
          </button>
        </div>

        <Link
          href="/dashboard/linkedin/review"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← Edit Profile Data
        </Link>
      </div>
    </div>
  )
}
