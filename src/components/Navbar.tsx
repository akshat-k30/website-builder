"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
      <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
        WebsiteBuilder
      </Link>
      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/linkedin"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              LinkedIn Import
            </Link>
            <Link
              href="/dashboard/groups/create"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              New Group
            </Link>
            <span className="text-sm text-zinc-500">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
