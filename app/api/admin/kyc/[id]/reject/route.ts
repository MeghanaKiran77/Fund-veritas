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
      return NextResponse.json({ message: "Rejection reason is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const kycCollection = db.collection("kyc_requests")

    // Update KYC status
    const result = await kycCollection.updateOne(
      { id },
      {
        $set: {
          status: "rejected",
          rejectedAt: new Date(),
          rejectedBy: user.id,
          rejectionReason: reason,
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "KYC request not found" }, { status: 404 })
    }

    // Update user's KYC status
    const usersCollection = db.collection("users")
    await usersCollection.updateOne(
      { id: id.split("_")[0] }, // Assuming KYC ID format is "userId_timestamp"
      { $set: { kycStatus: "rejected" } },
    )

    return NextResponse.json({ message: "KYC request rejected successfully" })
  } catch (error) {
    console.error("Error rejecting KYC:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
