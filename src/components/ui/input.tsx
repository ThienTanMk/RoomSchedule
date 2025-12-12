import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-sky-200 selection:text-sky-900 bg-white border border-gray-200 h-11 w-full min-w-0 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:border-sky-400",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
