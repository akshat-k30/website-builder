"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function JoinGroupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const inviteCode = formData.get("inviteCode") as string

    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        // If already a member, redirect to the group
        if (res.status === 409 && data.groupId) {
          router.push(`/dashboard/groups/${data.groupId}`)
          router.refresh()
          return
        }
        setError(data.error)
        setLoading(false)
        return
      }

      router.push(`/dashboard/groups/${data.groupId}`)
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
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-2">Join a Group</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Enter the invite code shared by your group admin to join.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="invite-code"
            className="block text-sm font-medium mb-1"
          >
            Invite Code
          </label>
          <input
            id="invite-code"
            name="inviteCode"
            type="text"
            required
            maxLength={6}
            placeholder="e.g., ABC123"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-center text-lg font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-white"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Joining..." : "Join Group"}
        </button>
      </form>
    </div>
  )
}
