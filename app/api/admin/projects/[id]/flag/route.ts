import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const user = await getAuthUser(req)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { reason } = await req.json()

    if (!reason) {
      return NextResponse.json({ message: "Flag reason is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const projectsCollection = db.collection("projects")

    // Update project status
    const result = await projectsCollection.updateOne(
      { id },
      {
        $set: {
          status: "flagged",
          flaggedAt: new Date(),
          flaggedBy: user.id,
          flagReason: reason,
          isPublished: false,
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project flagged successfully" })
  } catch (error) {
    console.error("Error flagging project:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
