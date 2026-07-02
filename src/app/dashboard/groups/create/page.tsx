"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateGroupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      router.push(`/dashboard/groups/${data.group.id}`)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-base font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-2 text-zinc-900">Create a Group</h1>
      <p className="text-zinc-500 mb-8">
        Create a group for your team, class, or organization. Members can join
        using an invite code.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="group-name" className="block text-sm font-bold text-zinc-700 mb-1.5">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            id="group-name"
            name="name"
            type="text"
            required
            placeholder="e.g., CSE Batch 2027"
            className="w-full rounded-lg border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="group-description"
            className="block text-sm font-bold text-zinc-700 mb-1.5"
          >
            Description <span className="text-zinc-400 font-medium">(optional)</span>
          </label>
          <textarea
            id="group-description"
            name="description"
            rows={3}
            placeholder="A brief description of this group..."
            className="w-full rounded-lg border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-colors shadow-sm"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-md shadow-primary/20"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  )
}
