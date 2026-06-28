import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateWebsiteContent } from "@/lib/ai"

// POST /api/generate-content — Generate website content from LinkedIn profile
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch LinkedIn profile
    const linkedinProfile = await prisma.linkedInProfile.findUnique({
      where: { userId: user.id },
    })

    if (!linkedinProfile) {
      return NextResponse.json(
        { error: "No LinkedIn profile found. Please upload your LinkedIn PDF first." },
        { status: 400 }
      )
    }

    // Generate content via AI
    const content = await generateWebsiteContent({
      name: linkedinProfile.parsedName,
      headline: linkedinProfile.parsedHeadline,
      location: linkedinProfile.parsedLocation,
      summary: linkedinProfile.parsedSummary,
      experience: JSON.parse(linkedinProfile.parsedExperience),
      education: JSON.parse(linkedinProfile.parsedEducation),
      skills: JSON.parse(linkedinProfile.parsedSkills),
      linkedinUrl: linkedinProfile.linkedinUrl || undefined,
    })

    // Upsert the website record
    const website = await prisma.website.upsert({
      where: { userId: user.id },
      update: {
        aiGeneratedContent: JSON.stringify(content),
        userEditedContent: null, // Reset edits on regenerate
      },
      create: {
        userId: user.id,
        aiGeneratedContent: JSON.stringify(content),
      },
    })

    return NextResponse.json({
      success: true,
      websiteId: website.id,
      content,
    })
  } catch (error) {
    console.error("Generate content error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to generate content"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// GET /api/generate-content — Fetch existing generated content
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const website = await prisma.website.findUnique({
      where: { userId: user.id },
    })

    if (!website) {
      return NextResponse.json({ error: "No content generated yet" }, { status: 404 })
    }

    return NextResponse.json({
      websiteId: website.id,
      content: website.userEditedContent
        ? JSON.parse(website.userEditedContent)
        : JSON.parse(website.aiGeneratedContent),
      aiContent: JSON.parse(website.aiGeneratedContent),
      hasEdits: !!website.userEditedContent,
      status: website.status,
      updatedAt: website.updatedAt,
    })
  } catch (error) {
    console.error("Get content error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT /api/generate-content — Save user edits to generated content
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    const website = await prisma.website.update({
      where: { userId: user.id },
      data: {
        userEditedContent: JSON.stringify(content),
      },
    })

    return NextResponse.json({
      success: true,
      websiteId: website.id,
      content: JSON.parse(website.userEditedContent!),
      updatedAt: website.updatedAt,
    })
  } catch (error) {
    console.error("Update content error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
