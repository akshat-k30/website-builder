"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { availableTemplates, TemplateDefinition } from "@/lib/templates"

export default function TemplatesPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSelectTemplate = async (template: TemplateDefinition) => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/website", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template.id,
          themeSettings: template.defaultTheme,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save template")
      }

      router.push("/dashboard/editor")
    } catch (error) {
      console.error(error)
      alert("Failed to select template.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Choose a Template</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Select a starting point for your personal website. You can customize colors, fonts, and layout later in the editor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableTemplates.map((template) => (
          <div
            key={template.id}
            className="group relative bg-white dark:bg-zinc-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col"
          >
            {/* Preview Area (Simulated for now) */}
            <div 
              className="h-48 w-full flex items-center justify-center p-4 border-b border-zinc-200 dark:border-zinc-700 transition-colors duration-300"
              style={{ backgroundColor: template.defaultTheme.backgroundColor }}
            >
              <div 
                className="text-2xl font-bold tracking-tight"
                style={{ color: template.defaultTheme.primaryColor, fontFamily: template.defaultTheme.fontFamily }}
              >
                {template.name}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-1">
                {template.description}
              </p>
              
              <button
                onClick={() => handleSelectTemplate(template)}
                disabled={isSaving}
                className="w-full py-3 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Use Template"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
