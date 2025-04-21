"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Heart, Share2, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnimatedGradientBorder } from "./animated-gradient-border"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    creator: string
    description: string
    category: string
    fundingGoal: number
    currentFunding: number
    backers: number
    daysRemaining: number
    status: string
    image: string
    tags?: string[]
    creatorVerified?: boolean
    trending?: boolean
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [liked, setLiked] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success">
            <CheckCircle className="mr-1 h-3 w-3" /> Verified
          </Badge>
        )
      case "unverified":
        return <Badge variant="warning">Unverified</Badge>
      case "funded":
        return <Badge variant="info">Funded</Badge>
      case "milestone-pending":
        return (
          <Badge variant="purple">
            <Clock className="mr-1 h-3 w-3" /> Milestone Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const percentFunded = Math.round((project.currentFunding / project.fundingGoal) * 100)

  return (
    <TooltipProvider>
      <AnimatedGradientBorder hoverEffect>
        <Card className="h-full overflow-hidden border-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            <div className="absolute right-2 top-2">{getStatusBadge(project.status)}</div>
            {project.trending && (
              <Badge variant="gradient" className="absolute left-2 top-2">
                <Sparkles className="mr-1 h-3 w-3" /> Trending
              </Badge>
            )}
            <div className="absolute bottom-2 right-2 flex space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setLiked(!liked)
                    }}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
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
                    className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      navigator
                        .share?.({
                          title: project.title,
                          text: project.description,
                          url: `/projects/${project.id}`,
                        })
                        .catch(() => {
                          navigator.clipboard.writeText(window.location.origin + `/projects/${project.id}`)
                        })
                    }}
                  >
                    <Share2 className="h-4 w-4 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share project</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1 flex items-center">
              {project.title}
              {project.creatorVerified && <Sparkles className="ml-2 h-4 w-4 text-purple-400" />}
            </CardTitle>
            <div className="text-sm text-purple-400">by {project.creator}</div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

            {project.tags && (
              <div className="mb-3 flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mb-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  ${project.currentFunding.toLocaleString()} of ${project.fundingGoal.toLocaleString()}
                </span>
                <span className={percentFunded >= 100 ? "text-green-500" : ""}>{percentFunded}%</span>
              </div>
              <Progress
                value={percentFunded}
                className="h-2"
                indicatorClassName={`animate-shimmer ${percentFunded >= 100 ? "from-green-700 to-green-500" : ""}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-md bg-secondary/50 p-1">
                <span className="block font-semibold">{project.backers}</span>
                <span className="text-xs text-muted-foreground">backers</span>
              </div>
              <div className="rounded-md bg-secondary/50 p-1">
                <span className="block font-semibold">{project.daysRemaining}</span>
                <span className="text-xs text-muted-foreground">days left</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="gradient" className="w-full">
              <Link href={`/projects/${project.id}`}>View Project</Link>
            </Button>
          </CardFooter>
        </Card>
      </AnimatedGradientBorder>
    </TooltipProvider>
  )
}
