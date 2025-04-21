import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const user = await getAuthUser(req)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Get user stats
    const usersCollection = db.collection("users")
    const totalUsers = await usersCollection.countDocuments()
    const creators = await usersCollection.countDocuments({ role: "creator" })
    const backers = await usersCollection.countDocuments({ role: "backer" })
    const admins = await usersCollection.countDocuments({ role: "admin" })
    const pendingKyc = await usersCollection.countDocuments({ kycStatus: "pending" })

    // Get project stats
    const projectsCollection = db.collection("projects")
    const totalProjects = await projectsCollection.countDocuments()
    const pendingProjects = await projectsCollection.countDocuments({ status: "pending" })
    const verifiedProjects = await projectsCollection.countDocuments({ status: "verified" })
    const flaggedProjects = await projectsCollection.countDocuments({ status: "flagged" })

    // Calculate total funding
    const projects = await projectsCollection.find({ status: "verified" }).toArray()
    const totalFunding = projects.reduce((sum, project) => sum + (project.currentFunding || 0), 0)

    return NextResponse.json({
      users: {
        total: totalUsers,
        creators,
        backers,
        admins,
        pendingKyc,
      },
      projects: {
        total: totalProjects,
        pending: pendingProjects,
        verified: verifiedProjects,
        flagged: flaggedProjects,
        totalFunding,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
