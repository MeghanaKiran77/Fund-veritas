import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client safely
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not available. Audit logging will not work.")
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Initialize outside function to ensure singleton pattern
let supabase: ReturnType<typeof createClient> | null = null

// Get or create the Supabase client
const getSupabase = () => {
  if (!supabase) {
    supabase = createSupabaseClient()
  }
  return supabase
}

type AuditAction =
  | "user_login"
  | "user_register"
  | "kyc_submit"
  | "kyc_approve"
  | "kyc_reject"
  | "project_create"
  | "project_verify"
  | "project_flag"
  | "project_fund"
  | "milestone_release"
  | "dispute_create"
  | "dispute_resolve"
  | "user_ban"
  | "admin_login"

type EntityType = "user" | "kyc" | "project" | "transaction" | "dispute" | "milestone"

interface AuditLogParams {
  userId?: string
  action: AuditAction
  entityType: EntityType
  entityId?: string
  details?: Record<string, any>
  ipAddress?: string
}

/**
 * Logs an action to the audit_logs table
 */
export async function logAuditEvent({
  userId = "system",
  action,
  entityType,
  entityId = "",
  details = {},
  ipAddress = "",
}: AuditLogParams): Promise<boolean> {
  try {
    const supabase = getSupabase()
    if (!supabase) return false

    const { error } = await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ipAddress,
    })

    if (error) {
      console.error("Error logging audit event:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error logging audit event:", error)
    return false
  }
}

/**
 * Retrieves audit logs with optional filtering
 */
export async function getAuditLogs({
  userId,
  entityType,
  entityId,
  action,
  limit = 50,
  offset = 0,
}: {
  userId?: string
  entityType?: EntityType
  entityId?: string
  action?: AuditAction
  limit?: number
  offset?: number
}) {
  try {
    const supabase = getSupabase()
    if (!supabase) return { logs: [], error: "Supabase client not available" }

    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (entityType) {
      query = query.eq("entity_type", entityType)
    }

    if (entityId) {
      query = query.eq("entity_id", entityId)
    }

    if (action) {
      query = query.eq("action", action)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching audit logs:", error)
      return { logs: [], error: error.message }
    }

    return { logs: data, error: null }
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return { logs: [], error: "Failed to fetch audit logs" }
  }
}
