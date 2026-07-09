"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-card border-b border-border transition-colors">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl leading-none">
          W
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          WebsiteBuilder
        </span>
      </Link>
      
      <div className="flex items-center gap-2">
        {session?.user ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/linkedin"
              className="text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              LinkedIn Import
            </Link>
            <Link
              href="/dashboard/editor"
              className="text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              My Website
            </Link>
            <Link
              href="/directory"
              className="text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/dashboard/groups/create"
              className="text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              New Group
            </Link>
            
            <div className="h-6 w-px bg-border mx-2"></div>
            
            <span className="text-sm text-muted-foreground ml-2 font-medium">{session.user.name}</span>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ml-2">
              {session.user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 ml-3 px-3 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover shadow-sm transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
