import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center bg-background min-h-[calc(100vh-73px)]">
      <div className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full mb-8 text-sm">
        Welcome to the Future of Portfolios
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground max-w-3xl">
        Your LinkedIn Profile
        <br />
        <span className="text-primary mt-2 block">
          Becomes a Website
        </span>
      </h1>
      <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed mx-auto">
        Paste your LinkedIn URL, let AI generate professional website content,
        pick a template, and publish — all in under an hour. No coding required.
      </p>
      <div className="mt-12 flex items-center justify-center gap-4 w-full max-w-md mx-auto">
        <Link
          href="/signup"
          className="flex-1 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Get Started Free
        </Link>
        <Link
          href="/login"
          className="flex-1 rounded-xl border-2 border-border bg-card px-6 py-4 text-base font-bold text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
