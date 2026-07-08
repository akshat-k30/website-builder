import { prisma } from "@/lib/prisma"
import PublishedSiteRenderer from "@/components/PublishedSiteRenderer"

interface PageProps {
  params: Promise<{ subdomain: string }>
}

export default async function PublishedSitePage({ params }: PageProps) {
  const { subdomain } = await params

  const website = await prisma.website.findUnique({
    where: { subdomain },
    include: { user: { select: { name: true } } },
  })

  if (!website || website.status !== "published") {
    return <SiteNotFound subdomain={subdomain} />
  }

  const content = website.userEditedContent
    ? JSON.parse(website.userEditedContent)
    : JSON.parse(website.aiGeneratedContent)

  const themeSettings = JSON.parse(website.themeSettings)
  const templateId = website.templateId || "modern-minimal"

  return (
    <PublishedSiteRenderer
      content={content}
      theme={themeSettings}
      templateId={templateId}
      userName={website.user.name}
    />
  )
}

function SiteNotFound({ subdomain }: { subdomain: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M9.75 15.25S11 17 12 17s2.25-1.75 2.25-1.75" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Site Not Available
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The website at <span className="font-semibold text-slate-700">&quot;{subdomain}&quot;</span> doesn&apos;t exist or has been unpublished by its owner.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Build Your Own Website
        </a>

        <p className="mt-8 text-xs text-slate-400 font-medium">
          Powered by WebsiteBuilder
        </p>
      </div>
    </div>
  )
}
