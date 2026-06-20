import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import RemoveMemberButton from "@/components/RemoveMemberButton"
import DeleteGroupButton from "@/components/DeleteGroupButton"

interface GroupPageProps {
  params: Promise<{ id: string }>
}

export default async function GroupPage({ params }: GroupPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  // Check membership
  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId: id,
        userId: user.id,
      },
    },
  })

  if (!membership) {
    redirect("/dashboard")
  }

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      creator: {
        select: { name: true },
      },
      createdBy: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  })

  if (!group) {
    redirect("/dashboard")
  }

  const isAdmin = membership.role === "admin"

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8"
      >
        ← Back to Dashboard
      </Link>

      {/* Group Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{group.name}</h1>
            {group.description && (
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                {group.description}
              </p>
            )}
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
              Created by {group.creator.name} ·{" "}
              {new Date(group.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isAdmin && (
            <DeleteGroupButton groupId={id} groupName={group.name} />
          )}
        </div>
      </div>

      {/* Invite Code Card */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
          Invite Code
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-mono font-bold tracking-widest text-zinc-900 dark:text-white">
            {group.inviteCode}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Share this code with people you want to invite
          </span>
        </div>
      </div>

      {/* Members List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Members ({group.createdBy.length})
        </h2>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
          {group.createdBy.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {member.user.name}
                    {member.user.id === user.id && (
                      <span className="text-zinc-400 ml-1">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    member.role === "admin"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {member.role}
                </span>
                {isAdmin && member.role !== "admin" && member.user.id !== user.id && (
                  <RemoveMemberButton
                    groupId={id}
                    memberId={member.id}
                    memberName={member.user.name}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
