"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "primary";
}

export function Button({ className, variant = "default", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants: Record<string, string> = {
    default: "bg-white/80 text-black border border-gray-200 hover:bg-white/90",
    ghost: "bg-transparent text-black hover:bg-gray-100",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
