"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@supabase/supabase-js"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  link?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  fetchNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Create a singleton Supabase client to prevent multiple instances
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not available. Notifications will not work.")
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Initialize outside component to ensure singleton pattern
let supabaseClient: ReturnType<typeof createClient> | null = null

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Supabase client
  useEffect(() => {
    if (typeof window !== "undefined" && !supabaseClient) {
      supabaseClient = createSupabaseClient()
      setIsInitialized(true)
    } else {
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (!isInitialized || !supabaseClient) return

    // Set up real-time subscription for notifications
    const setupSubscription = async () => {
      try {
        const { data: userData } = await supabaseClient.auth.getUser()
        if (!userData?.user) return

        const channel = supabaseClient
          .channel(`user-notifications-${userData.user.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${userData.user.id}`,
            },
            (payload: any) => {
              const newNotification: Notification = {
                id: payload.new.id,
                userId: payload.new.user_id,
                title: payload.new.title,
                message: payload.new.message,
                type: payload.new.type,
                read: payload.new.read,
                createdAt: payload.new.created_at,
                link: payload.new.link,
              }

              setNotifications((prev) => [newNotification, ...prev])
              setUnreadCount((prev) => prev + 1)
            },
          )
          .subscribe()

        return () => {
          supabaseClient?.removeChannel(channel)
        }
      } catch (error) {
        console.error("Error setting up notification subscription:", error)
      }
    }

    setupSubscription()
  }, [isInitialized])

  const fetchNotifications = async () => {
    try {
      if (!supabaseClient) return

      const { data: userData } = await supabaseClient.auth.getUser()
      if (!userData?.user) return

      const { data, error } = await supabaseClient
        .from("notifications")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error

      const formattedNotifications: Notification[] = data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        message: item.message,
        type: item.type,
        read: item.read,
        createdAt: item.created_at,
        link: item.link,
      }))

      setNotifications(formattedNotifications)
      setUnreadCount(formattedNotifications.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      if (!supabaseClient) return

      const { error } = await supabaseClient.from("notifications").update({ read: true }).eq("id", id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      if (!supabaseClient) return

      const { data: userData } = await supabaseClient.auth.getUser()
      if (!userData?.user) return

      const { error } = await supabaseClient
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userData.user.id)
        .eq("read", false)

      if (error) throw error

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
