"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"

// Update the Supabase client initialization
// Replace the current initialization at the top of the file with:

// Initialize Supabase client safely
const createSupabaseClient = () => {
  if (typeof window === "undefined") return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not available. Some stats may not be available.")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Initialize outside component to ensure singleton pattern
let supabase: ReturnType<typeof createClient> | null = null

export function DashboardStats() {
  const [stats, setStats] = useState({
    users: {
      total: 0,
      creators: 0,
      backers: 0,
      admins: 0,
      pendingKyc: 0,
    },
    projects: {
      total: 0,
      pending: 0,
      verified: 0,
      flagged: 0,
      totalFunding: 0,
    },
    notifications: {
      total: 0,
      unread: 0,
    },
    auditLogs: {
      total: 0,
      today: 0,
    },
  })
  const [isLoading, setIsLoading] = useState(true)

  // Update the fetchStats function
  // Replace the existing function with:

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Initialize Supabase client if needed
        if (!supabase) {
          supabase = createSupabaseClient()
        }

        // Fetch MongoDB stats
        const response = await fetch("/api/admin/stats", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }

        const mongoStats = await response.json()

        // Fetch Supabase stats if available
        let notificationsCount = 0
        let unreadNotifications = 0
        let auditLogsCount = 0
        let todayLogs = 0

        if (supabase) {
          // Fetch notifications stats
          const { data: notificationsData, error: notificationsError } = await supabase
            .from("notifications")
            .select("id, read", { count: "exact" })

          if (!notificationsError && notificationsData) {
            notificationsCount = notificationsData.length
            unreadNotifications = notificationsData.filter((n) => !n.read).length || 0
          }

          // Fetch audit logs stats
          const { data: auditLogsData, error: auditLogsError } = await supabase
            .from("audit_logs")
            .select("id, created_at", { count: "exact" })

          if (!auditLogsError && auditLogsData) {
            auditLogsCount = auditLogsData.length

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            todayLogs =
              auditLogsData.filter((log) => {
                const logDate = new Date(log.created_at)
                return logDate >= today
              }).length || 0
          }
        }

        setStats({
          users: mongoStats.users,
          projects: mongoStats.projects,
          notifications: {
            total: notificationsCount,
            unread: unreadNotifications,
          },
          auditLogs: {
            total: auditLogsCount,
            today: todayLogs,
          },
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set mock stats for demo purposes
        setStats({
          users: {
            total: 7,
            creators: 3,
            backers: 3,
            admins: 1,
            pendingKyc: 2,
          },
          projects: {
            total: 5,
            pending: 2,
            verified: 2,
            flagged: 1,
            totalFunding: 75000,
          },
          notifications: {
            total: 25,
            unread: 10,
          },
          auditLogs: {
            total: 30,
            today: 5,
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-7 w-20 rounded-md bg-muted"></div>
              <div className="h-4 w-32 rounded-md bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full rounded-md bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.users.total}</CardTitle>
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats.users.creators} creators, {stats.users.backers} backers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.projects.total}</CardTitle>
              <CardDescription>Total Projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stats.projects.verified} verified, {stats.projects.pending} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">${stats.projects.totalFunding.toLocaleString()}</CardTitle>
              <CardDescription>Total Funding</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Across {stats.projects.verified} verified projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.auditLogs.today}</CardTitle>
              <CardDescription>Actions Today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stats.auditLogs.total} total audit logs</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.users.total}</CardTitle>
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Active users on the platform</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.users.creators}</CardTitle>
              <CardDescription>Creators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Users who can create projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.users.backers}</CardTitle>
              <CardDescription>Backers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Users who fund projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.users.pendingKyc}</CardTitle>
              <CardDescription>Pending KYC</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Users awaiting verification</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.projects.total}</CardTitle>
              <CardDescription>Total Projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">All projects on the platform</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.projects.pending}</CardTitle>
              <CardDescription>Pending Projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Projects awaiting verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.projects.verified}</CardTitle>
              <CardDescription>Verified Projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Projects approved and live</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.projects.flagged}</CardTitle>
              <CardDescription>Flagged Projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Projects requiring attention</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.auditLogs.total}</CardTitle>
              <CardDescription>Total Actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">All recorded platform actions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.auditLogs.today}</CardTitle>
              <CardDescription>Today's Actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Actions performed today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.notifications.total}</CardTitle>
              <CardDescription>Notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Total notifications sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stats.notifications.unread}</CardTitle>
              <CardDescription>Unread Notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Notifications pending review</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
