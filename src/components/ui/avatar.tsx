"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-12 text-lg shrink-0 overflow-hidden rounded-full bg-foreground text-background items-center justify-center hover:bg-foreground/60",
        className
      )}
      {...props}
    />
  )
}

export { Avatar }
