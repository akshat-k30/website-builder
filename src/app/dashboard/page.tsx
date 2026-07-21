import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Plus,
  UserPlus,
  FileUp,
  Sparkles,
  Pencil,
  Rocket,
  CircleCheck,
  Circle,
  Users,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const IN = "animate-[fade-up_0.6s_cubic-bezier(0.22,1,0.36,1)_both]"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  if (!user) redirect("/login")

  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: { group: { include: { _count: { select: { createdBy: true } } } } },
    orderBy: { joinedAt: "desc" },
  })

  const linkedinProfile = await prisma.linkedInProfile.findUnique({
    where: { userId: user.id },
    select: { id: true, parsedName: true, updatedAt: true },
  })

  const website = await prisma.website.findUnique({
    where: { userId: user.id },
    select: { id: true, status: true, updatedAt: true, subdomain: true, publishedUrl: true },
  })

  const hasLI = !!linkedinProfile
  const hasSite = !!website
  const isPub = website?.status === "published"

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"
  })()

  // Pipeline: first not-done step becomes "current"
  const pipeline = [
    { label: "Import LinkedIn", href: hasLI ? "/dashboard/linkedin/review" : "/dashboard/linkedin", done: hasLI },
    { label: "Generate", href: hasSite ? "/dashboard/editor" : "/dashboard/generate", done: hasSite },
    { label: "Edit", href: "/dashboard/editor", done: isPub },
    { label: "Publish", href: hasSite ? "/dashboard/publish" : "/dashboard/generate", done: isPub },
  ]
  const currentIdx = pipeline.findIndex((s) => !s.done)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      {/* Ambient top glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-16 -z-0 h-64 bg-grid bg-grid-fade opacity-50" />

      <div className="relative mx-auto max-w-6xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className={`mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end ${IN}`}>
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-foreground">
              {greeting}, {user.name?.split(" ")[0] || "there"} <span aria-hidden>👋</span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Manage your groups and website from here.</p>
          </div>
          <div className="flex items-center gap-3">
            {isPub && website?.publishedUrl && (
              <a
                href={website.publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4" /> View live site
              </a>
            )}
            {hasLI ? (
              <Link
                href={hasSite ? "/dashboard/editor" : "/dashboard/generate"}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                {hasSite ? <><Pencil className="h-4 w-4" /> Edit website</> : <><Plus className="h-4 w-4" /> New website</>}
              </Link>
            ) : (
              <button
                disabled
                title="Upload your LinkedIn profile first"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-muted px-5 py-2.5 text-sm font-semibold text-muted-foreground opacity-70"
              >
                <Plus className="h-4 w-4" /> New website
              </button>
            )}
          </div>
        </div>

        {/* Pipeline progress */}
        <div className={`mb-12 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-md)] ${IN}`} style={{ animationDelay: "60ms" }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your pipeline</h2>
            <span className="text-xs font-semibold text-muted-foreground">
              {pipeline.filter((s) => s.done).length} / {pipeline.length} complete
            </span>
          </div>
          <ol className="grid grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-4">
            {pipeline.map((s, i) => {
              const state = s.done ? "done" : i === currentIdx ? "current" : "todo"
              return (
                <li key={s.label} className="relative flex flex-col items-center text-center">
                  {/* connector */}
                  {i < pipeline.length - 1 && (
                    <span
                      aria-hidden
                      className={`absolute left-1/2 top-5 hidden h-0.5 w-full sm:block ${s.done ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                  <Link href={s.href} className="group relative z-10 flex flex-col items-center">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${
                        state === "done"
                          ? "border-primary bg-primary text-white"
                          : state === "current"
                            ? "border-primary bg-card text-primary [animation:pulse-ring_2.4s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {state === "done" ? <CircleCheck className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
                    </span>
                    <span className={`mt-2.5 text-xs font-semibold ${state === "todo" ? "text-muted-foreground" : "text-foreground"}`}>
                      {s.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Quick actions */}
        <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <QuickCard
            href="/dashboard/groups/create"
            icon={<Plus className="h-5 w-5" />}
            title="Create Group"
            desc="Start a new group for your team or class."
            delay={120}
          />
          <QuickCard
            href="/dashboard/groups/join"
            icon={<UserPlus className="h-5 w-5" />}
            title="Join Group"
            desc="Enter an invite code to join an existing group."
            delay={180}
          />
          <QuickCard
            href={hasLI ? "/dashboard/linkedin/review" : "/dashboard/linkedin"}
            icon={hasLI ? <CircleCheck className="h-5 w-5" /> : <FileUp className="h-5 w-5" />}
            title={hasLI ? "LinkedIn Ready" : "Import Data"}
            desc={hasLI ? "Profile imported. Click to review." : "Upload your resume PDF."}
            tone={hasLI ? "success" : "primary"}
            delay={240}
          />
          {hasLI ? (
            <QuickCard
              href={hasSite ? "/dashboard/editor" : "/dashboard/generate"}
              icon={isPub ? <Rocket className="h-5 w-5" /> : hasSite ? <Pencil className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              title={isPub ? "Published ✓" : hasSite ? "Website Ready" : "Generate"}
              desc={isPub ? "Your site is live. Click to edit." : hasSite ? "AI content generated. Click to edit." : "Use AI to create copy."}
              tone={isPub ? "success" : hasSite ? "warning" : "primary"}
              delay={300}
            />
          ) : (
            <div
              title="Upload your LinkedIn profile first"
              className={`flex cursor-not-allowed flex-col gap-4 rounded-2xl border border-border bg-card p-6 opacity-60 shadow-sm ${IN}`}
              style={{ animationDelay: "300ms" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-foreground">Generate</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Upload LinkedIn profile first.</p>
              </div>
            </div>
          )}
        </div>

        {/* Groups */}
        <div className={`mb-6 flex items-center gap-3 ${IN}`} style={{ animationDelay: "360ms" }}>
          <h2 className="text-lg font-bold text-foreground">My Groups</h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{memberships.length}</span>
        </div>

        <div className={`overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)] ${IN}`} style={{ animationDelay: "420ms" }}>
          {memberships.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">No groups yet</h3>
              <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
                You haven&apos;t joined any groups yet. Create a new group to collaborate, or join one with an invite code.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/dashboard/groups/create" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover">
                  Create Group
                </Link>
                <Link href="/dashboard/groups/join" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                  Join Group
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {memberships.map((m) => (
                <div key={m.id} className="group flex items-center justify-between p-5 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
                      {m.group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{m.group.name}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                        <span>{m.group._count.createdBy} members</span>
                        {m.role === "admin" && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">Admin</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/groups/${m.group.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    View <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickCard({
  href,
  icon,
  title,
  desc,
  tone = "primary",
  delay = 0,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
  tone?: "primary" | "success" | "warning"
  delay?: number
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    success: "bg-success/10 text-success group-hover:bg-success group-hover:text-white",
    warning: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
  }[tone]

  return (
    <Link
      href={href}
      className={`card-glow group flex flex-col gap-4 p-6 ${IN}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${toneMap}`}>
        {icon}
      </span>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </Link>
  )
}
