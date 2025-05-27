"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "../../utils/cn"
import Glass from "./Glass"

interface ActionMenuItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "default" | "danger" | "success" | "warning"
  disabled?: boolean
}

interface GlassActionMenuProps {
  items: ActionMenuItem[]
  className?: string
  variant?: "light" | "medium" | "dark" | "colored"
  trigger?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

const GlassActionMenu: React.FC<GlassActionMenuProps> = ({
  items,
  className,
  variant = "light",
  trigger,
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item: ActionMenuItem) => {
    if (item.disabled) return

    setAnimatingItems((prev) => new Set(prev).add(item.id))
    setTimeout(() => {
      item.onClick()
      setIsOpen(false)
      setAnimatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }, 150)
  }

  const getItemVariantClasses = (itemVariant = "default") => {
    const variants = {
      default: "text-gray-700 hover:bg-blue-50/50",
      danger: "text-red-600 hover:bg-red-50/50",
      success: "text-green-600 hover:bg-green-50/50",
      warning: "text-yellow-600 hover:bg-yellow-50/50",
    }
    return variants[itemVariant as keyof typeof variants]
  }

  const defaultTrigger = (
    <Glass
      variant={variant}
      className={cn(
        "flex items-center justify-center cursor-pointer transition-all duration-300",
        "hover:scale-110 active:scale-90",
        sizeClasses[size],
        isOpen && "rotate-45 scale-110 bg-blue-500/20",
      )}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </Glass>
  )

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Trigger */}
      <div onClick={handleToggle}>{trigger || defaultTrigger}</div>

      {/* Action Items */}
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="flex flex-col space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn("animate-in slide-in-from-top-2 fade-in-0 duration-200", `delay-${index * 50}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Glass
                  variant={variant}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    "transform-gpu origin-center",
                    getItemVariantClasses(item.variant),
                    item.disabled && "opacity-50 cursor-not-allowed hover:scale-100",
                    animatingItems.has(item.id) && "animate-pulse scale-95",
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 transition-transform duration-200",
                      animatingItems.has(item.id) && "rotate-12",
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                </Glass>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

export default GlassActionMenu
