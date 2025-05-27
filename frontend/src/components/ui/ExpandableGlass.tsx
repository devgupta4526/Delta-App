"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "../../utils/cn"
import Glass from "./Glass"

interface ExpandableGlassProps {
  title: string
  children: React.ReactNode
  className?: string
  variant?: "light" | "medium" | "dark" | "colored"
  defaultExpanded?: boolean
  icon?: React.ReactNode
  badge?: string | number
  onToggle?: (expanded: boolean) => void
}

const ExpandableGlass: React.FC<ExpandableGlassProps> = ({
  title,
  children,
  className,
  variant = "light",
  defaultExpanded = false,
  icon,
  badge,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [height, setHeight] = useState<number | undefined>(defaultExpanded ? undefined : 0)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight
      setHeight(isExpanded ? scrollHeight : 0)
    }
  }, [isExpanded])

  const handleToggle = () => {
    setIsAnimating(true)
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onToggle?.(newExpanded)

    setTimeout(() => {
      setIsAnimating(false)
    }, 400)
  }

  return (
    <Glass variant={variant} className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer transition-all duration-200",
          "hover:bg-white/10 active:bg-white/20",
          isAnimating && "animate-pulse",
        )}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={cn("transition-transform duration-300", isExpanded ? "rotate-90" : "rotate-0")}>{icon}</div>
          )}
          <span className="font-semibold text-gray-800">{title}</span>
          {badge && <span className="px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full">{badge}</span>}
        </div>

        {/* Animated Plus/Minus Icon */}
        <div
          className={cn(
            "w-6 h-6 flex items-center justify-center transition-all duration-300 transform-gpu",
            isExpanded ? "rotate-45 scale-110" : "rotate-0 scale-100",
          )}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      {/* Animated Content */}
      <div
        ref={contentRef}
        className={cn(
          "transition-all duration-400 ease-in-out transform-gpu",
          "overflow-hidden",
          isExpanded ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95",
        )}
        style={{
          height: height,
          transformOrigin: "top center",
        }}
      >
        <div className="px-4 pb-4 border-t border-white/20">
          <div
            className={cn(
              "pt-4 transition-all duration-300 delay-100",
              isExpanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </Glass>
  )
}

export default ExpandableGlass
