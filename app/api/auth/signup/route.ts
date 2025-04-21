import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (!["backer", "creator"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const userId = uuidv4()
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role,
      kycStatus: "not_submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await usersCollection.insertOne(newUser)

    // Create JWT token
    const token = jwt.sign({ id: userId, email, role }, process.env.JWT_SECRET || "default_secret", { expiresIn: "7d" })

    // Create response
    const response = NextResponse.json(
      {
        id: userId,
        name,
        email,
        role,
        kycStatus: "not_submitted",
        createdAt: newUser.createdAt,
      },
      { status: 201 },
    )

    // Set cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
