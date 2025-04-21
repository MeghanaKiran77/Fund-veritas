import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Not allowed in production" }, { status: 403 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@fundveritas.com" })
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin user already exists" })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const adminUser = {
      id: uuidv4(),
      name: "Admin User",
      email: "admin@fundveritas.com",
      password: hashedPassword,
      role: "admin",
      kycStatus: "approved",
      status: "active",
      createdAt: new Date(),
    }

    await usersCollection.insertOne(adminUser)

    return NextResponse.json({
      message: "Admin user created successfully",
      credentials: {
        email: "admin@fundveritas.com",
        password: "admin123", // This would be hidden in a real app
      },
    })
  } catch (error) {
    console.error("Error seeding admin user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
