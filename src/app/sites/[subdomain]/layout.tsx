import { prisma } from "@/lib/prisma"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ subdomain: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params

  const website = await prisma.website.findUnique({
    where: { subdomain },
    include: { user: { select: { name: true } } },
  })

  if (!website || website.status !== "published") {
    return {
      title: "Site Not Found",
      description: "This website is not available.",
    }
  }

  const content = website.userEditedContent
    ? JSON.parse(website.userEditedContent)
    : JSON.parse(website.aiGeneratedContent)

  return {
    title: `${content.hero?.name || website.user.name} — Personal Website`,
    description: content.hero?.tagline || `${website.user.name}'s personal website`,
  }
}

/**
 * Minimal layout for published sites — no Navbar, no SessionProvider, no platform chrome.
 * Just the raw template rendered full-screen.
 */
export default async function PublishedSiteLayout({ children }: LayoutProps) {
  return <>{children}</>
}
