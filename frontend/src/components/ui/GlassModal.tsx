"use client"

import type React from "react"
import { cn } from "../../utils/cn"
import Glass from "./Glass"

interface GlassModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const GlassModal: React.FC<GlassModalProps> = ({ children, isOpen, onClose, className, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Glass modal */}
      <Glass
        variant="colored"
        blur="xl"
        className={cn("relative w-full p-6 animate-in fade-in-0 zoom-in-95 duration-300", sizeClasses[size], className)}
      >
        {children}
      </Glass>
    </div>
  )
}

export default GlassModal
