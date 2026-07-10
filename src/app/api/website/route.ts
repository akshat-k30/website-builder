import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    const { website } = user
    const content = website.userEditedContent
      ? JSON.parse(website.userEditedContent)
      : JSON.parse(website.aiGeneratedContent)

    return NextResponse.json({
      websiteId: website.id,
      content,
      aiContent: JSON.parse(website.aiGeneratedContent),
      templateId: website.templateId,
      themeSettings: JSON.parse(website.themeSettings),
      status: website.status,
      subdomain: website.subdomain,
      publishedUrl: website.publishedUrl,
      publishedAt: website.publishedAt,
    })
  } catch (error) {
    console.error("Get website error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

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
    const { content, templateId, themeSettings } = body

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    if (content) updateData.userEditedContent = JSON.stringify(content)
    if (templateId) updateData.templateId = templateId
    if (themeSettings) updateData.themeSettings = JSON.stringify(themeSettings)

    const website = await prisma.website.update({
      where: { userId: user.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      websiteId: website.id,
    })
  } catch (error) {
    console.error("Update website error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(_request: Request) {
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

    // Delete both website and linked in profile using a transaction
    await prisma.$transaction(async (tx) => {
      // First delete the website if it exists
      await tx.website.deleteMany({
        where: { userId: user.id },
      })
      // Then delete the LinkedIn profile if it exists
      await tx.linkedInProfile.deleteMany({
        where: { userId: user.id },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete website error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
