import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
      id: string
      email: string
      role: string
    }

    // Get wallet address from request
    const { walletAddress } = await req.json()
    if (!walletAddress) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection("users")

    // Update user with wallet address
    const result = await usersCollection.updateOne(
      { id: decoded.id },
      { $set: { walletAddress, updatedAt: new Date().toISOString() } },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get updated user
    const updatedUser = await usersCollection.findOne({ id: decoded.id })

    // Return updated user data
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      kycStatus: updatedUser.kycStatus,
      walletAddress: updatedUser.walletAddress,
      profileImage: updatedUser.profileImage,
      createdAt: updatedUser.createdAt,
    })
  } catch (error) {
    console.error("Connect wallet error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
