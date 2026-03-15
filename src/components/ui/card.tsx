import * as React from "react"

import { cn } from "@/lib/utils"

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 text-card-foreground shadow-sm",
        "backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = "Card"

export { Card }

