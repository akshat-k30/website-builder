import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// POST /api/groups — Create a new group
export async function POST(request: Request) {
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

    const { name, description } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      )
    }

    // Generate unique slug
    let slug = slugify(name)
    const existingSlug = await prisma.group.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.group.findUnique({ where: { inviteCode } })
      if (!existing) break
      inviteCode = generateInviteCode()
      attempts++
    }

    // Create group + add creator as admin member in a transaction
    const group = await prisma.$transaction(async (tx) => {
      const newGroup = await tx.group.create({
        data: {
          name: name.trim(),
          slug,
          description: description?.trim() || "",
          inviteCode,
          createdById: user.id,
        },
      })

      await tx.groupMember.create({
        data: {
          groupId: newGroup.id,
          userId: user.id,
          role: "admin",
        },
      })

      return newGroup
    })

    return NextResponse.json({ group }, { status: 201 })
  } catch (error) {
    console.error("Create group error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// GET /api/groups — List groups the current user belongs to
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

    const memberships = await prisma.groupMember.findMany({
      where: { userId: user.id },
      include: {
        group: {
          include: {
            _count: {
              select: { createdBy: true },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    })

    const groups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      slug: m.group.slug,
      description: m.group.description,
      role: m.role,
      memberCount: m.group._count.createdBy,
      joinedAt: m.joinedAt,
    }))

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("List groups error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
