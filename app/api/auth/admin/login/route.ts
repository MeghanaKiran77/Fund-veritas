import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection("users")

    // Find admin user
    const user = await usersCollection.findOne({ email, role: "admin" })
    if (!user) {
      return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 })
    }

    // Create JWT token with admin role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: "admin" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" },
    )

    // Create response
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "admin",
      createdAt: user.createdAt,
    })

    // Set cookie with admin token
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
