import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/publish/check?subdomain=xyz — Check if a subdomain is available
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subdomain = searchParams.get("subdomain")

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomain parameter is required" },
        { status: 400 }
      )
    }

    const normalizedSubdomain = subdomain.toLowerCase().trim()

    // Validate format
    const isValid = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(normalizedSubdomain)
    if (!isValid) {
      return NextResponse.json({
        available: false,
        reason: "Invalid format. Use 3-30 characters: lowercase letters, numbers, and hyphens.",
      })
    }

    // Check if it's taken by another user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    const existing = await prisma.website.findUnique({
      where: { subdomain: normalizedSubdomain },
    })

    const available = !existing || (user && existing.userId === user.id)

    return NextResponse.json({
      available,
      reason: available ? null : "This address is already taken.",
    })
  } catch (error) {
    console.error("Check subdomain error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
