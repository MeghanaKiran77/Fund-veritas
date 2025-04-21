import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"
import { v4 as uuidv4 } from "uuid"

// GET all projects with filtering
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const minFunding = searchParams.get("minFunding")
    const maxFunding = searchParams.get("maxFunding")
    const sort = searchParams.get("sort") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const projectsCollection = db.collection("projects")

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (status) {
      query.status = status
    }

    if (minFunding || maxFunding) {
      query.fundingGoal = {}
      if (minFunding) query.fundingGoal.$gte = Number.parseInt(minFunding)
      if (maxFunding) query.fundingGoal.$lte = Number.parseInt(maxFunding)
    }

    // Build sort
    const sortOptions: any = {}
    switch (sort) {
      case "newest":
        sortOptions.createdAt = -1
        break
      case "oldest":
        sortOptions.createdAt = 1
        break
      case "most-funded":
        sortOptions.currentFunding = -1
        break
      case "ending-soon":
        sortOptions.deadline = 1
        break
      default:
        sortOptions.createdAt = -1
    }

    // Get total count for pagination
    const total = await projectsCollection.countDocuments(query)

    // Get projects
    const projects = await projectsCollection
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST create a new project
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Only creators can create projects
    if (user.role !== "creator") {
      return NextResponse.json({ message: "Only creators can create projects" }, { status: 403 })
    }

    // Check if user has completed KYC
    if (user.kycStatus !== "approved") {
      return NextResponse.json({ message: "KYC verification required to create projects" }, { status: 403 })
    }

    // Get project data
    const projectData = await req.json()
    const { title, description, category, fundingGoal, deadline, milestones, tags, media, contractAddress } =
      projectData

    // Validate required fields
    if (!title || !description || !category || !fundingGoal || !deadline || !milestones || milestones.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate milestones total percentage
    const totalPercentage = milestones.reduce((sum: number, milestone: any) => sum + milestone.fundingPercentage, 0)
    if (totalPercentage !== 100) {
      return NextResponse.json({ message: "Milestone funding percentages must total 100%" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const projectsCollection = db.collection("projects")

    // Create project
    const projectId = uuidv4()
    const newProject = {
      id: projectId,
      title,
      description,
      category,
      fundingGoal,
      currentFunding: 0,
      backers: 0,
      deadline,
      milestones: milestones.map((milestone: any, index: number) => ({
        id: uuidv4(),
        title: milestone.title,
        description: milestone.description,
        deadline: milestone.deadline,
        fundingPercentage: milestone.fundingPercentage,
        status: index === 0 ? "in-progress" : "pending",
        completionPercentage: 0,
      })),
      tags: tags || [],
      media: media || [],
      contractAddress,
      creatorId: user.id,
      creatorName: user.name,
      status: "pending", // Pending admin approval
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await projectsCollection.insertOne(newProject)

    // Create notification for admin
    const notificationsCollection = db.collection("notifications")
    await notificationsCollection.insertOne({
      id: uuidv4(),
      userId: "admin", // Admin user ID
      title: "New Project Submission",
      message: `${user.name} has submitted a new project: ${title}`,
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
      link: `/admin/projects/${projectId}`,
    })

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
