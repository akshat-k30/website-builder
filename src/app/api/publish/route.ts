import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Validate subdomain format: 3-30 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphens
function isValidSubdomain(subdomain: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(subdomain)
}

/**
 * POST /api/publish — Publish a website with a chosen subdomain
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { website: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.website) {
      return NextResponse.json(
        { error: "No website found. Generate your website content first." },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { subdomain } = body

    if (!subdomain || typeof subdomain !== "string") {
      return NextResponse.json(
        { error: "Subdomain is required" },
        { status: 400 }
      )
    }

    const normalizedSubdomain = subdomain.toLowerCase().trim()

    if (!isValidSubdomain(normalizedSubdomain)) {
      return NextResponse.json(
        {
          error:
            "Invalid subdomain. Use 3-30 characters: lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.",
        },
        { status: 400 }
      )
    }

    // Check if subdomain is already taken by another user
    const existing = await prisma.website.findUnique({
      where: { subdomain: normalizedSubdomain },
    })

    if (existing && existing.userId !== user.id) {
      return NextResponse.json(
        { error: "This address is already taken. Please choose another." },
        { status: 409 }
      )
    }

    // Build the published URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const publishedUrl = `${baseUrl}/sites/${normalizedSubdomain}`

    // Update website to published
    const website = await prisma.website.update({
      where: { userId: user.id },
      data: {
        subdomain: normalizedSubdomain,
        publishedUrl,
        publishedAt: new Date(),
        status: "published",
      },
    })

    return NextResponse.json({
      success: true,
      subdomain: normalizedSubdomain,
      publishedUrl,
      publishedAt: website.publishedAt,
    })
  } catch (error) {
    console.error("Publish error:", error)
    return NextResponse.json(
      { error: "Something went wrong while publishing" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/publish — Unpublish a website
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { website: true },
    })

    if (!user || !user.website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 })
    }

    if (user.website.status !== "published") {
      return NextResponse.json(
        { error: "Website is not currently published" },
        { status: 400 }
      )
    }

    await prisma.website.update({
      where: { userId: user.id },
      data: {
        subdomain: null,
        publishedUrl: null,
        publishedAt: null,
        status: "draft",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unpublish error:", error)
    return NextResponse.json(
      { error: "Something went wrong while unpublishing" },
      { status: 500 }
    )
  }
}
