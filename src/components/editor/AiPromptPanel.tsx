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

const SUGGESTIONS = ["Make my tagline more professional", "Rewrite the about section", "Switch to a dark color scheme"]

export default function AiPromptPanel({ content, theme, onApply, onUndo, canUndo }: AiPromptPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePrompt = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/ai-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, currentContent: content, themeSettings: theme }),
      })
      if (!res.ok) throw new Error("Failed AI edit")
      const data = await res.json()
      if (data.content && data.themeSettings) {
        onApply(data.content, data.themeSettings)
        setPrompt("")
      } else {
        throw new Error("Invalid response from AI")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong processing your request.")
    } finally {
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
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Undo2 className="h-3.5 w-3.5" /> Undo
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

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setPrompt(s)}
            disabled={isLoading}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
