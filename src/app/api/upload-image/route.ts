import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
}

/**
 * POST /api/upload-image — uploads a profile image to S3 and returns its URL.
 * Falls back to a data URL only when S3 isn't configured (local dev), so the
 * app keeps working without AWS credentials.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const bucketName = process.env.AWS_S3_BUCKET_NAME
    const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN

    if (
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      bucketName &&
      cloudfrontDomain
    ) {
      const ext = EXT[file.type] || "jpg"
      const key = `uploads/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

      const s3 = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          CacheControl: "public, max-age=31536000, immutable",
        })
      )

      const url = `${cloudfrontDomain.replace(/\/$/, "")}/${key}`
      return NextResponse.json({ url })
    }

    // No S3 configured — fall back to a data URL so local dev still works.
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`
    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
