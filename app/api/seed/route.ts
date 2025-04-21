import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: NextRequest) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Not allowed in production" }, { status: 403 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Clear existing collections
    await db.collection("users").deleteMany({})
    await db.collection("projects").deleteMany({})
    await db.collection("kyc_requests").deleteMany({})

    // Clear Supabase tables
    await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Create users
    const users = await seedUsers(db)

    // Create KYC requests
    const kycRequests = await seedKycRequests(db, users)

    // Create projects
    const projects = await seedProjects(db, users)

    // Create notifications
    const notifications = await seedNotifications(users)

    // Create audit logs
    const auditLogs = await seedAuditLogs(users, projects, kycRequests)

    return NextResponse.json({
      message: "Database seeded successfully",
      stats: {
        users: users.length,
        projects: projects.length,
        kycRequests: kycRequests.length,
        notifications: notifications.length,
        auditLogs: auditLogs.length,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

async function seedUsers(db: any) {
  const usersCollection = db.collection("users")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const adminUser = {
    id: uuidv4(),
    name: "Admin User",
    email: "admin@fundveritas.com",
    password: adminPassword,
    role: "admin",
    kycStatus: "approved",
    status: "active",
    createdAt: new Date(),
    profileImage: "/placeholder.svg?height=200&width=200&text=Admin",
  }

  // Create creator users
  const creators = [
    {
      id: uuidv4(),
      name: "John Creator",
      email: "john@creator.com",
      password: await bcrypt.hash("password123", 10),
      role: "creator",
      kycStatus: "approved",
      status: "active",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      profileImage: "/placeholder.svg?height=200&width=200&text=John",
    },
    {
      id: uuidv4(),
      name: "Sarah Creator",
      email: "sarah@creator.com",
      password: await bcrypt.hash("password123", 10),
      role: "creator",
      kycStatus: "pending",
      status: "active",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      profileImage: "/placeholder.svg?height=200&width=200&text=Sarah",
    },
    {
      id: uuidv4(),
      name: "Michael Creator",
      email: "michael@creator.com",
      password: await bcrypt.hash("password123", 10),
      role: "creator",
      kycStatus: "rejected",
      status: "active",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      walletAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
      profileImage: "/placeholder.svg?height=200&width=200&text=Michael",
    },
  ]

  // Create backer users
  const backers = [
    {
      id: uuidv4(),
      name: "Emily Backer",
      email: "emily@backer.com",
      password: await bcrypt.hash("password123", 10),
      role: "backer",
      kycStatus: "approved",
      status: "active",
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      walletAddress: "0xdef1234567890abcdef1234567890abcdef123456",
      profileImage: "/placeholder.svg?height=200&width=200&text=Emily",
    },
    {
      id: uuidv4(),
      name: "David Backer",
      email: "david@backer.com",
      password: await bcrypt.hash("password123", 10),
      role: "backer",
      kycStatus: "approved",
      status: "active",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      walletAddress: "0x567890abcdef1234567890abcdef1234567890abc",
      profileImage: "/placeholder.svg?height=200&width=200&text=David",
    },
    {
      id: uuidv4(),
      name: "Olivia Backer",
      email: "olivia@backer.com",
      password: await bcrypt.hash("password123", 10),
      role: "backer",
      kycStatus: "pending",
      status: "active",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      walletAddress: "0x90abcdef1234567890abcdef1234567890abcdef1",
      profileImage: "/placeholder.svg?height=200&width=200&text=Olivia",
    },
  ]

  // Create suspended user
  const suspendedUser = {
    id: uuidv4(),
    name: "Suspended User",
    email: "suspended@example.com",
    password: await bcrypt.hash("password123", 10),
    role: "creator",
    kycStatus: "approved",
    status: "suspended",
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
    suspendedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    suspendedBy: adminUser.id,
    suspensionReason: "Multiple violations of platform guidelines",
    walletAddress: "0xef1234567890abcdef1234567890abcdef1234567",
    profileImage: "/placeholder.svg?height=200&width=200&text=Suspended",
  }

  const allUsers = [adminUser, ...creators, ...backers, suspendedUser]
  await usersCollection.insertMany(allUsers)

  return allUsers
}

async function seedKycRequests(db: any, users: any[]) {
  const kycCollection = db.collection("kyc_requests")

  const creatorUsers = users.filter((user) => user.role === "creator")
  const adminUser = users.find((user) => user.role === "admin")

  const kycRequests = []

  // Create KYC requests for each creator
  for (const creator of creatorUsers) {
    const kycRequest = {
      id: `${creator.id}_${Date.now()}`,
      userId: creator.id,
      user: creator.name,
      email: creator.email,
      role: creator.role,
      submittedDate: creator.createdAt,
      status: creator.kycStatus,
      documents: [
        {
          id: uuidv4(),
          name: "Government ID",
          type: "image/jpeg",
          url: "/placeholder.svg?height=300&width=500&text=ID",
        },
        {
          id: uuidv4(),
          name: "Selfie with ID",
          type: "image/jpeg",
          url: "/placeholder.svg?height=300&width=500&text=Selfie",
        },
      ],
    }

    // Add approval/rejection details if applicable
    if (creator.kycStatus === "approved") {
      kycRequest.approvedAt = new Date(creator.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days after submission
      kycRequest.approvedBy = adminUser.id
    } else if (creator.kycStatus === "rejected") {
      kycRequest.rejectedAt = new Date(creator.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days after submission
      kycRequest.rejectedBy = adminUser.id
      kycRequest.rejectionReason = "ID document unclear or expired"
    }

    kycRequests.push(kycRequest)
  }

  await kycCollection.insertMany(kycRequests)

  return kycRequests
}

async function seedProjects(db: any, users: any[]) {
  const projectsCollection = db.collection("projects")

  const creatorUsers = users.filter((user) => user.role === "creator" && user.kycStatus === "approved")
  const adminUser = users.find((user) => user.role === "admin")

  const categories = ["Technology", "Art", "Music", "Environment", "Health", "Education", "Community"]
  const statuses = ["pending", "verified", "flagged"]

  const projects = []

  // Create projects for each approved creator
  for (const creator of creatorUsers) {
    // Create 2-3 projects per creator
    const numProjects = Math.floor(Math.random() * 2) + 2

    for (let i = 0; i < numProjects; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const fundingGoal = Math.floor(Math.random() * 90000) + 10000 // Random between 10k and 100k
      const createdAt = new Date(creator.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days after user creation

      const project = {
        id: uuidv4(),
        title: `${creator.name.split(" ")[0]}'s ${category} Project ${i + 1}`,
        description: `A revolutionary ${category.toLowerCase()} project that aims to change the world.`,
        category,
        fundingGoal,
        currentFunding: status === "verified" ? Math.floor(Math.random() * fundingGoal) : 0,
        creatorId: creator.id,
        creator: creator.name,
        status,
        isPublished: status === "verified",
        createdAt,
        image: `/placeholder.svg?height=400&width=600&text=${category}+Project`,
        documents: [
          { id: uuidv4(), name: "Project Pitch Deck", type: "application/pdf" },
          { id: uuidv4(), name: "Team Information", type: "application/pdf" },
        ],
        milestones: [
          {
            id: uuidv4(),
            title: "Initial Development",
            description: "Complete the initial development phase",
            amount: Math.floor(fundingGoal * 0.3),
            dueDate: new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after project creation
            status: "pending",
          },
          {
            id: uuidv4(),
            title: "Beta Release",
            description: "Release the beta version for testing",
            amount: Math.floor(fundingGoal * 0.3),
            dueDate: new Date(createdAt.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days after project creation
            status: "pending",
          },
          {
            id: uuidv4(),
            title: "Final Release",
            description: "Complete the project and release the final version",
            amount: Math.floor(fundingGoal * 0.4),
            dueDate: new Date(createdAt.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days after project creation
            status: "pending",
          },
        ],
      }

      // Add verification/flagging details if applicable
      if (status === "verified") {
        project.verifiedAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days after creation
        project.verifiedBy = adminUser.id
      } else if (status === "flagged") {
        project.flaggedAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days after creation
        project.flaggedBy = adminUser.id
        project.flagReason = "Insufficient project details and unclear milestone structure"
      }

      projects.push(project)
    }
  }

  await projectsCollection.insertMany(projects)

  return projects
}

async function seedNotifications(users: any[]) {
  // Clear existing notifications
  await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  const notifications = []

  // Create notifications for each user
  for (const user of users) {
    if (user.role === "admin") continue // Skip admin user

    // Welcome notification for everyone
    notifications.push({
      user_id: user.id,
      title: "Welcome to FundVeritas",
      message: "Thank you for joining our decentralized crowdfunding platform.",
      type: "info",
      read: true,
      created_at: user.createdAt.toISOString(),
    })

    // Role-specific notifications
    if (user.role === "creator") {
      // KYC notifications
      if (user.kycStatus === "approved") {
        notifications.push({
          user_id: user.id,
          title: "KYC Verification Approved",
          message: "Your identity verification has been approved. You can now create projects.",
          type: "success",
          read: Math.random() > 0.5, // Randomly mark as read
          created_at: new Date(user.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days after registration
        })
      } else if (user.kycStatus === "rejected") {
        notifications.push({
          user_id: user.id,
          title: "KYC Verification Rejected",
          message: "Your identity verification has been rejected. Reason: ID document unclear or expired.",
          type: "error",
          read: false,
          created_at: new Date(user.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days after registration
        })
      } else if (user.kycStatus === "pending") {
        notifications.push({
          user_id: user.id,
          title: "KYC Verification Submitted",
          message: "Your identity verification has been submitted and is pending review.",
          type: "info",
          read: true,
          created_at: new Date(user.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day after registration
        })
      }

      // Project notifications
      if (user.kycStatus === "approved") {
        notifications.push({
          user_id: user.id,
          title: "New Project Funded",
          message: `Your project received a new funding of $500.`,
          type: "success",
          read: false,
          link: "/dashboard/creator",
          created_at: new Date(user.createdAt.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days after registration
        })

        notifications.push({
          user_id: user.id,
          title: "Milestone Approaching",
          message: "The deadline for your first milestone is in 3 days. Please ensure timely completion.",
          type: "warning",
          read: false,
          link: "/dashboard/creator",
          created_at: new Date(user.createdAt.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days after registration
        })
      }
    } else if (user.role === "backer") {
      // Backer notifications
      notifications.push({
        user_id: user.id,
        title: "Project Update",
        message: "A project you backed has reached its first milestone!",
        type: "info",
        read: Math.random() > 0.5, // Randomly mark as read
        link: "/dashboard/backer",
        created_at: new Date(user.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days after registration
      })

      notifications.push({
        user_id: user.id,
        title: "New Projects Available",
        message: "Check out these new projects that match your interests!",
        type: "info",
        read: false,
        link: "/projects",
        created_at: new Date(user.createdAt.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days after registration
      })
    }

    // Suspension notification for suspended user
    if (user.status === "suspended") {
      notifications.push({
        user_id: user.id,
        title: "Account Suspended",
        message: `Your account has been suspended. Reason: ${user.suspensionReason}`,
        type: "error",
        read: false,
        created_at: user.suspendedAt.toISOString(),
      })
    }
  }

  // Insert notifications
  for (let i = 0; i < notifications.length; i += 10) {
    const batch = notifications.slice(i, i + 10)
    await supabase.from("notifications").insert(batch)
  }

  return notifications
}

async function seedAuditLogs(users: any[], projects: any[], kycRequests: any[]) {
  // Clear existing audit logs
  await supabase.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  const adminUser = users.find((user) => user.role === "admin")
  const auditLogs = []

  // User registration logs
  for (const user of users) {
    auditLogs.push({
      user_id: "system",
      action: "user_register",
      entity_type: "user",
      entity_id: user.id,
      details: { name: user.name, email: user.email, role: user.role },
      ip_address: "192.168.1." + Math.floor(Math.random() * 255),
      created_at: user.createdAt.toISOString(),
    })
  }

  // KYC logs
  for (const kyc of kycRequests) {
    // KYC submission
    auditLogs.push({
      user_id: kyc.userId,
      action: "kyc_submit",
      entity_type: "kyc",
      entity_id: kyc.id,
      details: { user: kyc.user, email: kyc.email },
      ip_address: "192.168.1." + Math.floor(Math.random() * 255),
      created_at: kyc.submittedDate.toISOString(),
    })

    // KYC approval/rejection
    if (kyc.status === "approved" && kyc.approvedAt) {
      auditLogs.push({
        user_id: adminUser.id,
        action: "kyc_approve",
        entity_type: "kyc",
        entity_id: kyc.id,
        details: { user: kyc.user, email: kyc.email },
        ip_address: "192.168.1." + Math.floor(Math.random() * 255),
        created_at: kyc.approvedAt.toISOString(),
      })
    } else if (kyc.status === "rejected" && kyc.rejectedAt) {
      auditLogs.push({
        user_id: adminUser.id,
        action: "kyc_reject",
        entity_type: "kyc",
        entity_id: kyc.id,
        details: { user: kyc.user, email: kyc.email, reason: kyc.rejectionReason },
        ip_address: "192.168.1." + Math.floor(Math.random() * 255),
        created_at: kyc.rejectedAt.toISOString(),
      })
    }
  }

  // Project logs
  for (const project of projects) {
    // Project creation
    auditLogs.push({
      user_id: project.creatorId,
      action: "project_create",
      entity_type: "project",
      entity_id: project.id,
      details: { title: project.title, category: project.category, fundingGoal: project.fundingGoal },
      ip_address: "192.168.1." + Math.floor(Math.random() * 255),
      created_at: project.createdAt.toISOString(),
    })

    // Project verification/flagging
    if (project.status === "verified" && project.verifiedAt) {
      auditLogs.push({
        user_id: adminUser.id,
        action: "project_verify",
        entity_type: "project",
        entity_id: project.id,
        details: { title: project.title, creator: project.creator },
        ip_address: "192.168.1." + Math.floor(Math.random() * 255),
        created_at: project.verifiedAt.toISOString(),
      })
    } else if (project.status === "flagged" && project.flaggedAt) {
      auditLogs.push({
        user_id: adminUser.id,
        action: "project_flag",
        entity_type: "project",
        entity_id: project.id,
        details: { title: project.title, creator: project.creator, reason: project.flagReason },
        ip_address: "192.168.1." + Math.floor(Math.random() * 255),
        created_at: project.flaggedAt.toISOString(),
      })
    }

    // Project funding (for verified projects)
    if (project.status === "verified" && project.currentFunding > 0) {
      const backers = users.filter((user) => user.role === "backer" && user.kycStatus === "approved")

      // Create 1-3 funding events
      const numFundings = Math.floor(Math.random() * 3) + 1
      let remainingFunding = project.currentFunding

      for (let i = 0; i < numFundings && remainingFunding > 0; i++) {
        const backer = backers[Math.floor(Math.random() * backers.length)]
        const amount = i === numFundings - 1 ? remainingFunding : Math.floor(Math.random() * remainingFunding * 0.7)
        remainingFunding -= amount

        auditLogs.push({
          user_id: backer.id,
          action: "project_fund",
          entity_type: "project",
          entity_id: project.id,
          details: {
            title: project.title,
            creator: project.creator,
            amount,
            backer: backer.name,
          },
          ip_address: "192.168.1." + Math.floor(Math.random() * 255),
          created_at: new Date(project.verifiedAt.getTime() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(), // 1-3 days after verification
        })
      }
    }
  }

  // Admin login logs
  for (let i = 0; i < 5; i++) {
    auditLogs.push({
      user_id: adminUser.id,
      action: "admin_login",
      entity_type: "user",
      entity_id: adminUser.id,
      details: { email: adminUser.email },
      ip_address: "192.168.1." + Math.floor(Math.random() * 255),
      created_at: new Date(Date.now() - (5 - i) * 24 * 60 * 60 * 1000).toISOString(), // Last 5 days
    })
  }

  // Suspension log for suspended user
  const suspendedUser = users.find((user) => user.status === "suspended")
  if (suspendedUser) {
    auditLogs.push({
      user_id: adminUser.id,
      action: "user_ban",
      entity_type: "user",
      entity_id: suspendedUser.id,
      details: {
        name: suspendedUser.name,
        email: suspendedUser.email,
        reason: suspendedUser.suspensionReason,
      },
      ip_address: "192.168.1." + Math.floor(Math.random() * 255),
      created_at: suspendedUser.suspendedAt.toISOString(),
    })
  }

  // Insert audit logs in batches to avoid request size limits
  for (let i = 0; i < auditLogs.length; i += 10) {
    const batch = auditLogs.slice(i, i + 10)
    await supabase.from("audit_logs").insert(batch)
  }

  return auditLogs
}
