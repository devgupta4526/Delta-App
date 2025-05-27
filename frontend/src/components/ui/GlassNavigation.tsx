import type React from "react"
import { cn } from "../../utils/cn"
import Glass from "./Glass"

interface GlassNavigationProps {
  children: React.ReactNode
  className?: string
  position?: "top" | "bottom" | "floating"
}

const GlassNavigation: React.FC<GlassNavigationProps> = ({ children, className, position = "floating" }) => {
  const positionClasses = {
    top: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
    bottom: "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
    floating: "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
  }

  return (
    <Glass
      variant="colored"
      blur="lg"
      className={cn(
        "px-6 py-3 hover:scale-105 transition-transform duration-300",
        positionClasses[position],
        className,
      )}
    >
      {children}
    </Glass>
  )
}

export default GlassNavigation
