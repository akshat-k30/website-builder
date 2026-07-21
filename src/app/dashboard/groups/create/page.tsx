"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, AlertCircle, Loader2 } from "lucide-react"

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
    <div className="min-h-[calc(100vh-64px)] bg-background px-6 py-12">
      <div className="mx-auto max-w-lg">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-md)]">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="font-[var(--font-display)] text-2xl font-extrabold tracking-tight text-foreground">Create a group</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a group for your team, class, or organization. Members can join using an invite code.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="group-name" className="mb-1.5 block text-sm font-semibold text-foreground">
                Group name <span className="text-red-500">*</span>
              </label>
              <input
                id="group-name"
                name="name"
                type="text"
                required
                placeholder="e.g., CSE Batch 2027"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
            <div>
              <label htmlFor="group-description" className="mb-1.5 block text-sm font-semibold text-foreground">
                Description <span className="font-medium text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="group-description"
                name="description"
                rows={3}
                placeholder="A brief description of this group…"
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
            {error && (
              <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500">
                <AlertCircle className="h-4 w-4 flex-none" /> {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-primary-hover disabled:opacity-50"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create group"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
