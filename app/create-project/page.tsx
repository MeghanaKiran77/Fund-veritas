"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileUpload } from "@/components/file-upload"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Check, HelpCircle, Info, Plus, Trash, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { SmartContractPreview } from "@/components/smart-contract-preview"
import { Badge } from "@/components/ui/badge"

interface Milestone {
  id: string
  title: string
  description: string
  deadline: string
  fundingPercentage: number
}

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [fundingGoal, setFundingGoal] = useState("")
  const [deadline, setDeadline] = useState("")
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "",
      description: "",
      deadline: "",
      fundingPercentage: 0,
    },
  ])
  const [media, setMedia] = useState<{ file: File | null; previewUrl?: string }[]>([{ file: null }])
  const [documents, setDocuments] = useState<{ name: string; file: File | null }[]>([
    { name: "Project Pitch Deck", file: null },
    { name: "Team Information", file: null },
  ])
  const [walletAddress, setWalletAddress] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [contractAddress, setContractAddress] = useState("")

  // Check if user is authorized to create projects
  useEffect(() => {
    setIsCheckingAuth(true)

    // If user is not logged in, redirect to login
    if (user === null) {
      router.push("/login?redirect=/create-project")
      return
    }

    // If user is logged in but not a creator, show error
    if (user && user.role !== "creator") {
      toast({
        title: "Unauthorized",
        description: "Only creators can create projects",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    // If user is logged in but KYC not approved, redirect to KYC
    if (user && user.kycStatus !== "approved") {
      toast({
        title: "KYC Required",
        description: "You need to complete KYC verification before creating projects",
        variant: "destructive",
      })
      router.push("/profile/kyc")
      return
    }

    // If user has wallet address, set it
    if (user && user.walletAddress) {
      setWalletAddress(user.walletAddress)
    }

    setIsCheckingAuth(false)
  }, [user, router, toast])

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!title || !description || !category || !fundingGoal || !deadline) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 2) {
      const totalPercentage = milestones.reduce((sum, milestone) => sum + milestone.fundingPercentage, 0)
      if (totalPercentage !== 100) {
        toast({
          title: "Invalid Milestone Allocation",
          description: "The total funding percentage across all milestones must equal 100%.",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: (milestones.length + 1).toString(),
        title: "",
        description: "",
        deadline: "",
        fundingPercentage: 0,
      },
    ])
  }

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((milestone) => milestone.id !== id))
    }
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string | number) => {
    setMilestones(milestones.map((milestone) => (milestone.id === id ? { ...milestone, [field]: value } : milestone)))
  }

  const addMedia = () => {
    setMedia([...media, { file: null }])
  }

  const removeMedia = (index: number) => {
    const newMedia = [...media]
    newMedia.splice(index, 1)
    setMedia(newMedia)
  }

  const handleMediaChange = (index: number, file: File) => {
    const newMedia = [...media]
    newMedia[index] = { file }
    setMedia(newMedia)
  }

  const handleDocumentChange = (index: number, file: File) => {
    const newDocuments = [...documents]
    newDocuments[index].file = file
    setDocuments(newDocuments)
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)

    // Simulate contract deployment
    setIsLoading(true)
    setTimeout(() => {
      setContractAddress("0x" + Math.random().toString(16).substring(2, 42))
      setIsLoading(false)
      toast({
        title: "Smart Contract Deployed",
        description: "Your project's smart contract has been deployed successfully.",
      })
    }, 2000)
  }

  const submitProject = async () => {
    setIsLoading(true)

    try {
      // Upload media files to Cloudinary
      const mediaUrls = await Promise.all(
        media
          .filter((m) => m.file)
          .map(async (m) => {
            // In a real app, you would upload to Cloudinary here
            return {
              url: URL.createObjectURL(m.file!),
              type: m.file!.type.startsWith("image/") ? "image" : "video",
            }
          }),
      )

      // Upload documents to Cloudinary
      const documentUrls = await Promise.all(
        documents
          .filter((d) => d.file)
          .map(async (d) => {
            // In a real app, you would upload to Cloudinary here
            return {
              name: d.name,
              url: URL.createObjectURL(d.file!),
              type: d.file!.type,
            }
          }),
      )

      // Create project in database
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          fundingGoal: Number(fundingGoal),
          deadline,
          milestones,
          tags,
          media: mediaUrls,
          documents: documentUrls,
          contractAddress,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create project")
      }

      toast({
        title: "Project Created",
        description: "Your project has been submitted for review.",
      })

      router.push("/dashboard/creator")
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="container flex min-h-screen items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p>Checking authorization...</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="container px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            <span className="text-gradient">Create</span> Your Project
          </h1>
          <p className="text-muted-foreground">Launch your idea with transparent, milestone-based funding</p>
        </div>

        <div className="mx-auto mb-8 flex max-w-3xl justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                currentStep === step ? "text-primary" : currentStep > step ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep === step
                    ? "border-primary bg-primary/10"
                    : currentStep > step
                      ? "border-green-500 bg-green-500/10"
                      : "border-muted bg-muted/10"
                }`}
              >
                {currentStep > step ? <Check className="h-5 w-5" /> : step}
              </div>
              <span className="mt-2 text-xs font-medium sm:text-sm">
                {step === 1 ? "Basic Info" : step === 2 ? "Milestones" : step === 3 ? "Media & Docs" : "Finalize"}
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardContent className="pt-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Project Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear, descriptive title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Project Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project, its goals, and impact"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="energy">Energy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="fundingGoal">
                          Funding Goal (USD) <span className="text-red-500">*</span>
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Set a realistic funding goal that covers all project expenses and milestones.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="fundingGoal"
                        type="number"
                        placeholder="e.g., 50000"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">
                      Funding Deadline <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="deadline"
                        type="date"
                        className="pl-10"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Project Tags (up to 5)</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Add a tag (e.g., Blockchain, Education)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <Button type="button" onClick={addTag} disabled={!newTag || tags.length >= 5}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Project Milestones</h2>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Info className="mr-1 h-4 w-4" />
                      Total: {milestones.reduce((sum, m) => sum + m.fundingPercentage, 0)}%
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p>
                      Break your project into milestones. Each milestone will receive a percentage of the total funding
                      upon completion and verification.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="rounded-lg border p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-semibold">Milestone {index + 1}</h3>
                          {milestones.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMilestone(milestone.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`milestone-title-${milestone.id}`}>Title</Label>
                            <Input
                              id={`milestone-title-${milestone.id}`}
                              placeholder="e.g., Platform Development"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`milestone-deadline-${milestone.id}`}>Target Date</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id={`milestone-deadline-${milestone.id}`}
                                type="date"
                                className="pl-10"
                                value={milestone.deadline}
                                onChange={(e) => updateMilestone(milestone.id, "deadline", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Label htmlFor={`milestone-description-${milestone.id}`}>Description</Label>
                          <Textarea
                            id={`milestone-description-${milestone.id}`}
                            placeholder="Describe what will be accomplished in this milestone"
                            rows={2}
                            value={milestone.description}
                            onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                          />
                        </div>

                        <div className="mt-4 space-y-2">
                          <Label htmlFor={`milestone-percentage-${milestone.id}`}>
                            Funding Percentage (Total must equal 100%)
                          </Label>
                          <Input
                            id={`milestone-percentage-${milestone.id}`}
                            type="number"
                            min="1"
                            max="100"
                            placeholder="e.g., 25"
                            value={milestone.fundingPercentage || ""}
                            onChange={(e) =>
                              updateMilestone(milestone.id, "fundingPercentage", Number.parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" onClick={addMilestone} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Another Milestone
                  </Button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">Project Media</h2>
                    <div className="space-y-4">
                      {media.map((item, index) => (
                        <div key={index} className="relative">
                          <FileUpload
                            onFileSelect={(file) => handleMediaChange(index, file)}
                            onFileRemove={() => removeMedia(index)}
                            selectedFile={item.file}
                            accept="image/*,video/*"
                            label={`Upload Project Image or Video ${index + 1}`}
                            previewUrl={item.previewUrl}
                          />
                        </div>
                      ))}
                      <Button variant="outline" onClick={addMedia} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add More Media
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="mb-4 text-xl font-semibold">Project Documents</h2>
                    <div className="space-y-4">
                      {documents.map((doc, index) => (
                        <div key={index} className="relative">
                          <FileUpload
                            onFileSelect={(file) => handleDocumentChange(index, file)}
                            onFileRemove={() => {
                              const newDocs = [...documents]
                              newDocs[index].file = null
                              setDocuments(newDocs)
                            }}
                            selectedFile={doc.file}
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            label={doc.name}
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setDocuments([...documents, { name: "Additional Document", file: null }])}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Another Document
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Finalize Your Project</h2>

                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p>
                      Connect your wallet to deploy the smart contract for your project. This will create an immutable
                      record on the blockchain.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-4 font-semibold">Connect Wallet</h3>
                      {walletAddress ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-2 h-5 w-5 rounded-full bg-green-500"></div>
                            <span className="font-mono">{walletAddress}</span>
                          </div>
                          <Badge variant="success">
                            <Check className="mr-1 h-3 w-3" /> Connected
                          </Badge>
                        </div>
                      ) : (
                        <WalletConnectButton onSuccess={handleWalletConnect} className="w-full" />
                      )}
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-4 font-semibold">Project Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Title:</span>
                          <span className="font-medium">{title}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{category}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Funding Goal:</span>
                          <span className="font-medium">${Number.parseInt(fundingGoal || "0").toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deadline:</span>
                          <span className="font-medium">{deadline}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Milestones:</span>
                          <span className="font-medium">{milestones.length}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Media:</span>
                          <span className="font-medium">{media.filter((m) => m.file).length}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Documents:</span>
                          <span className="font-medium">{documents.filter((d) => d.file).length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900 dark:bg-yellow-950">
                      <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-300">Important Notice</h3>
                      <p className="text-yellow-700 dark:text-yellow-400">
                        By submitting this project, you agree to our terms of service and confirm that all information
                        provided is accurate. Your project will be reviewed by our team before being published.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                {currentStep < 4 ? (
                  <Button onClick={handleNextStep}>Next</Button>
                ) : (
                  <Button onClick={submitProject} disabled={isLoading || !walletAddress || !contractAddress}>
                    {isLoading ? "Submitting..." : "Submit Project"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Smart Contract Preview */}
          <div className="lg:col-span-2">
            {currentStep >= 2 && (
              <SmartContractPreview
                projectName={title || "MyProject"}
                fundingGoal={Number.parseInt(fundingGoal) || 50000}
                milestones={milestones.map((m) => ({
                  title: m.title || "Untitled Milestone",
                  fundingPercentage: m.fundingPercentage,
                }))}
                deadline={deadline || "2023-12-31"}
                creatorAddress={walletAddress || "0x0000...0000"}
              />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
