"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { ExperienceEntry, EducationEntry } from "@/types/linkedin"

interface ProfileData {
  id: string
  linkedinUrl: string
  name: string
  headline: string
  location: string
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  updatedAt: string
}

export default function LinkedInReviewPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/linkedin/profile")
        if (res.status === 404) {
          router.push("/dashboard/linkedin")
          return
        }
        if (!res.ok) throw new Error("Failed to load profile")
        const data = await res.json()
        setProfile(data.profile)
      } catch {
        setError("Failed to load profile data. Please try uploading again.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setSaved(false)
    setError("")

    try {
      const res = await fetch("/api/linkedin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          headline: profile.headline,
          location: profile.location,
          summary: profile.summary,
          experience: profile.experience,
          education: profile.education,
          skills: profile.skills,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")
      const data = await res.json()
      setProfile(data.profile)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof ProfileData, value: string) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  const updateExperience = (
    index: number,
    field: keyof ExperienceEntry,
    value: string
  ) => {
    if (!profile) return
    const updated = [...profile.experience]
    updated[index] = { ...updated[index], [field]: value }
    setProfile({ ...profile, experience: updated })
  }

  const addExperience = () => {
    if (!profile) return
    setProfile({
      ...profile,
      experience: [
        ...profile.experience,
        { company: "", title: "", dateRange: "", location: "", description: "" },
      ],
    })
  }

  const removeExperience = (index: number) => {
    if (!profile) return
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index),
    })
  }

  const updateEducation = (
    index: number,
    field: keyof EducationEntry,
    value: string
  ) => {
    if (!profile) return
    const updated = [...profile.education]
    updated[index] = { ...updated[index], [field]: value }
    setProfile({ ...profile, education: updated })
  }

  const addEducation = () => {
    if (!profile) return
    setProfile({
      ...profile,
      education: [...profile.education, { school: "", degree: "" }],
    })
  }

  const removeEducation = (index: number) => {
    if (!profile) return
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    })
  }

  const addSkill = () => {
    if (!profile || !newSkill.trim()) return
    if (profile.skills.includes(newSkill.trim())) {
      setNewSkill("")
      return
    }
    setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
    setNewSkill("")
  }

  const removeSkill = (index: number) => {
    if (!profile) return
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index),
    })
  }

  const handleClearAll = async () => {
    if (!profile) return
    if (
      !confirm(
        "Are you sure you want to clear all details? This will delete your imported profile data."
      )
    ) {
      return
    }
    
    try {
      setSaving(true)
      const res = await fetch("/api/linkedin/profile", {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete profile")
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Failed to clear profile. Please try again.")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-background">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-border rounded w-1/3" />
            <div className="h-4 bg-border rounded w-2/3" />
            <div className="h-32 bg-card border border-border rounded-xl" />
            <div className="h-32 bg-card border border-border rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-background flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-12 text-center bg-card rounded-2xl border border-border shadow-sm p-10">
          <p className="text-muted-foreground mb-6">{error || "No profile data found."}</p>
          <Link
            href="/dashboard/linkedin"
            className="text-sm font-bold px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-all active:scale-[0.98]"
          >
            Upload LinkedIn PDF
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 pb-32">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Review Your Profile</h1>
            <p className="text-muted-foreground text-sm">
              Review and edit the data extracted from your LinkedIn PDF. All fields are editable.
            </p>
          </div>
          <button
            onClick={handleClearAll}
            className="text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
            title="Remove all details"
          >
            Clear All
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Basic Info Section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-3 text-foreground">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">1</span>
            Basic Information
          </h2>
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                id="input-name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => updateField("headline", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                id="input-headline"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                id="input-location"
              />
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-3 text-foreground">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">2</span>
            Summary
          </h2>
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
            <textarea
              value={profile.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm resize-y transition-colors leading-relaxed"
              id="input-summary"
            />
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-3 text-foreground">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">3</span>
            Skills
          </h2>
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-muted text-muted-foreground border border-border"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(i)}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md p-0.5 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {profile.skills.length === 0 && (
                <p className="text-sm font-medium text-muted-foreground">No skills added yet.</p>
              )}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a skill..."
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                id="input-new-skill"
              />
              <button
                onClick={addSkill}
                className="px-6 py-3 rounded-lg border-2 border-border bg-card text-foreground font-bold text-sm hover:border-primary/50 hover:bg-primary/5 transition-colors shadow-sm"
                id="btn-add-skill"
              >
                Add
              </button>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-3 text-foreground">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">4</span>
              Experience <span className="text-muted-foreground ml-1 font-medium">({profile.experience.length})</span>
            </h2>
            <button
              onClick={addExperience}
              className="text-sm font-bold text-primary hover:text-primary-hover transition-colors"
              id="btn-add-experience"
            >
              + Add Entry
            </button>
          </div>
          <div className="space-y-6">
            {profile.experience.map((exp, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card shadow-sm p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20"></div>
                <div className="flex items-start justify-between mb-5 pl-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Experience {i + 1}
                  </span>
                  <button
                    onClick={() => removeExperience(i)}
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 pl-2">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(i, "company", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(i, "title", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Date Range
                    </label>
                    <input
                      type="text"
                      value={exp.dateRange}
                      onChange={(e) =>
                        updateExperience(i, "dateRange", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(i, "location", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-5 pl-2">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(i, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm resize-y transition-colors leading-relaxed"
                  />
                </div>
              </div>
            ))}
            {profile.experience.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-card/50">
                <p className="text-sm font-medium text-muted-foreground">No experience entries.</p>
              </div>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-3 text-foreground">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">5</span>
              Education <span className="text-muted-foreground ml-1 font-medium">({profile.education.length})</span>
            </h2>
            <button
              onClick={addEducation}
              className="text-sm font-bold text-primary hover:text-primary-hover transition-colors"
              id="btn-add-education"
            >
              + Add Entry
            </button>
          </div>
          <div className="space-y-6">
            {profile.education.map((edu, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card shadow-sm p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20"></div>
                <div className="flex items-start justify-between mb-5 pl-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Education {i + 1}
                  </span>
                  <button
                    onClick={() => removeEducation(i)}
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 pl-2">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      School / Institution
                    </label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(i, "school", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Degree / Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(i, "degree", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
            {profile.education.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-card/50">
                <p className="text-sm font-medium text-muted-foreground">No education entries.</p>
              </div>
            )}
          </div>
        </section>



        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between relative">
            <div className="w-1/3 flex items-center justify-start">
              <Link
                href="/dashboard/linkedin"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Re-upload PDF
              </Link>
            </div>
            
            <div className="w-1/3 flex justify-center">
              <Link
                href="/dashboard/generate?auto=true"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-[0.98] whitespace-nowrap"
                id="btn-generate-content"
              >
                ✨ Generate Website Content →
              </Link>
            </div>

            <div className="w-1/3 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg">
                  ✓ Saved
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`
                  px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md
                  ${saving
                    ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                    : "bg-card text-foreground border-2 border-border hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]"
                  }
                `}
                id="btn-save"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
