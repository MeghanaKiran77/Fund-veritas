"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notifications"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client safely
const createSupabaseClient = () => {
  if (typeof window === "undefined") return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not available. Real-time notifications will not work.")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Initialize outside component to ensure singleton pattern
let supabase: ReturnType<typeof createClient> | null = null

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
  link?: string
}

interface NotificationsDropdownProps {
  userId: string
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    // Initialize Supabase client if needed
    if (!supabase) {
      supabase = createSupabaseClient()
    }

    // Fetch notifications on component mount
    fetchNotifications()

    // Set up real-time subscription for new notifications
    if (supabase) {
      const channel = supabase
        .channel("notifications-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev])
          },
        )
        .subscribe()

      return () => {
        supabase?.removeChannel(channel)
      }
    }
  }, [userId])

  const fetchNotifications = async () => {
    setLoading(true)
    const { notifications: data, error } = await getUserNotifications(userId, { limit: 10 })

    if (!error && data) {
      setNotifications(data as Notification[])
    }
    setLoading(false)
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id)
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
    }

    if (notification.link) {
      router.push(notification.link)
    }
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(userId)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 p-0 text-xs text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs font-normal" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex cursor-pointer flex-col items-start p-3 ${!notification.read ? "bg-purple-50 dark:bg-purple-950/20" : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex w-full items-start gap-2">
                <span className="mt-0.5 text-lg">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">{notification.message}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer justify-center text-sm font-medium text-purple-600"
              onClick={() => router.push("/notifications")}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
