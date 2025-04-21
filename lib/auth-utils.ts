import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "./mongodb"

interface AuthUser {
  id: string
  email: string
  name: string
  role: "admin" | "creator" | "backer"
}

/**
 * Gets the authenticated user from the request
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    // Check for admin token first
    const adminToken = req.cookies.get("admin_token")?.value
    if (adminToken) {
      const secret = process.env.JWT_SECRET || "default_secret"
      const decoded = jwt.verify(adminToken, secret) as any

      if (decoded && decoded.role === "admin") {
        return {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name || "Admin User",
          role: "admin",
        }
      }
    }

    // Check for regular user token
    const token = req.cookies.get("token")?.value
    if (!token) {
      return null
    }

    const secret = process.env.JWT_SECRET || "default_secret"
    const decoded = jwt.verify(token, secret) as any

    if (!decoded || !decoded.id) {
      return null
    }

    // Get user from database to ensure they exist and are active
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ id: decoded.id })
    if (!user) {
      return null
    }

    // Check if user is suspended
    if (user.status === "suspended") {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Error getting auth user:", error)
    return null
  }
}

/**
 * Creates a JWT token for a user
 */
export function createToken(user: { id: string; email: string; role: string }): string {
  const secret = process.env.JWT_SECRET || "default_secret"
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: "7d" })
}
