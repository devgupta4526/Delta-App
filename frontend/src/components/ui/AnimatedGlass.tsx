"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "../../utils/cn"
import Glass from "./Glass"

interface AnimatedGlassProps {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
  variant?: "light" | "medium" | "dark" | "colored"
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  animationType?: "roll" | "shrink" | "fade" | "slide"
  direction?: "down" | "up" | "left" | "right"
  duration?: number
}

const AnimatedGlass: React.FC<AnimatedGlassProps> = ({
  children,
  trigger,
  className,
  variant = "light",
  isOpen: controlledIsOpen,
  onToggle,
  animationType = "roll",
  direction = "down",
  duration = 300,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const isControlled = controlledIsOpen !== undefined

  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const handleToggle = () => {
    const newState = !isOpen
    if (isControlled && onToggle) {
      onToggle(newState)
    } else {
      setInternalIsOpen(newState)
    }
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), duration)
  }

  const getAnimationClasses = () => {
    const base = `transition-all duration-${duration} ease-in-out`

    if (animationType === "roll") {
      return cn(
        base,
        "transform-gpu origin-top",
        isOpen ? "scale-y-100 opacity-100 translate-y-0" : "scale-y-0 opacity-0 -translate-y-2",
      )
    }

    if (animationType === "shrink") {
      return cn(base, "transform-gpu origin-center", isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0")
    }

    if (animationType === "slide") {
      const translateClass = {
        down: isOpen ? "translate-y-0" : "-translate-y-full",
        up: isOpen ? "translate-y-0" : "translate-y-full",
        left: isOpen ? "translate-x-0" : "translate-x-full",
        right: isOpen ? "translate-x-0" : "-translate-x-full",
      }

      return cn(base, "transform-gpu", isOpen ? "opacity-100" : "opacity-0", translateClass[direction])
    }

    // fade
    return cn(base, isOpen ? "opacity-100" : "opacity-0")
  }

  const getTriggerAnimationClasses = () => {
    return cn(
      "transition-all duration-200 ease-in-out transform-gpu",
      isOpen ? "rotate-45 scale-110" : "rotate-0 scale-100",
      isAnimating && "animate-pulse",
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Animated Trigger */}
      <div onClick={handleToggle} className={cn("cursor-pointer select-none", getTriggerAnimationClasses())}>
        {trigger}
      </div>

      {/* Animated Content */}
      <div
        ref={contentRef}
        className={cn("overflow-hidden", getAnimationClasses(), !isOpen && "pointer-events-none")}
        style={{
          height: isOpen ? "auto" : "0",
          ...(animationType === "roll" && {
            transformOrigin: "top center",
          }),
        }}
      >
        <Glass variant={variant} className={cn("mt-2", animationType === "roll" && "transform-gpu origin-top")}>
          {children}
        </Glass>
      </div>
    </div>
  )
}

export default AnimatedGlass
