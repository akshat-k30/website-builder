"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WebsiteContent } from "@/types/website"
import EditorSidebar from "@/components/editor/EditorSidebar"
import LivePreview from "@/components/editor/LivePreview"
import EditPanel from "@/components/editor/EditPanel"
import AiPromptPanel from "@/components/editor/AiPromptPanel"
import { TemplateTheme } from "@/lib/templates"

export type SectionType = "hero" | "about" | "experience" | "skills" | "contact" | "theme"

export default function EditorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState<WebsiteContent | null>(null)
  const [theme, setTheme] = useState<TemplateTheme | null>(null)
  const [templateId, setTemplateId] = useState<string>("modern-minimal")
  
  // AI Undo history
  const [history, setHistory] = useState<{ content: WebsiteContent; theme: TemplateTheme }[]>([])
  const [activeSection, setActiveSection] = useState<SectionType>("hero")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/website")
        if (!res.ok) throw new Error("Failed to load website")
        const data = await res.json()
        
        setContent(data.content)
        setTheme(data.themeSettings)
        if (data.templateId) setTemplateId(data.templateId)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, themeSettings: theme }),
      })
      if (!res.ok) throw new Error("Failed to save")
      alert("Saved successfully!")
    } catch (err) {
      console.error(err)
      alert("Error saving.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAiUpdate = (newContent: WebsiteContent, newTheme: TemplateTheme) => {
    if (content && theme) {
      setHistory((prev) => [...prev, { content, theme }])
    }
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

  const handleUpdateSection = (section: SectionType, data: any) => {
    if (section === "theme") {
      setTheme(data)
    } else {
      setContent((prev) => prev ? { ...prev, [section]: data } : null)
    }
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading editor...</div>
  if (!content || !theme) return <div className="flex h-screen items-center justify-center">No content found. Generate it first.</div>

  return (
    <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden bg-background">
      {/* Left Sidebar: Navigation */}
      <EditorSidebar 
        activeSection={activeSection} 
        onSelectSection={setActiveSection} 
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Center: Live Preview */}
      <div className="flex-1 overflow-y-auto bg-muted/30 p-8 relative shadow-inner">
        {/* Scale container to simulate desktop view on smaller screens if needed */}
        <div className="w-full max-w-[1200px] mx-auto min-h-[800px] shadow-2xl rounded-2xl overflow-hidden border border-border transition-all bg-card relative">
          <div className="absolute top-0 left-0 right-0 h-8 bg-muted/80 border-b border-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="mx-auto bg-background border border-border rounded-md px-3 py-0.5 text-xs text-muted-foreground font-mono">
              localhost:3000
            </div>
          </div>
          <div className="pt-8 h-full">
            <LivePreview content={content} theme={theme} templateId={templateId} />
          </div>
        </div>
      </div>

      {/* Right Sidebar: Editor & AI */}
      <div className="w-[400px] flex flex-col bg-card border-l border-border overflow-y-auto shadow-[-4px_0_15px_rgba(0,0,0,0.05)] shrink-0">
        <EditPanel 
          activeSection={activeSection} 
          content={content} 
          theme={theme} 
          onUpdate={handleUpdateSection} 
        />
        <AiPromptPanel 
          content={content} 
          theme={theme} 
          onApply={handleAiUpdate}
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />
      </div>
    </div>
  )
}
