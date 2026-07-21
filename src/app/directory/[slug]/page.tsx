import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import DirectorySearch from "@/components/DirectorySearch"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const group = await prisma.group.findUnique({
    where: { slug },
    select: { name: true, description: true },
  })

  if (!group) {
    return { title: "Directory Not Found" }
  }

  return {
    title: `${group.name} — Group Directory | Profilio`,
    description: group.description || `Browse the published portfolio websites of ${group.name} members.`,
  }
}

export default async function DirectoryPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch group by slug
  const group = await prisma.group.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdBy: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              website: {
                select: {
                  subdomain: true,
                  publishedUrl: true,
                  status: true,
                  templateId: true,
                  aiGeneratedContent: true,
                  userEditedContent: true,
                },
              },
              linkedinProfile: {
                select: {
                  parsedHeadline: true,
                  parsedSkills: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!group) {
    notFound()
  }

  // Filter to only members with published websites
  const members = group.createdBy
    .filter((m) => m.user.website?.status === "published" && m.user.website?.subdomain)
    .map((m) => {
      const website = m.user.website!
      const content = website.userEditedContent
        ? JSON.parse(website.userEditedContent)
        : JSON.parse(website.aiGeneratedContent)

      let skills: string[] = []
      try {
        const parsed = JSON.parse(m.user.linkedinProfile?.parsedSkills || "[]")
        skills = Array.isArray(parsed) ? parsed.slice(0, 6) : []
      } catch {
        skills = []
      }

      return {
        name: m.user.name,
        headline: m.user.linkedinProfile?.parsedHeadline || content?.hero?.tagline || "",
        skills,
        subdomain: website.subdomain!,
        templateId: website.templateId || "modern-minimal",
        tagline: content?.hero?.tagline || "",
        cloudfrontDomain: process.env.CLOUDFRONT_DOMAIN || null,
      }
    })

  const totalMembers = group.createdBy.length

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#eef2fa",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #4361ee 0%, #3730a3 50%, #1e1b4b 100%)",
        padding: "80px 24px 72px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />
        <div style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />
        <div style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }} />

        <div style={{
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center" as const,
          position: "relative",
          zIndex: 1,
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            padding: "8px 18px",
            borderRadius: 100,
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.02em",
            }}>
              Group Directory
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}>
            {group.name}
          </h1>

          {/* Description */}
          {group.description && (
            <p style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "rgba(255,255,255,0.7)",
              margin: "0 0 28px",
              lineHeight: 1.6,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              {group.description}
            </p>
          )}

          {/* Stats */}
          <div style={{
            display: "inline-flex",
            gap: 32,
            alignItems: "center",
          }}>
            <div style={{ textAlign: "center" as const }}>
              <div style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1,
              }}>
                {totalMembers}
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
                marginTop: 4,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
              }}>
                Members
              </div>
            </div>
            <div style={{
              width: 1,
              height: 36,
              backgroundColor: "rgba(255,255,255,0.15)",
            }} />
            <div style={{ textAlign: "center" as const }}>
              <div style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1,
              }}>
                {members.length}
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
                marginTop: 4,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
              }}>
                Published
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}>
        <DirectorySearch members={members} groupName={group.name} />
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center" as const,
        padding: "24px",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
      }}>
        <p style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#94a3b8",
          margin: 0,
          letterSpacing: "0.03em",
        }}>
          Powered by{" "}
          <span
            style={{
              color: "#4361ee",
              fontWeight: 700,
            }}
          >
            Profilio
          </span>
        </p>
      </div>
    </div>
  )
}
