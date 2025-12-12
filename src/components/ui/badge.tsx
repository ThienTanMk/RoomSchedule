import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-sky-100 text-sky-800 border-transparent",
        secondary:
          "bg-slate-100 text-slate-900 border-transparent",
        destructive:
          "bg-red-100 text-red-700 border-transparent",
        outline: "text-foreground border-gray-200 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
