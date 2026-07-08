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
  const [aiContent, setAiContent] = useState<WebsiteContent | null>(null)
  const [theme, setTheme] = useState<TemplateTheme | null>(null)
  const [templateId, setTemplateId] = useState<string>("modern-minimal")
  const [websiteStatus, setWebsiteStatus] = useState<string>("draft")
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  
  // AI Undo history
  const [history, setHistory] = useState<{ content: WebsiteContent; theme: TemplateTheme }[]>([])
  const [activeSection, setActiveSection] = useState<SectionType>("hero")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/website")
        if (res.status === 404) {
          // No website yet, gracefully handle it
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
      } catch (err) {
        // Ignore network errors gracefully
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

  const handleRevert = () => {
    if (aiContent) {
      if (content && theme) {
        setHistory((prev) => [...prev, { content, theme }])
      }
      setContent(aiContent)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/website", {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete website")
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Error deleting website.")
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading editor...</div>
  if (!content || !theme) {
    return (
      <div className="flex flex-col h-[calc(100vh-73px)] items-center justify-center bg-background">
        <div className="text-center p-12 bg-card rounded-3xl shadow-xl border border-border max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Website Found</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            You haven't generated your website yet. Head over to the dashboard to upload your profile and generate your content.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden bg-background">
      {/* Left Sidebar: Navigation */}
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
