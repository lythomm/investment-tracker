"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantClasses = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 border border-transparent font-semibold",
  secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 font-medium",
  outline: "bg-white text-slate-600 hover:bg-slate-50 border border-dashed border-slate-300 font-medium",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent font-medium",
  danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-semibold",
};

const sizeClasses = {
  xs: "px-3 py-1.5 text-xs rounded-full gap-1.5",
  sm: "px-4 py-2 text-xs rounded-full gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-full gap-2",
  lg: "px-6 py-3 text-base rounded-full gap-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "sm",
      isLoading = false,
      icon,
      children,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-colors duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
