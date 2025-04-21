"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserNotifications, markAllNotificationsAsRead, deleteNotification } from "@/lib/notifications"
import { useToast } from "@/hooks/use-toast"
import { Trash2, CheckCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client for real-time updates
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
  link?: string
}

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user123"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotifications()

    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel("notifications-page-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${MOCK_USER_ID}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    const { notifications: data, error } = await getUserNotifications(MOCK_USER_ID, { limit: 50 })

    if (!error && data) {
      setNotifications(data as Notification[])
    } else {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead(MOCK_USER_ID)

    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNotification = async (id: string) => {
    const success = await deleteNotification(id)

    if (success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast({
        title: "Success",
        description: "Notification deleted",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
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

  const getNotificationClass = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20"
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20"
    }
  }

  return (
    <div className="container px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with the latest activities</p>
        </div>
        <Button onClick={handleMarkAllAsRead} disabled={loading || notifications.every((n) => n.read)}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>You have {notifications.filter((n) => !n.read).length} unread notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No notifications to display</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative rounded-lg border p-4 ${!notification.read ? getNotificationClass(notification.type) : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                      {notification.link && (
                        <Button
                          variant="link"
                          className="mt-1 h-auto p-0 text-sm text-purple-600"
                          onClick={() => (window.location.href = notification.link!)}
                        >
                          View details
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
