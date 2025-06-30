"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified chart components - placeholder for now
export type ChartConfig = Record<string, { label?: string; color?: string }>

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex aspect-video justify-center text-xs", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
)

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background px-3 py-2 text-sm shadow-md",
      className
    )}
    {...props}
  />
))
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
)

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-4", className)}
    {...props}
  />
))
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}