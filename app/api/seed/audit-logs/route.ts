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

    // Sample audit logs
    const auditLogs = [
      {
        user_id: "admin",
        action: "user_ban",
        entity_type: "user",
        entity_id: "user123",
        details: { reason: "Violation of platform terms" },
        ip_address: "192.168.1.1",
      },
      {
        user_id: "admin",
        action: "kyc_approve",
        entity_type: "kyc",
        entity_id: "kyc123",
        details: { user: "John Doe", email: "john@example.com" },
        ip_address: "192.168.1.1",
      },
      {
        user_id: "admin",
        action: "project_verify",
        entity_type: "project",
        entity_id: "proj123",
        details: { title: "Eco-friendly Water Purifier", creator: "Green Innovations" },
        ip_address: "192.168.1.1",
      },
      {
        user_id: "user456",
        action: "project_create",
        entity_type: "project",
        entity_id: "proj456",
        details: { title: "Smart Home IoT Device", fundingGoal: 50000 },
        ip_address: "192.168.1.2",
      },
      {
        user_id: "user789",
        action: "project_fund",
        entity_type: "project",
        entity_id: "proj123",
        details: { amount: 500, currency: "USD" },
        ip_address: "192.168.1.3",
      },
      {
        user_id: "system",
        action: "milestone_release",
        entity_type: "milestone",
        entity_id: "mile123",
        details: { project: "Eco-friendly Water Purifier", amount: 10000 },
        ip_address: "system",
      },
      {
        user_id: "user456",
        action: "dispute_create",
        entity_type: "dispute",
        entity_id: "disp123",
        details: { project: "Smart Home IoT Device", reason: "Missed milestone deadline" },
        ip_address: "192.168.1.2",
      },
      {
        user_id: "admin",
        action: "dispute_resolve",
        entity_type: "dispute",
        entity_id: "disp123",
        details: { resolution: "Partial refund", amount: 2500 },
        ip_address: "192.168.1.1",
      },
    ]

    // Insert audit logs
    const { error } = await supabase.from("audit_logs").insert(auditLogs)

    if (error) {
      console.error("Error seeding audit logs:", error)
      return NextResponse.json({ message: "Failed to seed audit logs" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Sample audit logs created successfully",
      count: auditLogs.length,
    })
  } catch (error) {
    console.error("Error seeding audit logs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
