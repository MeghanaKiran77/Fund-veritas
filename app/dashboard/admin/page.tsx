"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle, Clock, Download, Eye, FileText, LogOut, Search, User, XCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { DashboardStats } from "@/components/admin/dashboard-stats"

// Update the Supabase client initialization
// Replace the current initialization at the top of the file with:

// Initialize Supabase client safely
const createSupabaseClient = () => {
  if (typeof window === "undefined") return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not available. Some admin features may not work.")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Initialize outside component to ensure singleton pattern
let supabase: ReturnType<typeof createClient> | null = null

// Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
// const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data for KYC requests
const kycRequests = [
  {
    id: "kyc1",
    user: "John Smith",
    email: "john.smith@example.com",
    role: "Creator",
    submittedDate: "2023-08-10",
    status: "pending",
    documents: [
      { id: "doc1", name: "Government ID", type: "image/jpeg" },
      { id: "doc2", name: "Selfie with ID", type: "image/jpeg" },
    ],
  },
  {
    id: "kyc2",
    user: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Creator",
    submittedDate: "2023-08-08",
    status: "pending",
    documents: [
      { id: "doc3", name: "Government ID", type: "image/jpeg" },
      { id: "doc4", name: "Selfie with ID", type: "image/jpeg" },
    ],
  },
  {
    id: "kyc3",
    user: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Creator",
    submittedDate: "2023-08-05",
    status: "approved",
    documents: [
      { id: "doc5", name: "Government ID", type: "image/jpeg" },
      { id: "doc6", name: "Selfie with ID", type: "image/jpeg" },
    ],
  },
  {
    id: "kyc4",
    user: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Creator",
    submittedDate: "2023-08-03",
    status: "rejected",
    documents: [
      { id: "doc7", name: "Government ID", type: "image/jpeg" },
      { id: "doc8", name: "Selfie with ID", type: "image/jpeg" },
    ],
    rejectionReason: "ID document unclear or expired",
  },
]

// Mock data for project verification
const projectVerifications = [
  {
    id: "proj1",
    title: "EcoFarm: Sustainable Agriculture",
    creator: "Green Innovations",
    submittedDate: "2023-08-12",
    status: "pending",
    category: "Agriculture",
    fundingGoal: 50000,
    documents: [
      { id: "pdoc1", name: "Project Pitch Deck", type: "application/pdf" },
      { id: "pdoc2", name: "Team Information", type: "application/pdf" },
    ],
    image: "/placeholder.svg?height=100&width=200&text=EcoFarm",
  },
  {
    id: "proj2",
    title: "Tech Innovate: AI Assistant",
    creator: "Future Tech Labs",
    submittedDate: "2023-08-09",
    status: "verified",
    category: "Technology",
    fundingGoal: 75000,
    documents: [
      { id: "pdoc3", name: "Project Pitch Deck", type: "application/pdf" },
      { id: "pdoc4", name: "Team Information", type: "application/pdf" },
    ],
    image: "/placeholder.svg?height=100&width=200&text=TechInnovate",
  },
  {
    id: "proj3",
    title: "Community Garden Initiative",
    creator: "Urban Green Spaces",
    submittedDate: "2023-08-07",
    status: "flagged",
    category: "Community",
    fundingGoal: 25000,
    documents: [
      { id: "pdoc5", name: "Project Pitch Deck", type: "application/pdf" },
      { id: "pdoc6", name: "Team Information", type: "application/pdf" },
    ],
    image: "/placeholder.svg?height=100&width=200&text=CommunityGarden",
    flagReason: "Insufficient project details and unclear milestone structure",
  },
]

// Mock data for user management
const users = [
  {
    id: "user1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Creator",
    joinDate: "2023-06-15",
    status: "active",
    kycStatus: "verified",
    projects: 2,
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Creator",
    joinDate: "2023-07-02",
    status: "active",
    kycStatus: "pending",
    projects: 1,
  },
  {
    id: "user3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Backer",
    joinDate: "2023-05-20",
    status: "active",
    kycStatus: "verified",
    projects: 0,
  },
  {
    id: "user4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Creator",
    joinDate: "2023-08-01",
    status: "suspended",
    kycStatus: "rejected",
    projects: 0,
    suspensionReason: "Multiple violations of platform guidelines",
  },
]

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedKyc, setSelectedKyc] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const pendingKyc = kycRequests.filter((req) => req.status === "pending").length
  const pendingProjects = projectVerifications.filter((proj) => proj.status === "pending").length
  const flaggedProjects = projectVerifications.filter((proj) => proj.status === "flagged").length

  // Update the useEffect for fetching audit logs
  // Replace the existing useEffect with:

  // Fetch audit logs from Supabase
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        // Initialize Supabase client if needed
        if (!supabase) {
          supabase = createSupabaseClient()
        }

        if (!supabase) {
          // Fall back to mock data if Supabase is not available
          setAuditLogs([
            {
              id: "log1",
              timestamp: "2023-08-15 14:32:45",
              user: "Admin (John Admin)",
              action: "Approved KYC request for Sarah Johnson",
              ipAddress: "192.168.1.100",
            },
            {
              id: "log2",
              timestamp: "2023-08-15 13:15:22",
              user: "Admin (John Admin)",
              action: "Verified project 'Tech Innovate: AI Assistant'",
              ipAddress: "192.168.1.100",
            },
            {
              id: "log3",
              timestamp: "2023-08-14 16:45:10",
              user: "Admin (Jane Admin)",
              action: "Rejected KYC request for Emily Davis",
              ipAddress: "192.168.1.101",
            },
            {
              id: "log4",
              timestamp: "2023-08-14 11:20:33",
              user: "Admin (Jane Admin)",
              action: "Flagged project 'Community Garden Initiative'",
              ipAddress: "192.168.1.101",
            },
            {
              id: "log5",
              timestamp: "2023-08-13 09:45:18",
              user: "System",
              action: "Automatic milestone release for project 'Tech Innovate: AI Assistant'",
              ipAddress: "System",
            },
          ])
          return
        }

        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20)

        if (error) {
          throw error
        }

        if (data) {
          setAuditLogs(data)
        }
      } catch (error) {
        console.error("Error fetching audit logs:", error)
        // Fallback to mock data if Supabase fetch fails
        setAuditLogs([
          {
            id: "log1",
            timestamp: "2023-08-15 14:32:45",
            user: "Admin (John Admin)",
            action: "Approved KYC request for Sarah Johnson",
            ipAddress: "192.168.1.100",
          },
          {
            id: "log2",
            timestamp: "2023-08-15 13:15:22",
            user: "Admin (John Admin)",
            action: "Verified project 'Tech Innovate: AI Assistant'",
            ipAddress: "192.168.1.100",
          },
          {
            id: "log3",
            timestamp: "2023-08-14 16:45:10",
            user: "Admin (Jane Admin)",
            action: "Rejected KYC request for Emily Davis",
            ipAddress: "192.168.1.101",
          },
          {
            id: "log4",
            timestamp: "2023-08-14 11:20:33",
            user: "Admin (Jane Admin)",
            action: "Flagged project 'Community Garden Initiative'",
            ipAddress: "192.168.1.101",
          },
          {
            id: "log5",
            timestamp: "2023-08-13 09:45:18",
            user: "System",
            action: "Automatic milestone release for project 'Tech Innovate: AI Assistant'",
            ipAddress: "System",
          },
        ])
      }
    }

    fetchAuditLogs()
  }, [])

  // Update the handleApproveKyc function
  // Replace the existing function with:

  const handleApproveKyc = async () => {
    setIsLoading(true)
    try {
      // API call to approve KYC
      const response = await fetch(`/api/admin/kyc/${selectedKyc.id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve KYC")
      }

      // Initialize Supabase client if needed
      if (!supabase) {
        supabase = createSupabaseClient()
      }

      // Log the action to audit logs if Supabase is available
      if (supabase) {
        await supabase.from("audit_logs").insert({
          user_id: "admin", // Replace with actual admin ID
          action: "approve_kyc",
          entity_type: "kyc",
          entity_id: selectedKyc.id,
          details: { user: selectedKyc.user, email: selectedKyc.email },
          ip_address: "127.0.0.1", // In a real app, get the actual IP
        })

        // Send notification to user
        await supabase.from("notifications").insert({
          user_id: selectedKyc.id,
          title: "KYC Approved",
          message: "Your KYC verification has been approved. You can now create projects.",
          type: "success",
        })
      }

      toast({
        title: "KYC Approved",
        description: `KYC request for ${selectedKyc.user} has been approved.`,
      })
      setSelectedKyc(null)
    } catch (error) {
      console.error("Error approving KYC:", error)
      toast({
        title: "Error",
        description: "Failed to approve KYC. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectKyc = async () => {
    if (!rejectionReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // API call to reject KYC
      const response = await fetch(`/api/admin/kyc/${selectedKyc.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject KYC")
      }

      // Log the action to audit logs
      if (supabase) {
        await supabase.from("audit_logs").insert({
          user_id: "admin", // Replace with actual admin ID
          action: "reject_kyc",
          entity_type: "kyc",
          entity_id: selectedKyc.id,
          details: { user: selectedKyc.user, email: selectedKyc.email, reason: rejectionReason },
          ip_address: "127.0.0.1", // In a real app, get the actual IP
        })

        // Send notification to user
        await supabase.from("notifications").insert({
          user_id: selectedKyc.id,
          title: "KYC Rejected",
          message: `Your KYC verification has been rejected. Reason: ${rejectionReason}`,
          type: "error",
        })
      }

      toast({
        title: "KYC Rejected",
        description: `KYC request for ${selectedKyc.user} has been rejected.`,
      })
      setSelectedKyc(null)
      setRejectionReason("")
    } catch (error) {
      console.error("Error rejecting KYC:", error)
      toast({
        title: "Error",
        description: "Failed to reject KYC. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyProject = async () => {
    setIsLoading(true)
    try {
      // API call to verify project
      const response = await fetch(`/api/admin/projects/${selectedProject.id}/verify`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to verify project")
      }

      // Log the action to audit logs
      if (supabase) {
        await supabase.from("audit_logs").insert({
          user_id: "admin", // Replace with actual admin ID
          action: "verify_project",
          entity_type: "project",
          entity_id: selectedProject.id,
          details: { title: selectedProject.title, creator: selectedProject.creator },
          ip_address: "127.0.0.1", // In a real app, get the actual IP
        })

        // Send notification to project creator
        await supabase.from("notifications").insert({
          user_id: selectedProject.creator_id, // Assuming creator_id is available
          title: "Project Verified",
          message: `Your project "${selectedProject.title}" has been verified and is now live.`,
          type: "success",
          link: `/projects/${selectedProject.id}`,
        })
      }

      toast({
        title: "Project Verified",
        description: `Project "${selectedProject.title}" has been verified.`,
      })
      setSelectedProject(null)
    } catch (error) {
      console.error("Error verifying project:", error)
      toast({
        title: "Error",
        description: "Failed to verify project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFlagProject = async () => {
    if (!rejectionReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for flagging the project.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // API call to flag project
      const response = await fetch(`/api/admin/projects/${selectedProject.id}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (!response.ok) {
        throw new Error("Failed to flag project")
      }

      // Log the action to audit logs
      if (supabase) {
        await supabase.from("audit_logs").insert({
          user_id: "admin", // Replace with actual admin ID
          action: "flag_project",
          entity_type: "project",
          entity_id: selectedProject.id,
          details: { title: selectedProject.title, creator: selectedProject.creator, reason: rejectionReason },
          ip_address: "127.0.0.1", // In a real app, get the actual IP
        })

        // Send notification to project creator
        await supabase.from("notifications").insert({
          user_id: selectedProject.creator_id, // Assuming creator_id is available
          title: "Project Flagged",
          message: `Your project "${selectedProject.title}" has been flagged. Reason: ${rejectionReason}`,
          type: "warning",
          link: `/projects/${selectedProject.id}`,
        })
      }

      toast({
        title: "Project Flagged",
        description: `Project "${selectedProject.title}" has been flagged.`,
      })
      setSelectedProject(null)
      setRejectionReason("")
    } catch (error) {
      console.error("Error flagging project:", error)
      toast({
        title: "Error",
        description: "Failed to flag project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBanUser = async () => {
    if (!rejectionReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for banning the user.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // API call to ban user
      const response = await fetch(`/api/admin/users/${selectedUser.id}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (!response.ok) {
        throw new Error("Failed to ban user")
      }

      // Log the action to audit logs
      if (supabase) {
        await supabase.from("audit_logs").insert({
          user_id: "admin", // Replace with actual admin ID
          action: "ban_user",
          entity_type: "user",
          entity_id: selectedUser.id,
          details: { name: selectedUser.name, email: selectedUser.email, reason: rejectionReason },
          ip_address: "127.0.0.1", // In a real app, get the actual IP
        })

        // Send notification to user
        await supabase.from("notifications").insert({
          user_id: selectedUser.id,
          title: "Account Suspended",
          message: `Your account has been suspended. Reason: ${rejectionReason}`,
          type: "error",
        })
      }

      toast({
        title: "User Banned",
        description: `User ${selectedUser.name} has been banned.`,
      })
      setSelectedUser(null)
      setRejectionReason("")
    } catch (error) {
      console.error("Error banning user:", error)
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" })
      toast({
        title: "Logged out",
        description: "You have been logged out of the admin panel",
      })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "approved":
      case "verified":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            <AlertTriangle className="mr-1 h-3 w-3" /> Flagged
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Suspended
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage platform users, projects, and system operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/admin/seed" target="_blank" rel="noreferrer">
              Seed Database
            </a>
          </Button>
          <Button variant="outline" onClick={handleAdminLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <DashboardStats />
      </div>

      <Tabs defaultValue="kyc" className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="projects">Project Verification</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="kyc" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>KYC Verification Requests</CardTitle>
                  <CardDescription>Verify user identities before they can create projects</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Submitted</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycRequests
                      .filter(
                        (req) =>
                          req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.email.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((req) => (
                        <tr key={req.id} className="border-b">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{req.user}</div>
                              <div className="text-xs text-muted-foreground">{req.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{req.role}</td>
                          <td className="px-4 py-3 text-sm">{req.submittedDate}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(req.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedKyc(req)}>
                                    <Eye className="mr-1 h-4 w-4" /> Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Review KYC Request</DialogTitle>
                                    <DialogDescription>
                                      Verify the identity documents submitted by {req.user}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      {req.documents.map((doc) => (
                                        <div key={doc.id} className="rounded-lg border p-4">
                                          <div className="mb-2 flex items-center justify-between">
                                            <h4 className="font-medium">{doc.name}</h4>
                                            <Button variant="ghost" size="sm">
                                              <Download className="mr-1 h-4 w-4" /> Download
                                            </Button>
                                          </div>
                                          <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
                                            <Image
                                              src="/placeholder.svg?height=200&width=300&text=ID+Document"
                                              alt={doc.name}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="rounded-lg border p-4">
                                      <h4 className="mb-2 font-medium">User Information</h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">Name:</p>
                                          <p className="font-medium">{req.user}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Email:</p>
                                          <p className="font-medium">{req.email}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Role:</p>
                                          <p className="font-medium">{req.role}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Submitted Date:</p>
                                          <p className="font-medium">{req.submittedDate}</p>
                                        </div>
                                      </div>
                                    </div>
                                    {req.status === "pending" && (
                                      <div className="space-y-4">
                                        <Separator />
                                        <div className="space-y-2">
                                          <Label htmlFor="rejection-reason">Rejection Reason (if applicable)</Label>
                                          <Textarea
                                            id="rejection-reason"
                                            placeholder="Provide a reason if you are rejecting this KYC request..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                          />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                          <Button variant="destructive" onClick={handleRejectKyc} disabled={isLoading}>
                                            Reject
                                          </Button>
                                          <Button onClick={handleApproveKyc} disabled={isLoading}>
                                            Approve
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                    {req.status === "rejected" && (
                                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                                        <h4 className="mb-2 font-medium text-red-800 dark:text-red-300">
                                          Rejection Reason
                                        </h4>
                                        <p className="text-sm text-red-700 dark:text-red-400">{req.rejectionReason}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Verification</CardTitle>
                  <CardDescription>Verify projects before they are published on the platform</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Creator</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Funding Goal</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectVerifications
                      .filter(
                        (proj) =>
                          proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proj.creator.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((proj) => (
                        <tr key={proj.id} className="border-b">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="relative mr-3 h-10 w-16 overflow-hidden rounded">
                                <Image
                                  src={proj.image || "/placeholder.svg"}
                                  alt={proj.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="font-medium">{proj.title}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{proj.creator}</td>
                          <td className="px-4 py-3 text-sm">{proj.category}</td>
                          <td className="px-4 py-3 text-sm">${proj.fundingGoal.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(proj.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedProject(proj)}>
                                    <Eye className="mr-1 h-4 w-4" /> Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Review Project</DialogTitle>
                                    <DialogDescription>
                                      Verify the project details and documents for {proj.title}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-6 py-4">
                                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                                      <Image
                                        src={proj.image || "/placeholder.svg"}
                                        alt={proj.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="rounded-lg border p-4">
                                      <h4 className="mb-2 font-medium">Project Information</h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">Title:</p>
                                          <p className="font-medium">{proj.title}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Creator:</p>
                                          <p className="font-medium">{proj.creator}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Category:</p>
                                          <p className="font-medium">{proj.category}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Funding Goal:</p>
                                          <p className="font-medium">${proj.fundingGoal.toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Submitted Date:</p>
                                          <p className="font-medium">{proj.submittedDate}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Status:</p>
                                          <p className="font-medium">{getStatusBadge(proj.status)}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <h4 className="font-medium">Project Documents</h4>
                                      <div className="grid gap-4">
                                        {proj.documents.map((doc) => (
                                          <div
                                            key={doc.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                          >
                                            <div className="flex items-center">
                                              <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                                              <span>{doc.name}</span>
                                            </div>
                                            <Button variant="outline" size="sm">
                                              <Download className="mr-1 h-4 w-4" /> Download
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    {proj.status === "pending" && (
                                      <div className="space-y-4">
                                        <Separator />
                                        <div className="space-y-2">
                                          <Label htmlFor="flag-reason">Flag Reason (if applicable)</Label>
                                          <Textarea
                                            id="flag-reason"
                                            placeholder="Provide a reason if you are flagging this project..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                          />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                          <Button
                                            variant="destructive"
                                            onClick={handleFlagProject}
                                            disabled={isLoading}
                                          >
                                            Flag Project
                                          </Button>
                                          <Button onClick={handleVerifyProject} disabled={isLoading}>
                                            Verify Project
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                    {proj.status === "flagged" && (
                                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                                        <h4 className="mb-2 font-medium text-red-800 dark:text-red-300">Flag Reason</h4>
                                        <p className="text-sm text-red-700 dark:text-red-400">{proj.flagReason}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Log</CardTitle>
                  <CardDescription>Track all administrative actions on the platform</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs
                      .filter(
                        (log: any) =>
                          log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user?.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((log: any) => (
                        <tr key={log.id} className="border-b">
                          <td className="px-4 py-3 text-sm">{log.timestamp || log.created_at}</td>
                          <td className="px-4 py-3 text-sm">{log.user || log.user_id}</td>
                          <td className="px-4 py-3 text-sm">{log.action}</td>
                          <td className="px-4 py-3 text-sm">{log.ipAddress || log.ip_address}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users and their access</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Join Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">KYC Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(
                        (user) =>
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{user.role}</td>
                          <td className="px-4 py-3 text-sm">{user.joinDate}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(user.kycStatus)}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(user.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                    <User className="mr-1 h-4 w-4" /> Manage
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Manage User</DialogTitle>
                                    <DialogDescription>View and manage user details for {user.name}</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Name:</p>
                                        <p className="font-medium">{user.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Email:</p>
                                        <p className="font-medium">{user.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Role:</p>
                                        <p className="font-medium">{user.role}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Join Date:</p>
                                        <p className="font-medium">{user.joinDate}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">KYC Status:</p>
                                        <p className="font-medium">{getStatusBadge(user.kycStatus)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Status:</p>
                                        <p className="font-medium">{getStatusBadge(user.status)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Projects:</p>
                                        <p className="font-medium">{user.projects}</p>
                                      </div>
                                    </div>
                                    {user.status === "active" && (
                                      <div className="space-y-4">
                                        <Separator />
                                        <div className="space-y-2">
                                          <Label htmlFor="ban-reason">Ban Reason (if applicable)</Label>
                                          <Textarea
                                            id="ban-reason"
                                            placeholder="Provide a reason if you are banning this user..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                          />
                                        </div>
                                        <div className="flex justify-end">
                                          <Button variant="destructive" onClick={handleBanUser} disabled={isLoading}>
                                            Ban User
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                    {user.status === "suspended" && (
                                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                                        <h4 className="mb-2 font-medium text-red-800 dark:text-red-300">
                                          Suspension Reason
                                        </h4>
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                          {user.suspensionReason}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Configure platform settings and admin preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Platform Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="FundVeritas" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-email">Support Email</Label>
                    <Input id="platform-email" defaultValue="support@fundveritas.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                    <Input id="platform-fee" type="number" defaultValue="5" min="0" max="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-funding">Minimum Funding Amount ($)</Label>
                    <Input id="min-funding" type="number" defaultValue="10" min="1" />
                  </div>
                </div>
                <Button>Save Platform Settings</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Admin Account</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Admin Name</Label>
                    <Input id="admin-name" defaultValue="Admin User" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" defaultValue="admin@fundveritas.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">New Password</Label>
                  <Input id="admin-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password-confirm">Confirm New Password</Label>
                  <Input id="admin-password-confirm" type="password" />
                </div>
                <Button>Update Admin Account</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" min="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-attempts">Max Login Attempts</Label>
                  <Input id="login-attempts" type="number" defaultValue="5" min="1" />
                </div>
                <Button>Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
