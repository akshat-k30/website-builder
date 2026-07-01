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
    <div className="flex flex-col border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          ✨ Edit with AI
        </h3>
        {canUndo && (
          <button 
            onClick={onUndo}
            className="text-xs px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            ↩ Undo Last
          </button>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Make it sound more professional..."
          className="w-full h-24 p-3 pr-10 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:text-white shadow-inner"
          disabled={isLoading}
        />
        <button
          onClick={handlePrompt}
          disabled={isLoading || !prompt.trim()}
          className="absolute right-2 bottom-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          title="Send to AI"
        >
          {isLoading ? (
             <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          )}
        </button>
      </div>
      <p className="text-xs text-zinc-500 mt-2">
        Try: "Change colors to dark mode" or "Rewrite the about section"
      </p>
    </div>
  )
}
