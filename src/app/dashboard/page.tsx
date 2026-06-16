import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        This is your dashboard. More features coming in Phase 2.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="font-semibold mb-1">LinkedIn Import</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Paste your LinkedIn URL to import profile data.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="font-semibold mb-1">AI Generation</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Generate professional website copy with AI.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="font-semibold mb-1">Publish</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Deploy your site live with one click.
          </p>
        </div>
      </div>
    </div>
  )
}
