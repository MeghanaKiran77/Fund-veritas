import type React from "react"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface GlowEffectProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowClassName?: string
  size?: "sm" | "md" | "lg"
}

export function GlowEffect({ children, className, glowClassName, size = "md", ...props }: GlowEffectProps) {
  const sizeClasses = {
    sm: "shadow-[0_0_15px_5px_rgba(139,92,246,0.3)]",
    md: "shadow-[0_0_25px_10px_rgba(139,92,246,0.3)]",
    lg: "shadow-[0_0_40px_15px_rgba(139,92,246,0.3)]",
  }

  return (
    <div className={cn("relative", className)} {...props}>
      <div className={cn("absolute inset-0 rounded-xl blur-xl opacity-70", sizeClasses[size], glowClassName)} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
