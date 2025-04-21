import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500/20 text-green-500 border-green-500/50",
        warning: "border-transparent bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
        danger: "border-transparent bg-red-500/20 text-red-500 border-red-500/50",
        info: "border-transparent bg-blue-500/20 text-blue-500 border-blue-500/50",
        purple: "border-transparent bg-purple-500/20 text-purple-400 border-purple-500/50",
        gradient: "border-transparent bg-gradient-to-r from-purple-600 to-purple-400 text-white",
        glow: "border-transparent bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.7)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
