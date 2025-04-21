import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"

// GET a specific project
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const projectsCollection = db.collection("projects")

    // Find project
    const project = await projectsCollection.findOne({ id: projectId })
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT update a project
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // Get authenticated user
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const projectsCollection = db.collection("projects")

    // Find project
    const project = await projectsCollection.findOne({ id: projectId })
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Check if user is the creator or admin
    if (project.creatorId !== user.id && user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get update data
    const updateData = await req.json()

    // Prevent updating certain fields
    delete updateData.id
    delete updateData.creatorId
    delete updateData.creatorName
    delete updateData.createdAt

    // Update project
    const result = await projectsCollection.updateOne(
      { id: projectId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Get updated project
    const updatedProject = await projectsCollection.findOne({ id: projectId })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a project
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // Get authenticated user
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const projectsCollection = db.collection("projects")

    // Find project
    const project = await projectsCollection.findOne({ id: projectId })
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Only creator or admin can delete
    if (project.creatorId !== user.id && user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Delete project
    await projectsCollection.deleteOne({ id: projectId })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
