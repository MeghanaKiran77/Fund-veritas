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
      return NextResponse.json({ message: "Ban reason is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection("users")

    // Update user status
    const result = await usersCollection.updateOne(
      { id },
      {
        $set: {
          status: "suspended",
          suspendedAt: new Date(),
          suspendedBy: user.id,
          suspensionReason: reason,
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User banned successfully" })
  } catch (error) {
    console.error("Error banning user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
