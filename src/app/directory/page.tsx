import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DirectoryIndexPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    redirect("/login")
  }

  // Fetch user's groups with member counts and published website counts
  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: {
        include: {
          createdBy: {
            include: {
              user: {
                select: {
                  website: {
                    select: { status: true },
                  },
                },
              },
            },
          },
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
    publishedCount: m.group.createdBy.filter(
      (member) => member.user.website?.status === "published"
    ).length,
  }))

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Group Directories</h1>
          <p className="text-muted-foreground text-sm">
            Browse the public showcase pages for your groups. Each directory displays all published member websites.
          </p>
        </div>

        {/* Groups List */}
        {groups.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No groups yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Join or create a group to see its public directory here.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/dashboard/groups/create"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                Create Group
              </Link>
              <Link
                href="/dashboard/groups/join"
                className="bg-transparent text-foreground border border-border px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted transition-colors shadow-sm"
              >
                Join Group
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base mb-1">{group.name}</h3>
                      <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                        <span>{group.totalMembers} members</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="text-green-600">{group.publishedCount} published</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`/directory/${group.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    View Directory
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                {group.description && (
                  <p className="text-sm text-muted-foreground mt-3 ml-16">
                    {group.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
