"use client"

import type React from "react"
import { cn } from "../../utils/cn"
import Glass from "./Glass"

interface GlassFloatingButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  variant?: "primary" | "secondary" | "accent"
}

const GlassFloatingButton: React.FC<GlassFloatingButtonProps> = ({
  children,
  onClick,
  className,
  size = "md",
  position = "bottom-right",
  variant = "primary",
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  }

  const positionClasses = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  }

  const variantClasses = {
    primary: "bg-gradient-to-br from-blue-500/30 to-purple-600/30 text-blue-700 border-blue-300/30",
    secondary: "bg-gradient-to-br from-gray-500/30 to-gray-600/30 text-gray-700 border-gray-300/30",
    accent: "bg-gradient-to-br from-teal-500/30 to-green-600/30 text-teal-700 border-teal-300/30",
  }

  return (
    <Glass
      blur="lg"
      border={true}
      shadow={true}
      className={cn(
        "flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 z-50",
        sizeClasses[size],
        positionClasses[position],
        variantClasses[variant],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Glass>
  )
}

export default GlassFloatingButton
