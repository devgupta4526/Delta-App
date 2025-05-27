"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface FloatingElementsProps {
  count?: number
  variant?: "circles" | "squares" | "triangles" | "mixed"
  speed?: "slow" | "medium" | "fast"
  size?: "small" | "medium" | "large"
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 20,
  variant = "mixed",
  speed = "medium",
  size = "medium",
}) => {
  const [elements, setElements] = useState<
    Array<{
      id: number
      x: number
      y: number
      delay: number
      duration: number
      shape: string
      color: string
      size: number
    }>
  >([])

  const shapes = {
    circles: ["⭕", "🔵", "🟣", "🟢", "🟡", "🔴"],
    squares: ["🟦", "🟪", "🟩", "🟨", "🟥", "⬜"],
    triangles: ["🔺", "🔻", "🔸", "🔹", "🔶", "🔷"],
    mixed: ["⭕", "🔵", "🟦", "🔺", "🔸", "🟣", "🟩", "🔻"],
  }

  const speedSettings = {
    slow: { min: 15, max: 25 },
    medium: { min: 10, max: 20 },
    fast: { min: 5, max: 15 },
  }

  const sizeSettings = {
    small: { min: 10, max: 20 },
    medium: { min: 15, max: 30 },
    large: { min: 25, max: 40 },
  }

  useEffect(() => {
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * (speedSettings[speed].max - speedSettings[speed].min) + speedSettings[speed].min,
      shape: shapes[variant][Math.floor(Math.random() * shapes[variant].length)],
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      size: Math.random() * (sizeSettings[size].max - sizeSettings[size].min) + sizeSettings[size].min,
    }))

    setElements(newElements)
  }, [count, variant, speed, size])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-float-random opacity-20 hover:opacity-40 transition-opacity"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
            fontSize: `${element.size}px`,
            color: element.color,
          }}
        >
          {element.shape}
        </div>
      ))}
    </div>
  )
}

export default FloatingElements
