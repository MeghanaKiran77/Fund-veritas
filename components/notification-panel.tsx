"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications, type Notification } from "@/context/notification-context"
import { Bell, Check, Info, AlertTriangle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

interface NotificationPanelProps {
  onClose?: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 border-b p-4 transition-colors hover:bg-muted/50 ${
                  !notification.read ? "bg-muted/20" : ""
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {notification.link && (
                      <Button variant="link" size="sm" className="h-auto p-0" asChild>
                        <Link href={notification.link} onClick={onClose}>
                          View Details
                        </Link>
                      </Button>
                    )}
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
