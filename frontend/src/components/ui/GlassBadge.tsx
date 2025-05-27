import type React from "react"
import { cn } from "../../utils/cn"
import Glass from "./Glass"

interface GlassBadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "error" | "info" | "neutral"
  size?: "sm" | "md" | "lg"
  className?: string
  pulse?: boolean
  
}

const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className,
  pulse = false,
}) => {
  const variantClasses = {
    success: "bg-green-500/20 text-green-800 border-green-300/30",
    warning: "bg-yellow-500/20 text-yellow-800 border-yellow-300/30",
    error: "bg-red-500/20 text-red-800 border-red-300/30",
    info: "bg-blue-500/20 text-blue-800 border-blue-300/30",
    neutral: "bg-gray-500/20 text-gray-800 border-gray-300/30",
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  return (
    <Glass
      blur="md"
      border={true}
      shadow={true}
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        pulse && "animate-pulse",
        className,
      )}
    >
      {children}
    </Glass>
  )
}

export default GlassBadge
