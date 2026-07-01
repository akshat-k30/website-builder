"use client"

import { SectionType } from "@/app/dashboard/editor/page"
import { useRouter } from "next/navigation"

interface EditorSidebarProps {
  activeSection: SectionType
  onSelectSection: (section: SectionType) => void
  onSave: () => void
  isSaving: boolean
}

const sections: { id: SectionType; label: string; icon: string }[] = [
  { id: "hero", label: "Hero", icon: "🏠" },
  { id: "about", label: "About", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "skills", label: "Skills", icon: "🛠️" },
  { id: "contact", label: "Contact", icon: "✉️" },
  { id: "theme", label: "Theme & Design", icon: "🎨" },
]

export default function EditorSidebar({ activeSection, onSelectSection, onSave, isSaving }: EditorSidebarProps) {
  const router = useRouter()

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col shadow-sm z-10 shrink-0">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-1">Website Editor</h2>
        <p className="text-xs font-medium text-muted-foreground">Select a section to edit manually</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-5 px-3">
        <ul className="space-y-1.5">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSelectSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                    : "text-muted-foreground font-semibold hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className={`text-xl ${activeSection === section.id ? "" : "opacity-70"}`}>
                  {section.icon}
                </span>
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5 border-t border-border space-y-3 bg-card/50">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-hover transition-all disabled:opacity-50 shadow-md shadow-primary/20 active:scale-[0.98]"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => router.push('/dashboard/templates')}
          className="w-full py-3.5 bg-background border-2 border-border text-foreground rounded-xl font-bold hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-[0.98]"
        >
          Change Template
        </button>
      </div>
    </div>
  )
}
