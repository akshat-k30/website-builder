import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/groups/[id]/directory — Public endpoint (no auth)
// Returns group info + members who have published websites
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const group = await prisma.group.findUnique({
      where: { id },
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
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    // Filter to only members with published websites
    const members = group.createdBy
      .filter((m) => m.user.website?.status === "published" && m.user.website?.subdomain)
      .map((m) => {
        const website = m.user.website!
        const content = website.userEditedContent
          ? JSON.parse(website.userEditedContent)
          : JSON.parse(website.aiGeneratedContent)

        // Parse skills from LinkedIn profile
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
          subdomain: website.subdomain,
          templateId: website.templateId || "modern-minimal",
          tagline: content?.hero?.tagline || "",
        }
      })

    return NextResponse.json({
      group: {
        id: group.id,
        name: group.name,
        slug: group.slug,
        description: group.description,
        totalMembers: group.createdBy.length,
        publishedCount: members.length,
      },
      members,
    })
  } catch (error) {
    console.error("Directory API error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
