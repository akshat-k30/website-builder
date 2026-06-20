import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE /api/groups/[id]/members/[memberId] — Remove a member (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
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

    const { id, memberId } = await params

    // Check if the current user is an admin of this group
    const currentMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId: user.id,
        },
      },
    })

    if (!currentMembership || currentMembership.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can remove members" },
        { status: 403 }
      )
    }

    // Find the member to remove
    const memberToRemove = await prisma.groupMember.findUnique({
      where: { id: memberId },
    })

    if (!memberToRemove || memberToRemove.groupId !== id) {
      return NextResponse.json(
        { error: "Member not found in this group" },
        { status: 404 }
      )
    }

    // Don't allow admins to remove themselves
    if (memberToRemove.userId === user.id) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the group" },
        { status: 400 }
      )
    }

    await prisma.groupMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ message: "Member removed successfully" })
  } catch (error) {
    console.error("Remove member error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
