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
  primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white font-semibold",
  secondary: "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 font-medium border border-subtle",
  outline: "bg-white/80 text-slate-600 hover:bg-white dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 font-medium border border-subtle",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 font-medium",
  danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 font-semibold",
};

const sizeClasses = {
  xs: "px-3 py-1.5 text-xs rounded-2xl gap-1.5",
  sm: "px-4 py-2 text-xs rounded-2xl gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-2xl gap-2",
  lg: "px-6 py-3 text-base rounded-2xl gap-2",
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
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
