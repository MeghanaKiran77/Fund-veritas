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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"
import { GlowEffect } from "@/components/glow-effect"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAuth } from "@/context/auth-context"
import { CheckCircle, Clock, Download, ExternalLink, FileText, Heart, HelpCircle, Share2, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Mock project data
const mockProject = {
  id: "1",
  title: "EcoFarm: Sustainable Agriculture",
  creator: "Green Innovations",
  creatorId: "creator123",
  description:
    "EcoFarm is a blockchain-based platform that aims to revolutionize sustainable farming practices and supply chain transparency. By leveraging blockchain technology, we can create an immutable record of farming practices, supply chain movements, and product authenticity. This will enable consumers to verify the sustainability claims of agricultural products, while farmers can receive fair compensation for their sustainable practices.",
  category: "Agriculture",
  fundingGoal: 50000,
  currentFunding: 32500,
  backers: 128,
  daysRemaining: 15,
  status: "verified",
  image: "/placeholder.svg?height=400&width=800&text=EcoFarm",
  creatorVerified: true,
  tags: ["Sustainability", "Blockchain", "Agriculture", "Supply Chain"],
  milestones: [
    {
      id: "m1",
      title: "Platform Development",
      description: "Complete the core platform development including smart contracts and basic UI.",
      deadline: "2023-06-30",
      status: "completed",
      fundingPercentage: 25,
    },
    {
      id: "m2",
      title: "Pilot Program",
      description: "Launch pilot program with 10 farms to test the platform and gather feedback.",
      deadline: "2023-09-30",
      status: "in-progress",
      fundingPercentage: 35,
    },
    {
      id: "m3",
      title: "Mobile App Development",
      description: "Develop and launch mobile applications for farmers and consumers.",
      deadline: "2023-12-31",
      status: "pending",
      fundingPercentage: 25,
    },
    {
      id: "m4",
      title: "Full Launch",
      description: "Complete platform launch with marketing campaign and onboarding of 100+ farms.",
      deadline: "2024-03-31",
      status: "pending",
      fundingPercentage: 15,
    },
  ],
  documents: [
    {
      id: "d1",
      title: "Project Pitch Deck",
      type: "pdf",
      url: "#",
    },
    {
      id: "d2",
      title: "Technical Whitepaper",
      type: "pdf",
      url: "#",
    },
    {
      id: "d3",
      title: "Team Background",
      type: "pdf",
      url: "#",
    },
  ],
  smartContract: {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    network: "Ethereum",
    deployedDate: "2023-04-15",
    transactions: [
      { hash: "0xabc...123", date: "2023-05-10", type: "Contribution", amount: "2.5 ETH" },
      { hash: "0xdef...456", date: "2023-06-15", type: "Milestone Release", amount: "1.2 ETH" },
    ],
  },
  updates: [
    {
      id: "u1",
      date: "2023-05-10",
      title: "Development Update",
      content: "We've completed the first phase of development and are now moving to testing.",
    },
    {
      id: "u2",
      date: "2023-06-15",
      title: "New Partnership",
      content: "We're excited to announce a partnership with FarmTech Solutions to enhance our platform capabilities.",
    },
  ],
  team: [
    { name: "Jane Smith", role: "CEO & Founder", image: "/placeholder.svg?height=100&width=100&text=JS" },
    { name: "John Doe", role: "CTO", image: "/placeholder.svg?height=100&width=100&text=JD" },
    { name: "Alice Johnson", role: "Lead Developer", image: "/placeholder.svg?height=100&width=100&text=AJ" },
  ],
  faqs: [
    {
      question: "How does the milestone-based funding work?",
      answer:
        "Funds are held in escrow and released only when milestones are completed and verified by backers. This ensures accountability and reduces risk.",
    },
    {
      question: "What happens if a milestone isn't completed?",
      answer:
        "If a milestone cannot be completed, backers can vote to either extend the deadline or request a partial refund of the remaining funds.",
    },
    {
      question: "How are the smart contracts audited?",
      answer:
        "All smart contracts are audited by independent security firms before deployment to ensure they're secure and function as intended.",
    },
  ],
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id
  const project = mockProject // In a real app, you would fetch the project based on the ID

  const [fundAmount, setFundAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("milestones")
  const [fundingStep, setFundingStep] = useState<"wallet" | "amount">("wallet")
  const [walletConnected, setWalletConnected] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user has wallet connected
  useEffect(() => {
    if (user?.walletAddress) {
      setWalletConnected(true)
      setFundingStep("amount")
    }
  }, [user])

  const handleFund = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)

      // Update local storage to simulate funding
      const fundedProjects = JSON.parse(localStorage.getItem("fundedProjects") || "[]")
      fundedProjects.push({
        projectId: project.id,
        amount: Number.parseFloat(fundAmount),
        date: new Date().toISOString(),
      })
      localStorage.setItem("fundedProjects", JSON.stringify(fundedProjects))

      toast({
        title: "Project Funded",
        description: `You have successfully funded ${project.title} with $${fundAmount}`,
      })
    }, 1500)
  }

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true)
    setFundingStep("amount")
  }

  const handleFundClick = () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent(`/projects/${projectId}`)}`)
      return
    }

    // Open dialog
    setDialogOpen(true)

    // If user is logged in but wallet not connected, show wallet step
    if (!walletConnected) {
      setFundingStep("wallet")
    } else {
      setFundingStep("amount")
    }
  }

  const getMilestoneStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="info">
            <Clock className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="container px-4 py-12">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary">
              Projects
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm">{project.title}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative mb-6 overflow-hidden rounded-xl">
              <GlowEffect size="md">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={800}
                  height={400}
                  className="w-full rounded-xl object-cover"
                />
              </GlowEffect>
              <div className="absolute right-4 top-4 flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm"
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{liked ? "Remove from favorites" : "Add to favorites"}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm"
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: project.title,
                              text: project.description,
                              url: window.location.href,
                            })
                            .catch(() => {
                              navigator.clipboard.writeText(window.location.href)
                              toast({
                                title: "Link copied",
                                description: "Project link copied to clipboard",
                              })
                            })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          toast({
                            title: "Link copied",
                            description: "Project link copied to clipboard",
                          })
                        }
                      }}
                    >
                      <Share2 className="h-5 w-5 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share project</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold">{project.title}</h1>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Link
                  href={`/profile/${project.creatorId}`}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <User className="mr-1 h-4 w-4" />
                  {project.creator}
                </Link>
                {project.creatorVerified && (
                  <Badge variant="success">
                    <CheckCircle className="mr-1 h-3 w-3" /> KYC Verified
                  </Badge>
                )}
                <Badge variant="secondary">{project.category}</Badge>
                {project.tags &&
                  project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
              </div>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              <TabsContent value="milestones" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Project Milestones</h3>
                  <div className="relative space-y-8 pl-8 before:absolute before:left-3 before:top-0 before:h-full before:w-[2px] before:bg-muted">
                    {project.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="relative">
                        <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {index + 1}
                        </div>
                        <AnimatedGradientBorder>
                          <div className="rounded-lg border-0 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="font-semibold">{milestone.title}</h4>
                              {getMilestoneStatusBadge(milestone.status)}
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">{milestone.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Deadline: {milestone.deadline}</span>
                              <span>{milestone.fundingPercentage}% of total funding</span>
                            </div>
                            {milestone.status === "in-progress" && (
                              <div className="mt-3 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Progress</span>
                                  <span>65%</span>
                                </div>
                                <Progress value={65} className="h-1.5" />
                              </div>
                            )}
                          </div>
                        </AnimatedGradientBorder>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Project Documents</h3>
                  <div className="space-y-4">
                    {project.documents.map((document) => (
                      <AnimatedGradientBorder key={document.id}>
                        <div className="flex items-center justify-between rounded-lg border-0 p-4">
                          <div className="flex items-center">
                            <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                            <span>{document.title}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={document.url}>
                                <Download className="mr-1 h-4 w-4" /> Download
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </AnimatedGradientBorder>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="updates" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Project Updates</h3>
                  <div className="space-y-4">
                    {project.updates.map((update) => (
                      <AnimatedGradientBorder key={update.id}>
                        <Card className="border-0">
                          <CardHeader>
                            <CardTitle className="text-lg">{update.title}</CardTitle>
                            <CardDescription>{update.date}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{update.content}</p>
                          </CardContent>
                        </Card>
                      </AnimatedGradientBorder>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="team" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Project Team</h3>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {project.team.map((member) => (
                      <AnimatedGradientBorder key={member.name}>
                        <Card className="border-0 text-center">
                          <CardContent className="pt-6">
                            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                              <Image
                                src={member.image || "/placeholder.svg"}
                                alt={member.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <h4 className="mb-1 text-lg font-semibold">{member.name}</h4>
                            <p className="text-sm text-purple-400">{member.role}</p>
                          </CardContent>
                        </Card>
                      </AnimatedGradientBorder>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="faq" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {project.faqs.map((faq, index) => (
                      <AnimatedGradientBorder key={index}>
                        <Card className="border-0">
                          <CardHeader>
                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{faq.answer}</p>
                          </CardContent>
                        </Card>
                      </AnimatedGradientBorder>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <AnimatedGradientBorder>
              <Card className="border-0">
                <CardContent className="pt-6">
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        ${project.currentFunding.toLocaleString()} of ${project.fundingGoal.toLocaleString()}
                      </span>
                      <span>{Math.round((project.currentFunding / project.fundingGoal) * 100)}%</span>
                    </div>
                    <Progress value={(project.currentFunding / project.fundingGoal) * 100} className="h-2" />
                  </div>
                  <div className="mb-6 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{project.backers}</div>
                      <div className="text-sm text-muted-foreground">Backers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{project.daysRemaining}</div>
                      <div className="text-sm text-muted-foreground">Days Left</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="glow" onClick={handleFundClick}>
                    Fund This Project
                  </Button>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fund {project.title}</DialogTitle>
                  <DialogDescription>
                    {fundingStep === "wallet"
                      ? "Connect your wallet to fund this project"
                      : "Enter the amount you would like to contribute to this project"}
                  </DialogDescription>
                </DialogHeader>
                {!showSuccess ? (
                  <>
                    {fundingStep === "wallet" ? (
                      <div className="py-6 text-center">
                        <p className="mb-6 text-sm text-muted-foreground">
                          You need to connect your wallet before you can fund this project.
                        </p>
                        <WalletConnectButton onSuccess={handleWalletConnect} className="mx-auto" variant="glow" />
                      </div>
                    ) : (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="100"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                          />
                        </div>
                        <div className="rounded-lg bg-muted p-4 text-sm">
                          <p className="mb-2 font-medium">Important Information:</p>
                          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                            <li>Funds will be held in escrow and released based on milestone completion.</li>
                            <li>You can vote on milestone completion to release funds.</li>
                            <li>If the project fails to meet milestones, you may be eligible for a partial refund.</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" type="button" disabled={isLoading} onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      {fundingStep === "amount" && (
                        <Button type="button" onClick={handleFund} disabled={isLoading || !fundAmount}>
                          {isLoading ? "Processing..." : "Confirm Funding"}
                        </Button>
                      )}
                    </DialogFooter>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                    <h3 className="mb-2 text-xl font-semibold">Thank You for Your Support!</h3>
                    <p className="mb-4 text-muted-foreground">
                      Your contribution of ${fundAmount} to {project.title} has been processed successfully.
                    </p>
                    <Button
                      onClick={() => {
                        setShowSuccess(false)
                        setDialogOpen(false)
                      }}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <AnimatedGradientBorder>
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Smart Contract Details
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="ml-2 h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          This project is powered by a smart contract on the blockchain, ensuring transparency and
                          automated milestone-based funding.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Contract Address:</span>
                      <span className="flex items-center font-mono text-xs">
                        {project.smartContract.address.substring(0, 8)}...
                        {project.smartContract.address.substring(project.smartContract.address.length - 8)}
                        <Button variant="ghost" size="icon" className="ml-1 h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span>{project.smartContract.network}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Deployed Date:</span>
                      <span>{project.smartContract.deployedDate}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Current State:</span>
                      <Badge variant="info">Active</Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium">Recent Transactions</h4>
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-md bg-secondary/50 p-2 text-xs">
                      {project.smartContract.transactions.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md bg-background p-2">
                          <div>
                            <div className="font-mono">{tx.hash}</div>
                            <div className="text-muted-foreground">{tx.date}</div>
                          </div>
                          <div className="text-right">
                            <div>{tx.type}</div>
                            <div className="font-medium text-purple-400">{tx.amount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
