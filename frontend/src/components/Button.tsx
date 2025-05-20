import { type ButtonHTMLAttributes } from "react";
import { Colors } from "../theme/colors.ts";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full py-2 px-4 rounded-md font-semibold text-white transition
        bg-[${Colors.primary}] hover:bg-[${Colors.accent}] focus:ring-2 focus:ring-[${Colors.primary}]`}
    >
      {children}
    </button>
  );
}
