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
      className="text-xs font-semibold px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  )
}
