import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"

export async function GET(req: NextRequest) {
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

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection("users")

    // Find user
    const user = await usersCollection.findOne({ id: decoded.id })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return user data
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus,
      walletAddress: user.walletAddress,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
