"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface RemoveMemberButtonProps {
  groupId: string
  memberId: string
  memberName: string
}

export default function RemoveMemberButton({
  groupId,
  memberId,
  memberName,
}: RemoveMemberButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    if (!confirm(`Remove ${memberName} from this group?`)) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Failed to remove member")
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  )
}
