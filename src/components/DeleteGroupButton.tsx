"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface DeleteGroupButtonProps {
  groupId: string
  groupName: string
}

export default function DeleteGroupButton({
  groupId,
  groupName,
}: DeleteGroupButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete "${groupName}"? This will remove all members and cannot be undone.`
      )
    ) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Failed to delete group")
        setLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
    >
      {loading ? "Deleting..." : "Delete Group"}
    </button>
  )
}
