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
      templateId: website.templateId,
      themeSettings: JSON.parse(website.themeSettings),
      status: website.status,
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
