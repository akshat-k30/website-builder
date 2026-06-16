import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Your LinkedIn Profile
        <br />
        <span className="text-blue-600 dark:text-blue-400">
          Becomes a Website
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Paste your LinkedIn URL, let AI generate professional website content,
        pick a template, and publish — all in under an hour. No coding required.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Link
          href="/signup"
          className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Get Started Free
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
