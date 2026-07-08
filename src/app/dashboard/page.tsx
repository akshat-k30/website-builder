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

  // Check if user has a LinkedIn profile
  const linkedinProfile = await prisma.linkedInProfile.findUnique({
    where: { userId: user.id },
    select: { id: true, parsedName: true, updatedAt: true },
  })

  // Check if user has generated website content
  const website = await prisma.website.findUnique({
    where: { userId: user.id },
    select: { id: true, status: true, updatedAt: true, subdomain: true, publishedUrl: true },
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background">
      <div className="max-w-6xl mx-auto px-8 py-12">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              {getGreeting()}, {user.name?.split(" ")[0] || "User"} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your groups and website from here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {website?.status === "published" && website.publishedUrl && (
              <a
                href={website.publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Live Site
              </a>
            )}
            {linkedinProfile ? (
              <Link
                href={website ? "/dashboard/editor" : "/dashboard/generate"}
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
              >
                {website ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Website
                  </>
                ) : (
                  <>
                    <span>+</span> New Website
                  </>
                )}
              </Link>
            ) : (
              <button
                disabled
                className="bg-muted text-muted-foreground px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 opacity-60 cursor-not-allowed"
                title="Upload LinkedIn profile first"
              >
                <span>+</span> New Website
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions (Stats style cards) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <Link
            href="/dashboard/groups/create"
            className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors flex flex-col gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground mb-1">Create Group</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">Start a new group for your team or class.</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/groups/join"
            className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors flex flex-col gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-foreground mb-1">Join Group</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">Enter an invite code to join an existing group.</p>
            </div>
          </Link>

          <Link
            href={linkedinProfile ? "/dashboard/linkedin/review" : "/dashboard/linkedin"}
            className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors flex flex-col gap-4 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${linkedinProfile ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"}`}>
              {linkedinProfile ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="font-bold text-foreground mb-1">{linkedinProfile ? "LinkedIn Ready" : "Import Data"}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {linkedinProfile ? "Profile imported. Click to review." : "Upload your resume PDF."}
              </p>
            </div>
          </Link>

          {linkedinProfile ? (
            <Link
              href={website ? "/dashboard/editor" : "/dashboard/generate"}
              className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4 transition-colors shadow-sm hover:border-primary/50"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${website?.status === "published" ? "bg-green-500/10 text-green-500" : website ? "bg-yellow-500/10 text-yellow-500" : "bg-primary/10 text-primary"}`}>
                {website?.status === "published" ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : website ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="font-bold text-foreground mb-1">
                  {website?.status === "published" ? "Published ✓" : website ? "Website Ready" : "Generate"}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {website?.status === "published" 
                    ? "Your site is live. Click to edit." 
                    : website 
                      ? "AI content generated. Click to edit." 
                      : "Use AI to create copy."}
                </p>
              </div>
            </Link>
          ) : (
            <div 
              className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4 shadow-sm opacity-60 cursor-not-allowed"
              title="Upload LinkedIn profile first"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-foreground mb-1">Generate</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload LinkedIn profile first.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Groups List */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">My Groups</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">{memberships.length}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {memberships.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No groups yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                You haven't joined any groups yet. Create a new group to collaborate with others or join an existing one using an invite code.
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
            <div className="divide-y divide-border">
              {memberships.map((m) => (
                <div key={m.id} className="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                      {m.group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base mb-1">{m.group.name}</h3>
                      <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                        <span>{m.group._count.createdBy} members</span>
                        {m.role === "admin" && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">Admin</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/groups/${m.group.id}`}
                    className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    View →
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
