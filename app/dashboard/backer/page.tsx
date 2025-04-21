"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, ThumbsUp, Upload, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock data for backed projects
const backedProjects = [
  {
    id: "1",
    title: "EcoFarm: Sustainable Agriculture",
    creator: "Green Innovations",
    description: "A blockchain-based platform for sustainable farming practices and supply chain transparency.",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 128,
    amountBacked: 500,
    daysRemaining: 15,
    status: "active",
    milestoneStatus: "in-progress",
    image: "/placeholder.svg?height=200&width=400&text=EcoFarm",
    currentMilestone: {
      id: "m2",
      title: "Pilot Program",
      description: "Launch pilot program with 10 farms to test the platform and gather feedback.",
      deadline: "2023-09-30",
      status: "in-progress",
      fundingPercentage: 35,
    },
  },
  {
    id: "2",
    title: "Tech Innovate: AI Assistant",
    creator: "Future Tech Labs",
    description: "An AI-powered personal assistant that helps with daily tasks and productivity.",
    fundingGoal: 75000,
    currentFunding: 68000,
    backers: 245,
    amountBacked: 1000,
    daysRemaining: 8,
    status: "active",
    milestoneStatus: "pending-approval",
    image: "/placeholder.svg?height=200&width=400&text=TechInnovate",
    currentMilestone: {
      id: "m3",
      title: "Mobile App Development",
      description: "Develop and launch mobile applications for iOS and Android.",
      deadline: "2023-10-15",
      status: "pending-approval",
      fundingPercentage: 25,
    },
  },
  {
    id: "3",
    title: "Community Garden Initiative",
    creator: "Urban Green Spaces",
    description: "Creating community gardens in urban areas to promote sustainability and community bonding.",
    fundingGoal: 25000,
    currentFunding: 12000,
    backers: 87,
    amountBacked: 250,
    daysRemaining: 21,
    status: "active",
    milestoneStatus: "completed",
    image: "/placeholder.svg?height=200&width=400&text=CommunityGarden",
    currentMilestone: {
      id: "m1",
      title: "Land Acquisition",
      description: "Secure land for the first three community gardens.",
      deadline: "2023-08-15",
      status: "completed",
      fundingPercentage: 40,
    },
  },
]

// Mock transaction history
const transactions = [
  {
    id: "tx1",
    date: "2023-08-15",
    project: "EcoFarm: Sustainable Agriculture",
    amount: 500,
    type: "fund",
    txHash: "0x1234...5678",
  },
  {
    id: "tx2",
    date: "2023-07-28",
    project: "Tech Innovate: AI Assistant",
    amount: 1000,
    type: "fund",
    txHash: "0x5678...9012",
  },
  {
    id: "tx3",
    date: "2023-07-10",
    project: "Community Garden Initiative",
    amount: 250,
    type: "fund",
    txHash: "0x9012...3456",
  },
  {
    id: "tx4",
    date: "2023-06-22",
    project: "Eco Housing Development",
    amount: 150,
    type: "refund",
    txHash: "0x3456...7890",
  },
  {
    id: "tx5",
    date: "2023-06-05",
    project: "Community Garden Initiative",
    amount: 100,
    type: "release",
    txHash: "0x7890...1234",
  },
]

export default function BackerDashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [feedback, setFeedback] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const totalBacked = backedProjects.reduce((sum, project) => sum + project.amountBacked, 0)
  const activeProjects = backedProjects.filter((project) => project.status === "active").length
  const pendingMilestones = backedProjects.filter((project) => project.milestoneStatus === "pending-approval").length

  const handleConfirmMilestone = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Milestone Confirmed",
        description: "Your confirmation has been recorded. Thank you for your feedback!",
      })
      setSelectedProject(null)
      setFeedback("")
      setSelectedFile(null)
    }, 1500)
  }

  const getMilestoneStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <Clock className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        )
      case "pending-approval":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            <ThumbsUp className="mr-1 h-3 w-3" /> Awaiting Approval
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Backer Dashboard</h1>
        <p className="text-muted-foreground">Manage your backed projects and track milestones</p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">${totalBacked.toLocaleString()}</CardTitle>
            <CardDescription>Total Funds Backed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Across {backedProjects.length} projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{activeProjects}</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Projects currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{pendingMilestones}</CardTitle>
            <CardDescription>Pending Milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Milestones awaiting your approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Backed Projects</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-6">
          <div className="space-y-6">
            {backedProjects.map((project) => (
              <Card key={project.id}>
                <div className="grid md:grid-cols-3">
                  <div className="relative h-48 md:h-auto">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:col-span-2">
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        {getMilestoneStatusBadge(project.milestoneStatus)}
                      </div>
                      <p className="text-sm text-muted-foreground">by {project.creator}</p>
                    </div>
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          ${project.currentFunding.toLocaleString()} of ${project.fundingGoal.toLocaleString()}
                        </span>
                        <span>{Math.round((project.currentFunding / project.fundingGoal) * 100)}%</span>
                      </div>
                      <Progress value={(project.currentFunding / project.fundingGoal) * 100} className="h-2" />
                    </div>
                    <div className="mb-4 grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold">${project.amountBacked}</div>
                        <div className="text-muted-foreground">Your Contribution</div>
                      </div>
                      <div>
                        <div className="font-semibold">{project.backers}</div>
                        <div className="text-muted-foreground">Total Backers</div>
                      </div>
                      <div>
                        <div className="font-semibold">{project.daysRemaining}</div>
                        <div className="text-muted-foreground">Days Remaining</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/projects/${project.id}`}>View Project</Link>
                      </Button>
                      {project.milestoneStatus === "pending-approval" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedProject(project)}>
                              Confirm Milestone
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Milestone Completion</DialogTitle>
                              <DialogDescription>
                                Review and confirm the completion of the current milestone for {project.title}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="rounded-lg border p-4">
                                <h4 className="mb-2 font-semibold">{project.currentMilestone.title}</h4>
                                <p className="mb-2 text-sm text-muted-foreground">
                                  {project.currentMilestone.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Deadline: {project.currentMilestone.deadline}</span>
                                  <span>{project.currentMilestone.fundingPercentage}% of total funding</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Your Feedback (Optional)</label>
                                <Textarea
                                  placeholder="Share your thoughts on this milestone..."
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Upload Evidence (Optional)</label>
                                <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-4">
                                  {selectedFile ? (
                                    <div className="text-center">
                                      <p className="mb-2 font-medium">{selectedFile.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => setSelectedFile(null)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                      <p className="mb-2 text-sm font-medium">Drag and drop or click to upload</p>
                                      <p className="mb-4 text-xs text-muted-foreground">
                                        Images, PDFs, or videos (Max 10MB)
                                      </p>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          // Simulate file selection
                                          const mockFile = new File([""], "evidence.jpg", { type: "image/jpeg" })
                                          setSelectedFile(mockFile)
                                        }}
                                      >
                                        Select File
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" disabled={isLoading}>
                                Cancel
                              </Button>
                              <Button onClick={handleConfirmMilestone} disabled={isLoading}>
                                {isLoading ? "Processing..." : "Confirm Milestone"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>A record of all your funding transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b">
                        <td className="px-4 py-3 text-sm">{tx.date}</td>
                        <td className="px-4 py-3 text-sm">{tx.project}</td>
                        <td className="px-4 py-3 text-sm">${tx.amount}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            variant="outline"
                            className={
                              tx.type === "fund"
                                ? "border-blue-500 text-blue-500"
                                : tx.type === "refund"
                                  ? "border-red-500 text-red-500"
                                  : "border-green-500 text-green-500"
                            }
                          >
                            {tx.type === "fund" ? "Fund" : tx.type === "refund" ? "Refund" : "Milestone Release"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <span className="font-mono">{tx.txHash}</span>
                            <Button variant="ghost" size="icon" className="ml-1 h-6 w-6">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
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
      </Tabs>
    </div>
  )
}
