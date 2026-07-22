"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, ArrowRight, Check } from "lucide-react"
import { availableTemplates, TemplateDefinition } from "@/lib/templates"
import TemplatePreview from "@/components/TemplatePreview"

export default function TemplatesPage() {
  const router = useRouter()
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleSelectTemplate = async (template: TemplateDefinition) => {
    setSavingId(template.id)
    try {
      const res = await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, themeSettings: template.defaultTheme }),
      })
      if (!res.ok) throw new Error("Failed to save template")
      router.push("/dashboard/editor")
    } catch (error) {
      console.error(error)
      alert("Failed to select template.")
      setSavingId(null)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Templates</span>
          <h1 className="mt-3 font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-foreground">
            Choose your look
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick a starting point. You can fully customize colors, fonts, and content later in the editor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableTemplates.map((t, i) => {
            const saving = savingId === t.id
            const theme = t.defaultTheme
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-xl)]"
              >
                {/* Generated preview of the template's actual landing hero */}
                <div className="relative h-48 overflow-hidden border-b border-border">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                    <TemplatePreview templateId={t.id} theme={theme} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                  <button
                    onClick={() => handleSelectTemplate(t)}
                    disabled={!!savingId}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-primary-hover disabled:opacity-50"
                  >
                    {saving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Applying…</>
                    ) : (
                      <>Use template <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" /> Switching templates keeps all your content.
        </p>
      </div>
    </div>
  )
}
