import { type NextRequest, NextResponse } from "next/server"
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

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Sample notifications
    const notifications = [
      {
        user_id: userId,
        title: "Welcome to FundVeritas",
        message: "Thank you for joining our decentralized crowdfunding platform.",
        type: "info",
        read: false,
      },
      {
        user_id: userId,
        title: "KYC Verification Approved",
        message: "Your identity verification has been approved. You can now create projects.",
        type: "success",
        read: false,
      },
      {
        user_id: userId,
        title: "New Project Funded",
        message: "Your project 'Eco-friendly Water Purifier' received a new funding of $500.",
        type: "success",
        read: false,
        link: "/projects/123",
      },
      {
        user_id: userId,
        title: "Milestone Approaching",
        message: "The deadline for your first milestone is in 3 days. Please ensure timely completion.",
        type: "warning",
        read: false,
        link: "/dashboard/creator/milestones",
      },
      {
        user_id: userId,
        title: "Dispute Resolution",
        message: "A dispute has been raised for your project 'Smart Home IoT Device'.",
        type: "error",
        read: false,
        link: "/dashboard/creator/disputes",
      },
    ]

    // Insert notifications
    const { error } = await supabase.from("notifications").insert(notifications)

    if (error) {
      console.error("Error seeding notifications:", error)
      return NextResponse.json({ message: "Failed to seed notifications" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Sample notifications created successfully",
      count: notifications.length,
    })
  } catch (error) {
    console.error("Error seeding notifications:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
