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
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-[4px_0_15px_rgba(0,0,0,0.02)] z-10">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Website Editor</h2>
        <p className="text-sm text-zinc-500">Select a section to edit</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSelectSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => router.push('/dashboard/templates')}
          className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Change Template
        </button>
      </div>
    </div>
  )
}
