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
    <div className="min-h-[calc(100vh-73px)] bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose a Template</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a starting point for your personal website. You can customize colors, fonts, and layout later in the editor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/50 overflow-hidden flex flex-col"
            >
              {/* Preview Area */}
              <div 
                className="h-48 w-full flex items-center justify-center p-4 border-b border-border transition-colors duration-300 relative overflow-hidden"
                style={{ backgroundColor: template.defaultTheme.backgroundColor }}
              >
                <div 
                  className="text-2xl font-bold tracking-tight z-10"
                  style={{ color: template.defaultTheme.primaryColor, fontFamily: template.defaultTheme.fontFamily }}
                >
                  {template.name}
                </div>
                {/* Decorative background pattern to make it look premium */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent"></div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {template.name}
                </h3>
                <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
                  {template.description}
                </p>
                
                <button
                  onClick={() => handleSelectTemplate(template)}
                  disabled={isSaving}
                  className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-hover transition-all disabled:opacity-50 shadow-md shadow-primary/20 active:scale-[0.98]"
                >
                  {isSaving ? "Saving..." : "Use Template"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
