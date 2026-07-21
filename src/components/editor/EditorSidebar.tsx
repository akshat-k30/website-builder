"use client"

import { SectionType } from "@/app/dashboard/editor/page"
import { useRouter } from "next/navigation"
import {
  PanelTop,
  User,
  Briefcase,
  Wrench,
  Mail,
  Palette,
  Save,
  Rocket,
  RefreshCw,
  LayoutTemplate,
  RotateCcw,
  Trash2,
  type LucideIcon,
} from "lucide-react"

interface EditorSidebarProps {
  activeSection: SectionType
  onSelectSection: (section: SectionType) => void
  onSave: () => void
  isSaving: boolean
  onRevert?: () => void
  onDelete?: () => void
  websiteStatus?: string
  publishedUrl?: string | null
}

const sections: { id: SectionType; label: string; icon: LucideIcon }[] = [
  { id: "hero", label: "Hero", icon: PanelTop },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "theme", label: "Theme & Design", icon: Palette },
]

export default function EditorSidebar({
  activeSection,
  onSelectSection,
  onSave,
  isSaving,
  onRevert,
  onDelete,
  websiteStatus,
  publishedUrl,
}: EditorSidebarProps) {
  const router = useRouter()

  return (
    <div className="z-10 flex w-72 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="text-base font-bold text-foreground">Website Editor</h2>
        <p className="mt-0.5 text-xs font-medium text-muted-foreground">Select a section to edit</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          {sections.map((section) => {
            const active = activeSection === section.id
            return (
              <li key={section.id}>
                <button
                  onClick={() => onSelectSection(section.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all ${
                    active
                      ? "bg-primary/10 font-bold text-primary shadow-sm"
                      : "font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                  </span>
                  {section.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Live status */}
      {websiteStatus === "published" && publishedUrl && (
        <div className="border-t border-border px-5 py-4">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-bold text-success">Live</span>
          </div>
          <a
            href={publishedUrl}
            target="_blank"
            rel="noreferrer"
            className="block break-all text-xs font-semibold leading-relaxed text-primary hover:underline"
          >
            {publishedUrl}
          </a>
        </div>
      )}

      <div className="space-y-2.5 border-t border-border p-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-bold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {isSaving ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={() => {
            onSave()
            router.push("/dashboard/publish")
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          {websiteStatus === "published" ? <><RefreshCw className="h-4 w-4" /> Republish</> : <><Rocket className="h-4 w-4" /> Publish</>}
        </button>
        <button
          onClick={() => router.push("/dashboard/templates")}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LayoutTemplate className="h-4 w-4" /> Change template
        </button>

        {(onRevert || onDelete) && (
          <div className="mt-1 space-y-1 border-t border-border pt-3">
            {onRevert && (
              <button
                onClick={() => {
                  if (confirm("Reset all text back to the original AI-generated version? This undoes all manual edits.")) onRevert()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset to AI original
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm("WARNING: Completely delete your website? This also deletes your imported LinkedIn data — you'll start over from scratch.")) onDelete()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete entire website
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
