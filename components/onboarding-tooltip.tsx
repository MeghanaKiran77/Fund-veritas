"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface OnboardingTooltipProps {
  id: string
  title: string
  description: string
  position?: "top" | "right" | "bottom" | "left"
  children: React.ReactNode
  onComplete?: () => void
  isOpen?: boolean
  onClose?: () => void
}

export function OnboardingTooltip({
  id,
  title,
  description,
  position = "bottom",
  children,
  onComplete,
  isOpen: controlledIsOpen,
  onClose,
}: OnboardingTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if this tooltip has been seen before
    const seen = localStorage.getItem(`onboarding-${id}`)
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen)
    } else if (!seen) {
      setIsOpen(true)
    }
  }, [id, controlledIsOpen])

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setIsOpen(false)
      localStorage.setItem(`onboarding-${id}`, "seen")
      if (onComplete) {
        onComplete()
      }
    }
  }

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  }

  const arrowClasses = {
    top: "bottom-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
    right: "left-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
    bottom: "top-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
  }

  return (
    <div className="relative">
      {children}
      {isOpen && (
        <div className={`absolute z-50 w-64 ${positionClasses[position]}`} onClick={(e) => e.stopPropagation()}>
          <Card className="border-purple-500 bg-card p-3 shadow-lg">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="text-sm font-semibold">{title}</h4>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{description}</p>
            <Button size="sm" className="w-full text-xs" onClick={handleClose}>
              Got it
            </Button>
          </Card>
          <div className={`absolute h-0 w-0 border-4 border-solid border-purple-500 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  )
}
