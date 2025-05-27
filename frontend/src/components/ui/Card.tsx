import type React from "react"
import { cn } from "../../utils/cn"

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ children, className, padding = "md", hover = false }) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm transition-all duration-300",
        hover && "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
