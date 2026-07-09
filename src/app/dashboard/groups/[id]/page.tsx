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
        className="inline-flex items-center gap-2 text-base font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
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
      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-8 shadow-sm">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
          Invite Code
        </h2>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-50 border border-zinc-200 px-5 py-3 rounded-lg">
            <span className="text-2xl font-mono font-bold tracking-widest text-zinc-800 select-all">
              {group.inviteCode}
            </span>
          </div>
          <span className="text-sm text-zinc-500">
            Share this code with people you want to invite
          </span>
        </div>
      </div>

      {/* Public Directory Link */}
      <div className="rounded-xl border border-zinc-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Public Directory</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Showcase all published member websites in one place
              </p>
            </div>
          </div>
          <a
            href={`/directory/${group.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            View Directory
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
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
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    member.role === "admin"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200"
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
