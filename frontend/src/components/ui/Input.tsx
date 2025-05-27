import type React from "react"
import { cn } from "../../utils/cn"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300",
            icon && "pl-12",
            error && "border-red-300 focus:ring-red-500/20 focus:border-red-500",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  )
}

export default Input
