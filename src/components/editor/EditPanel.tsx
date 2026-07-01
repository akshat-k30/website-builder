"use client"

import { SectionType } from "@/app/dashboard/editor/page"
import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

interface EditPanelProps {
  activeSection: SectionType
  content: WebsiteContent
  theme: TemplateTheme
  onUpdate: (section: SectionType, data: any) => void
}

export default function EditPanel({ activeSection, content, theme, onUpdate }: EditPanelProps) {
  
  const handleChange = (field: string, value: any) => {
    if (activeSection === "theme") {
      onUpdate("theme", { ...theme, [field]: value })
    } else {
      const sectionData = content[activeSection]
      onUpdate(activeSection, { ...sectionData, [field]: value })
    }
  }

  // Nested handle change for arrays (like experience)
  const handleArrayChange = (index: number, field: string, value: any) => {
    if (activeSection === "experience") {
      const newExp = [...content.experience]
      newExp[index] = { ...newExp[index], [field]: value }
      onUpdate("experience", newExp)
    }
  }

  return (
    <div className="flex-1 p-5 overflow-y-auto">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 capitalize">
        {activeSection === "theme" ? "Theme Settings" : `${activeSection} Section`}
      </h3>

      <div className="space-y-4">
        {activeSection === "hero" && (
          <>
            <InputField label="Name" value={content.hero.name} onChange={(v) => handleChange("name", v)} />
            <TextAreaField label="Tagline" value={content.hero.tagline} onChange={(v) => handleChange("tagline", v)} />
            <InputField label="Button Text" value={content.hero.ctaText} onChange={(v) => handleChange("ctaText", v)} />
          </>
        )}

        {activeSection === "about" && (
          <>
            <InputField label="Title" value={content.about.title} onChange={(v) => handleChange("title", v)} />
            <TextAreaField label="Content" value={content.about.content} onChange={(v) => handleChange("content", v)} rows={6} />
          </>
        )}

        {activeSection === "experience" && (
          <div className="space-y-8">
            {content.experience.map((exp, idx) => (
              <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-3">
                <InputField label="Role" value={exp.role} onChange={(v) => handleArrayChange(idx, "role", v)} />
                <InputField label="Company" value={exp.company} onChange={(v) => handleArrayChange(idx, "company", v)} />
                <InputField label="Period" value={exp.period} onChange={(v) => handleArrayChange(idx, "period", v)} />
                {/* For highlights, we keep it simple as a text area separated by newlines for this MVP editor */}
                <TextAreaField 
                  label="Highlights (one per line)" 
                  value={exp.highlights.join("\n")} 
                  onChange={(v) => handleArrayChange(idx, "highlights", v.split("\n"))} 
                  rows={4}
                />
              </div>
            ))}
          </div>
        )}

        {activeSection === "skills" && (
          <div className="text-sm text-zinc-500">
            Skills editing requires complex array manipulation. For now, use the AI Prompt below to edit skills (e.g., "Add React to my skills").
          </div>
        )}

        {activeSection === "contact" && (
          <>
            <InputField label="Heading" value={content.contact.heading} onChange={(v) => handleChange("heading", v)} />
            <TextAreaField label="Message" value={content.contact.message} onChange={(v) => handleChange("message", v)} />
            <InputField label="Email" value={content.contact.email} onChange={(v) => handleChange("email", v)} />
            <InputField label="LinkedIn URL" value={content.contact.linkedin} onChange={(v) => handleChange("linkedin", v)} />
          </>
        )}

        {activeSection === "theme" && (
          <>
            <ColorField label="Primary Color" value={theme.primaryColor} onChange={(v) => handleChange("primaryColor", v)} />
            <ColorField label="Secondary Color" value={theme.secondaryColor} onChange={(v) => handleChange("secondaryColor", v)} />
            <ColorField label="Background Color" value={theme.backgroundColor} onChange={(v) => handleChange("backgroundColor", v)} />
            <ColorField label="Text Color" value={theme.textColor} onChange={(v) => handleChange("textColor", v)} />
            <InputField label="Font Family" value={theme.fontFamily} onChange={(v) => handleChange("fontFamily", v)} />
          </>
        )}
      </div>
    </div>
  )
}

// Reusable UI Components for the Editor
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:text-white"
      />
    </div>
  )
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full p-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
      />
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded cursor-pointer border-0 p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md uppercase font-mono dark:text-white"
        />
      </div>
    </div>
  )
}
