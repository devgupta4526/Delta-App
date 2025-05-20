import { type InputHTMLAttributes, forwardRef } from "react";
import { Colors } from "../theme/colors.ts";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, ...props }, ref) => (
  <div className="mb-4 w-full">
    {label && <label className="block text-sm font-medium mb-1 text-[#1B1F3B]">{label}</label>}
    <input
      ref={ref}
      {...props}
      className={`w-full px-4 py-2 border rounded-md outline-none transition
        ${error ? 'border-red-500' : 'border-gray-300'} 
        focus:ring-2 focus:ring-[${Colors.primary}] focus:border-[${Colors.primary}]
        bg-white text-[${Colors.textPrimary}]`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
));

export default Input;
