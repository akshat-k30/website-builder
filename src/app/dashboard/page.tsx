import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  if (!user) {
    redirect("/login")
  }

  // Fetch user's groups
  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: {
        include: {
          _count: {
            select: { createdBy: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">
        Manage your groups and websites from here.
      </p>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <Link
          href="/dashboard/groups/create"
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
        >
          <h2 className="font-semibold mb-1">+ Create Group</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Start a new group for your team or class.
          </p>
        </Link>
        <Link
          href="/dashboard/groups/join"
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
        >
          <h2 className="font-semibold mb-1">🔗 Join Group</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter an invite code to join an existing group.
          </p>
        </Link>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 opacity-50 cursor-not-allowed">
          <h2 className="font-semibold mb-1">🌐 Build Website</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Coming in Phase 3 — LinkedIn import + AI generation.
          </p>
        </div>
      </div>

      {/* My Groups */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Groups</h2>
        {memberships.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 mb-3">
              You haven&apos;t joined any groups yet.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/dashboard/groups/create"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Create a Group
              </Link>
              <Link
                href="/dashboard/groups/join"
                className="text-sm font-medium px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Join a Group
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {memberships.map((m) => (
              <Link
                key={m.id}
                href={`/dashboard/groups/${m.group.id}`}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <h3 className="font-semibold mb-1">{m.group.name}</h3>
                {m.group.description && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 line-clamp-2">
                    {m.group.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                  <span>{m.group._count.createdBy} members</span>
                  <span>·</span>
                  <span
                    className={`font-medium ${
                      m.role === "admin"
                        ? "text-blue-600 dark:text-blue-400"
                        : ""
                    }`}
                  >
                    {m.role}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
