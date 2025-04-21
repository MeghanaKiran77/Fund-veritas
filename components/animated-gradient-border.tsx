import type React from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  gradientClassName?: string
  animationDuration?: string
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  gradientClassName,
  animationDuration = "3s",
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative rounded-xl p-[1px] overflow-hidden", containerClassName)}>
      <div
        className={cn("absolute inset-0 rounded-xl bg-neon-glow animate-gradient-shift", gradientClassName)}
        style={{
          backgroundSize: "200% 200%",
          animationDuration,
        }}
      />
      <div className={cn("relative rounded-[calc(0.75rem-1px)] bg-card z-10", className)}>{children}</div>
    </div>
  )
}
