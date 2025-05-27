"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "../../utils/cn"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "accent" | "gradient"
  hover?: boolean
  floating?: boolean
  ripple?: boolean
  glow?: boolean
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  variant = "primary",
  hover = true,
  floating = false,
  ripple = false,
  glow = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)

  const variantClasses = {
    primary: "bg-white border-2 border-blue-200 shadow-lg",
    secondary: "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg",
    accent: "bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 shadow-lg",
    gradient: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl",
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!ripple) return

    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    }
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl transition-all duration-300 transform-gpu overflow-hidden",
        variantClasses[variant],
        hover && "hover:scale-105 hover:-translate-y-2 hover:shadow-2xl",
        floating && "animate-float",
        glow && "hover:shadow-glow",
        isHovered && "ring-4 ring-blue-300/50",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Animated Border */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl border-2 border-gradient-animated opacity-50 animate-border-flow" />
      )}
    </div>
  )
}

export default AnimatedCard
