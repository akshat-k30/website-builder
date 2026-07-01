"use client"

import { useState } from "react"
import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface AiPromptPanelProps {
  content: WebsiteContent
  theme: TemplateTheme
  onApply: (content: WebsiteContent, theme: TemplateTheme) => void
  onUndo: () => void
  canUndo: boolean
}

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
      
      // Basic validation
      if (data.content && data.themeSettings) {
        onApply(data.content, data.themeSettings)
        setPrompt("") // clear prompt on success
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
    <div className="flex flex-col border-t border-border bg-card p-5 shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] z-20 relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          ✨ Edit with AI
        </h3>
        {canUndo && (
          <button 
            onClick={onUndo}
            className="text-xs px-3 py-1.5 font-bold bg-muted text-muted-foreground rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-border"
          >
            ↩ Undo Last
          </button>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Make my tagline sound more professional..."
          className="w-full h-24 p-4 pr-12 text-sm font-medium bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none text-foreground shadow-inner transition-colors"
          disabled={isLoading}
        />
        <button
          onClick={handlePrompt}
          disabled={isLoading || !prompt.trim()}
          className="absolute right-3 bottom-4 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-all shadow-md active:scale-[0.95]"
          title="Send to AI"
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          )}
        </button>
      </div>
      <p className="text-xs font-semibold text-muted-foreground mt-3">
        Try: "Change colors to dark mode" or "Rewrite the about section"
      </p>
    </div>
  )
}
