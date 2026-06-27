import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseLinkedInPDF } from "@/lib/parse-linkedin-pdf"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    // Auth check
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

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get("pdf") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please select a PDF file." },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF file." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Convert to Uint8Array and parse
    const arrayBuffer = await file.arrayBuffer()
    const pdfBuffer = new Uint8Array(arrayBuffer)

    const parsed = await parseLinkedInPDF(pdfBuffer)

    // Upsert the LinkedIn profile (one per user)
    const profile = await prisma.linkedInProfile.upsert({
      where: { userId: user.id },
      update: {
        linkedinUrl: parsed.linkedinUrl,
        rawText: `${parsed.name}\n${parsed.headline}\n${parsed.summary}`,
        parsedName: parsed.name,
        parsedHeadline: parsed.headline,
        parsedLocation: parsed.location,
        parsedSummary: parsed.summary,
        parsedExperience: JSON.stringify(parsed.experience),
        parsedEducation: JSON.stringify(parsed.education),
        parsedSkills: JSON.stringify(parsed.skills),
      },
      create: {
        userId: user.id,
        linkedinUrl: parsed.linkedinUrl,
        rawText: `${parsed.name}\n${parsed.headline}\n${parsed.summary}`,
        parsedName: parsed.name,
        parsedHeadline: parsed.headline,
        parsedLocation: parsed.location,
        parsedSummary: parsed.summary,
        parsedExperience: JSON.stringify(parsed.experience),
        parsedEducation: JSON.stringify(parsed.education),
        parsedSkills: JSON.stringify(parsed.skills),
      },
    })

    return NextResponse.json({
      success: true,
      profileId: profile.id,
      data: parsed,
    })
  } catch (error) {
    console.error("LinkedIn PDF upload error:", error)
    return NextResponse.json(
      { error: "Failed to parse PDF. Please make sure it's a valid LinkedIn PDF export." },
      { status: 500 }
    )
  }
}
