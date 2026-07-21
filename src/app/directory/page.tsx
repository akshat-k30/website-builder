import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Globe, Users, ExternalLink } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const IN = "animate-[fade-up_0.6s_cubic-bezier(0.22,1,0.36,1)_both]"

export default async function DirectoryIndexPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
  if (!user) redirect("/login")

  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: {
        include: {
          createdBy: { include: { user: { select: { website: { select: { status: true } } } } } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  })

  const groups = memberships.map((m) => ({
    id: m.group.id,
    name: m.group.name,
    slug: m.group.slug,
    description: m.group.description,
    totalMembers: m.group.createdBy.length,
    publishedCount: m.group.createdBy.filter((member) => member.user.website?.status === "published").length,
  }))

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        <div className={`mb-10 ${IN}`}>
          <h1 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground">Group directories</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse the public showcase pages for your groups. Each directory displays all published member websites.
          </p>
        </div>

        {groups.length === 0 ? (
          <div className={`rounded-2xl border border-border bg-card p-12 text-center shadow-[var(--shadow-md)] ${IN}`}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Globe className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">No groups yet</h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">Join or create a group to see its public directory here.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard/groups/create" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover">
                Create group
              </Link>
              <Link href="/dashboard/groups/join" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                Join group
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group, i) => (
              <div
                key={group.id}
                className={`card-glow p-6 ${IN}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{group.name}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {group.totalMembers} members</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-success">{group.publishedCount} published</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`/directory/${group.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
                  >
                    View directory <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {group.description && <p className="ml-16 mt-3 text-sm text-muted-foreground">{group.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
