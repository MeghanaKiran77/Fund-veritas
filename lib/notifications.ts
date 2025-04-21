import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client safely
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not available. Notifications will not work.")
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

type NotificationType = "info" | "success" | "warning" | "error"

interface NotificationParams {
  userId: string
  title: string
  message: string
  type: NotificationType
  link?: string
}

/**
 * Creates a new notification for a user
 */
export async function createNotification({ userId, title, message, type, link }: NotificationParams): Promise<boolean> {
  try {
    const supabase = getSupabase()
    if (!supabase) return false

    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      link,
      read: false,
    })

    if (error) {
      console.error("Error creating notification:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error creating notification:", error)
    return false
  }
}

/**
 * Gets notifications for a user
 */
export async function getUserNotifications(
  userId: string,
  { limit = 20, offset = 0, unreadOnly = false }: { limit?: number; offset?: number; unreadOnly?: boolean } = {},
) {
  try {
    const supabase = getSupabase()
    if (!supabase) return { notifications: [], error: "Supabase client not available" }

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (unreadOnly) {
      query = query.eq("read", false)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching notifications:", error)
      return { notifications: [], error: error.message }
    }

    return { notifications: data, error: null }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return { notifications: [], error: "Failed to fetch notifications" }
  }
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const supabase = getSupabase()
    if (!supabase) return false

    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    if (error) {
      console.error("Error marking notification as read:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

/**
 * Marks all notifications for a user as read
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    const supabase = getSupabase()
    if (!supabase) return false

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return false
  }
}

/**
 * Deletes a notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const supabase = getSupabase()
    if (!supabase) return false

    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (error) {
      console.error("Error deleting notification:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting notification:", error)
    return false
  }
}
