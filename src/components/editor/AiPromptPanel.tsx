"use client"

import { useState } from "react"
import { Sparkles, Send, Loader2, Undo2 } from "lucide-react"
import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface AiPromptPanelProps {
  content: WebsiteContent
  theme: TemplateTheme
  onApply: (content: WebsiteContent, theme: TemplateTheme) => void
  onUndo: () => void
  canUndo: boolean
}

// Ensures the AI returned a well-formed content object before we apply it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidContent(c: any): c is WebsiteContent {
  return (
    !!c &&
    typeof c === "object" &&
    !!c.hero &&
    !!c.about &&
    Array.isArray(c.experience) &&
    !!c.skills &&
    Array.isArray(c.skills.categories) &&
    !!c.contact
  )
}

export default function AiPromptPanel({ content, theme, onApply, onUndo, canUndo }: AiPromptPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePrompt = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)

    // Abort if the request stalls, so the panel can never get stuck loading forever.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)

    try {
      const res = await fetch("/api/ai-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, currentContent: content, themeSettings: theme }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error("Failed AI edit")
      const data = await res.json()

      // Guard against a malformed/partial AI response (e.g. a section removed but the
      // schema broken) — applying it would corrupt the content and crash the preview.
      if (!isValidContent(data.content) || !data.themeSettings) {
        throw new Error("Invalid response from AI")
      }
      onApply(data.content, data.themeSettings)
      setPrompt("")
    } catch (err) {
      console.error(err)
      if (err instanceof DOMException && err.name === "AbortError") {
        alert("The AI request timed out. Please try again — a simpler request may help.")
      } else {
        alert("Something went wrong processing your request. Please try again.")
      }
    } finally {
      clearTimeout(timeout)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-20 shrink-0 border-t border-border bg-gradient-to-b from-primary/[0.04] to-transparent p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          Edit with AI
        </h3>
        {canUndo && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-[0_0_14px_-1px_rgba(67,97,238,0.75)] transition-all hover:-translate-y-px hover:bg-primary-hover hover:shadow-[0_0_20px_1px_rgba(67,97,238,0.9)] [animation:pulse-ring_2.4s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          >
            <Undo2 className="h-3.5 w-3.5" /> Undo previous
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handlePrompt()
          }}
          placeholder="Describe a change… e.g., make my tagline sound more confident"
          className="h-24 w-full resize-none rounded-xl border border-border bg-background p-4 pr-12 text-sm font-medium text-foreground shadow-inner outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
          disabled={isLoading}
        />
        <button
          onClick={handlePrompt}
          disabled={isLoading || !prompt.trim()}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50"
          title="Send to AI (⌘/Ctrl + Enter)"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
