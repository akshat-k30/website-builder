import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Globe, ExternalLink, ShieldCheck } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import RemoveMemberButton from "@/components/RemoveMemberButton"
import DeleteGroupButton from "@/components/DeleteGroupButton"

interface GroupPageProps {
  params: Promise<{ id: string }>
}

export default async function GroupPage({ params }: GroupPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) redirect("/login")

  const { id } = await params

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: id, userId: user.id } },
  })
  if (!membership) redirect("/dashboard")

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true } },
      createdBy: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { joinedAt: "asc" },
      },
    },
  })
  if (!group) redirect("/dashboard")

  const isAdmin = membership.role === "admin"

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground">{group.name}</h1>
              {group.description && <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                Created by {group.creator.name} · {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {isAdmin && <DeleteGroupButton groupId={id} groupName={group.name} />}
        </div>

        {/* Invite code */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-md)]">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Invite code</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-xl border border-border bg-background px-6 py-3">
              <span className="select-all font-mono text-2xl font-bold tracking-[0.3em] text-foreground">{group.inviteCode}</span>
            </div>
            <span className="text-sm text-muted-foreground">Share this code with people you want to invite.</span>
          </div>
        </div>

        {/* Public directory */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Public directory</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Showcase all published member websites in one place</p>
              </div>
            </div>
            <a
              href={`/directory/${group.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              View directory <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Members */}
        <h2 className="mb-4 text-lg font-bold text-foreground">Members ({group.createdBy.length})</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]">
          <div className="divide-y divide-border">
            {group.createdBy.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {member.user.name}
                      {member.user.id === user.id && <span className="ml-1 font-normal text-muted-foreground">(you)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      member.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {member.role === "admin" && <ShieldCheck className="h-3.5 w-3.5" />}
                    {member.role}
                  </span>
                  {isAdmin && member.role !== "admin" && member.user.id !== user.id && (
                    <RemoveMemberButton groupId={id} memberId={member.id} memberName={member.user.name} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
