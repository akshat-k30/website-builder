"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, LogOut } from "lucide-react"

const AUTH_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/linkedin", label: "LinkedIn Import" },
  { href: "/dashboard/editor", label: "My Website" },
  { href: "/directory", label: "Directory" },
  { href: "/dashboard/groups/create", label: "New Group" },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-card/80 shadow-[0_8px_30px_-16px_rgba(17,24,39,0.25)] backdrop-blur-xl"
          : "border-b border-transparent bg-card/40 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profilio-icon-indigo.svg"
            alt="Profilio"
            className="h-9 w-9 rounded-xl shadow-[var(--shadow-glow)] transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-lg font-extrabold tracking-tight text-foreground">Profilio</span>
        </Link>

        {/* Desktop nav */}
        {session?.user ? (
          <div className="hidden items-center gap-1 lg:flex">
            {AUTH_LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} active={isActive(l.href)}>
                {l.label}
              </NavLink>
            ))}
            <div className="mx-2 h-6 w-px bg-border" />
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
                {session.user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="max-w-[120px] truncate text-sm font-semibold text-foreground">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Get started free
            </Link>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/70 bg-card/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {session?.user ? (
                <>
                  {AUTH_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive(l.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <div className="my-2 h-px bg-border" />
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
                        {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <span className="text-sm font-semibold text-foreground">{session.user.name}</span>
                    </span>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground">
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`group relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
        active ? "text-primary" : "text-foreground/80 hover:text-foreground"
      }`}
    >
      {children}
      <span
        className={`pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary transition-all duration-300 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
      />
    </Link>
  )
}
