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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, Plus, Upload } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock data for creator projects
const creatorProjects = [
  {
    id: "1",
    title: "EcoFarm: Sustainable Agriculture",
    description: "A blockchain-based platform for sustainable farming practices and supply chain transparency.",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 128,
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
      completionPercentage: 75,
    },
  },
  {
    id: "2",
    title: "Tech Innovate: AI Assistant",
    description: "An AI-powered personal assistant that helps with daily tasks and productivity.",
    fundingGoal: 75000,
    currentFunding: 68000,
    backers: 245,
    daysRemaining: 8,
    status: "active",
    milestoneStatus: "completed",
    image: "/placeholder.svg?height=200&width=400&text=TechInnovate",
    currentMilestone: {
      id: "m2",
      title: "Beta Testing",
      description: "Conduct beta testing with 100 users and gather feedback for improvements.",
      deadline: "2023-08-15",
      status: "completed",
      fundingPercentage: 30,
      completionPercentage: 100,
    },
  },
  {
    id: "3",
    title: "Community Garden Initiative",
    description: "Creating community gardens in urban areas to promote sustainability and community bonding.",
    fundingGoal: 25000,
    currentFunding: 12000,
    backers: 87,
    daysRemaining: 21,
    status: "pending-review",
    milestoneStatus: "not-started",
    image: "/placeholder.svg?height=200&width=400&text=CommunityGarden",
    currentMilestone: null,
  },
]

export default function CreatorDashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [completionDetails, setCompletionDetails] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const totalFunds = creatorProjects.reduce((sum, project) => sum + project.currentFunding, 0)
  const activeProjects = creatorProjects.filter((project) => project.status === "active").length
  const totalBackers = creatorProjects.reduce((sum, project) => sum + project.backers, 0)

  const handleMilestoneCompletion = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Milestone Completion Requested",
        description: "Your milestone completion request has been submitted for backer approval.",
      })
      setSelectedProject(null)
      setCompletionDetails("")
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
      case "not-started":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Not Started
          </Badge>
        )
      default:
        return null
    }
  }

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Active
          </Badge>
        )
      case "pending-review":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pending Review
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and track funding progress</p>
        </div>
        <Button onClick={() => router.push("/create-project")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">${totalFunds.toLocaleString()}</CardTitle>
            <CardDescription>Total Funds Raised</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Across {creatorProjects.length} projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{activeProjects}</CardTitle>
            <CardDescription>Active Campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Projects currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{totalBackers}</CardTitle>
            <CardDescription>Total Backers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">People supporting your projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        {creatorProjects.map((project) => (
          <Card key={project.id}>
            <div className="grid md:grid-cols-3">
              <div className="relative h-48 md:h-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
              <div className="p-6 md:col-span-2">
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    {getProjectStatusBadge(project.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
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
                    <div className="font-semibold">{project.backers}</div>
                    <div className="text-muted-foreground">Backers</div>
                  </div>
                  <div>
                    <div className="font-semibold">{project.daysRemaining}</div>
                    <div className="text-muted-foreground">Days Remaining</div>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {project.currentMilestone ? (
                        <>{getMilestoneStatusBadge(project.currentMilestone.status)}</>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <div className="text-muted-foreground">Current Milestone</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/projects/${project.id}`}>View Project</Link>
                  </Button>
                  {project.status === "active" && project.currentMilestone && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedProject(project)}>
                          Update Milestone
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Milestone Progress</DialogTitle>
                          <DialogDescription>
                            Provide details about the progress of the current milestone for {project.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="rounded-lg border p-4">
                            <h4 className="mb-2 font-semibold">{project.currentMilestone.title}</h4>
                            <p className="mb-2 text-sm text-muted-foreground">{project.currentMilestone.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Deadline: {project.currentMilestone.deadline}</span>
                              <span>{project.currentMilestone.fundingPercentage}% of total funding</span>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Completion Progress</span>
                                <span>{project.currentMilestone.completionPercentage}%</span>
                              </div>
                              <Progress value={project.currentMilestone.completionPercentage} className="h-2" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Completion Details</label>
                            <Textarea
                              placeholder="Describe the progress made and any challenges encountered..."
                              value={completionDetails}
                              onChange={(e) => setCompletionDetails(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Evidence</label>
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
                                      const mockFile = new File([""], "progress-report.pdf", {
                                        type: "application/pdf",
                                      })
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
                          {project.currentMilestone.completionPercentage === 100 ? (
                            <Button onClick={handleMilestoneCompletion} disabled={isLoading}>
                              {isLoading ? "Processing..." : "Request Milestone Completion"}
                            </Button>
                          ) : (
                            <Button onClick={handleMilestoneCompletion} disabled={isLoading}>
                              {isLoading ? "Processing..." : "Update Progress"}
                            </Button>
                          )}
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
    </div>
  )
}
