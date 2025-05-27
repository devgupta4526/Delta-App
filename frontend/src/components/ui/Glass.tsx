import type React from "react"
import { cn } from "../../utils/cn"

interface GlassProps {
  children: React.ReactNode
  className?: string
  variant?: "light" | "medium" | "dark" | "colored"
  blur?: "sm" | "md" | "lg" | "xl"
  border?: boolean
  shadow?: boolean
  onClick?: () => void
}

const Glass: React.FC<GlassProps> = ({
  children,
  className,
  variant = "light",
  blur = "md",
  border = true,
  shadow = true,
}) => {
  const variantClasses = {
    light: "bg-white/20 text-gray-900",
    medium: "bg-white/30 text-gray-800",
    dark: "bg-black/20 text-white",
    colored: "bg-gradient-to-br from-white/25 to-white/10 text-gray-900",
  }

  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  }

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variantClasses[variant],
        blurClasses[blur],
        border && "border border-white/20",
        shadow && "shadow-xl shadow-black/10",
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Glass
