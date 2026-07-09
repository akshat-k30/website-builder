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

const FONT_OPTIONS = [
  { label: "Inter (Modern Sans)", value: "Inter, sans-serif" },
  { label: "Roboto (Clean Sans)", value: "Roboto, sans-serif" },
  { label: "Open Sans (Friendly Sans)", value: "'Open Sans', sans-serif" },
  { label: "Montserrat (Geometric Sans)", value: "Montserrat, sans-serif" },
  { label: "Poppins (Rounded Sans)", value: "Poppins, sans-serif" },
  { label: "Playfair Display (Elegant Serif)", value: "'Playfair Display', serif" },
  { label: "Merriweather (Classic Serif)", value: "Merriweather, serif" },
  { label: "System Default", value: "system-ui, -apple-system, sans-serif" },
]

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
    <div className="flex-1 p-6 overflow-y-auto bg-background">
      <h3 className="text-xl font-bold text-foreground mb-6 capitalize border-b border-border pb-4">
        {activeSection === "theme" ? "Theme Settings" : `${activeSection} Section`}
      </h3>

      <div className="space-y-5">
        {activeSection === "hero" && (
          <>
            <ImageUploadField label="Profile Photo" value={content.hero.photoUrl || ""} onChange={(v) => handleChange("photoUrl", v)} />
            <InputField label="Name" value={content.hero.name} onChange={(v) => handleChange("name", v)} />
            <TextAreaField label="Tagline" value={content.hero.tagline} onChange={(v) => handleChange("tagline", v)} />
            <InputField label="Button Text" value={content.hero.ctaText} onChange={(v) => handleChange("ctaText", v)} />
          </>
        )}

        {activeSection === "about" && (
          <>
            <InputField label="Title" value={content.about.title} onChange={(v) => handleChange("title", v)} />
            <TextAreaField label="Content" value={content.about.content} onChange={(v) => handleChange("content", v)} rows={8} />
          </>
        )}

        {activeSection === "experience" && (
          <div className="space-y-6">
            {content.experience.map((exp, idx) => (
              <div key={idx} className="p-5 bg-card rounded-xl border border-border space-y-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Experience {idx + 1}</h4>
                </div>
                <InputField label="Role" value={exp.role} onChange={(v) => handleArrayChange(idx, "role", v)} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Company" value={exp.company} onChange={(v) => handleArrayChange(idx, "company", v)} />
                  <InputField label="Period" value={exp.period} onChange={(v) => handleArrayChange(idx, "period", v)} />
                </div>
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
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-sm font-medium text-primary flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Skills editing requires complex array manipulation. For now, use the AI Prompt panel below to edit skills (e.g., "Add React to my skills").</p>
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
          <div className="space-y-6">
            <div className="p-5 bg-card rounded-xl border border-border space-y-5 shadow-sm">
              <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Colors</h4>
              <ColorField label="Primary Color" value={theme.primaryColor} onChange={(v) => handleChange("primaryColor", v)} />
              <ColorField label="Secondary Color" value={theme.secondaryColor} onChange={(v) => handleChange("secondaryColor", v)} />
              <ColorField label="Background Color" value={theme.backgroundColor} onChange={(v) => handleChange("backgroundColor", v)} />
              <ColorField label="Text Color" value={theme.textColor} onChange={(v) => handleChange("textColor", v)} />
            </div>
            
            <div className="p-5 bg-card rounded-xl border border-border space-y-4 shadow-sm">
              <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Typography</h4>
              <SelectField 
                label="Font Family" 
                value={theme.fontFamily} 
                options={FONT_OPTIONS}
                onChange={(v) => handleChange("fontFamily", v)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Reusable UI Components for the Editor
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 text-sm bg-card border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-foreground outline-none transition-colors"
      />
    </div>
  )
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full p-2.5 text-sm bg-card border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-foreground outline-none resize-y transition-colors leading-relaxed"
      />
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex gap-3 items-center">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-10px] w-16 h-16 cursor-pointer border-0 p-0"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-2.5 text-sm bg-card border border-border rounded-lg uppercase font-mono text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
        />
      </div>
    </div>
  )
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: {label: string, value: string}[]; onChange: (v: string) => void }) {
  // Ensure the current value is in the options list so it doesn't appear blank
  const currentOptionExists = options.some(opt => opt.value === value)
  const displayOptions = currentOptionExists 
    ? options 
    : [{ label: `Custom (${value})`, value }, ...options]

  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2.5 pr-10 text-sm bg-card border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-foreground outline-none transition-colors appearance-none cursor-pointer"
        >
          {displayOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Ensure it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.")
      return
    }

    // Convert to base64 Data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target?.result as string
      onChange(base64String)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      
      {value ? (
        <div className="flex items-start gap-4 p-4 border border-border rounded-xl bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={value} 
            alt="Profile Preview" 
            className="w-16 h-16 rounded-full object-cover border border-border shadow-sm shrink-0" 
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Photo uploaded</p>
            <p className="text-xs text-muted-foreground mb-3">This photo will appear on your generated website.</p>
            <button
              onClick={() => onChange("")}
              className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
            >
              Remove Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-border rounded-xl bg-muted/30 p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors group cursor-pointer">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Click to upload photo</p>
          <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP</p>
        </div>
      )}
    </div>
  )
}
