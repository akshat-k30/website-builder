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
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-zinc-500 mb-4">{error || "No profile data found."}</p>
        <Link
          href="/dashboard/linkedin"
          className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Upload LinkedIn PDF
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Review Your Profile</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Review and edit the data extracted from your LinkedIn PDF. All fields are editable.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Basic Info Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">1</span>
          Basic Information
        </h2>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              id="input-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              id="input-headline"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              id="input-location"
            />
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">2</span>
          Summary
        </h2>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <textarea
            value={profile.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            rows={5}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
            id="input-summary"
          />
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">3</span>
          Skills
        </h2>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {skill}
                <button
                  onClick={() => removeSkill(i)}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-sm text-zinc-400">No skills added yet.</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..."
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              id="input-new-skill"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
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
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">4</span>
            Experience ({profile.experience.length})
          </h2>
          <button
            onClick={addExperience}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            id="btn-add-experience"
          >
            + Add Entry
          </button>
        </div>
        <div className="space-y-4">
          {profile.experience.map((exp, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  Experience {i + 1}
                </span>
                <button
                  onClick={() => removeExperience(i)}
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(i, "company", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(i, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Date Range
                  </label>
                  <input
                    type="text"
                    value={exp.dateRange}
                    onChange={(e) =>
                      updateExperience(i, "dateRange", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) =>
                      updateExperience(i, "location", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(i, "description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-y"
                />
              </div>
            </div>
          ))}
          {profile.experience.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
              <p className="text-sm text-zinc-500">No experience entries.</p>
            </div>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">5</span>
            Education ({profile.education.length})
          </h2>
          <button
            onClick={addEducation}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            id="btn-add-education"
          >
            + Add Entry
          </button>
        </div>
        <div className="space-y-4">
          {profile.education.map((edu, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  Education {i + 1}
                </span>
                <button
                  onClick={() => removeEducation(i)}
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    School / Institution
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(i, "school", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Degree / Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(i, "degree", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          {profile.education.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
              <p className="text-sm text-zinc-500">No education entries.</p>
            </div>
          )}
        </div>
      </section>

      {/* Generate CTA */}
      <section className="mb-8">
        <div className="rounded-xl border border-violet-200 dark:border-violet-900/50 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Ready to generate your website?</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            AI will transform your profile data into polished, professional website copy.
          </p>
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            id="btn-generate-content"
          >
            ✨ Generate Website Content →
          </Link>
        </div>
      </section>

      {/* Action Bar */}
      <div className="sticky bottom-0 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 -mx-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`
              px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
              ${saving
                ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              }
            `}
            id="btn-save"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Changes saved
            </span>
          )}
        </div>

        <Link
          href="/dashboard/linkedin"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Re-upload PDF
        </Link>
      </div>
    </div>
  )
}
