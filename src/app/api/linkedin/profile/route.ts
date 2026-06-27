import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/linkedin/profile — fetch the current user's LinkedIn profile
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

    const profile = await prisma.linkedInProfile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        linkedinUrl: profile.linkedinUrl,
        name: profile.parsedName,
        headline: profile.parsedHeadline,
        location: profile.parsedLocation,
        summary: profile.parsedSummary,
        experience: JSON.parse(profile.parsedExperience),
        education: JSON.parse(profile.parsedEducation),
        skills: JSON.parse(profile.parsedSkills),
        updatedAt: profile.updatedAt,
      },
    })
  } catch (error) {
    console.error("Get LinkedIn profile error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT /api/linkedin/profile — update the current user's parsed profile data
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
    const { name, headline, location, summary, experience, education, skills } =
      body

    const profile = await prisma.linkedInProfile.update({
      where: { userId: user.id },
      data: {
        parsedName: name ?? undefined,
        parsedHeadline: headline ?? undefined,
        parsedLocation: location ?? undefined,
        parsedSummary: summary ?? undefined,
        parsedExperience: experience
          ? JSON.stringify(experience)
          : undefined,
        parsedEducation: education
          ? JSON.stringify(education)
          : undefined,
        parsedSkills: skills ? JSON.stringify(skills) : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        name: profile.parsedName,
        headline: profile.parsedHeadline,
        location: profile.parsedLocation,
        summary: profile.parsedSummary,
        experience: JSON.parse(profile.parsedExperience),
        education: JSON.parse(profile.parsedEducation),
        skills: JSON.parse(profile.parsedSkills),
        updatedAt: profile.updatedAt,
      },
    })
  } catch (error) {
    console.error("Update LinkedIn profile error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
