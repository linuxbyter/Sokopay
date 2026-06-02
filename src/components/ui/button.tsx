import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-950 shadow-sm":
              variant === "primary",
            "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300":
              variant === "secondary",
            "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800":
              variant === "danger",
            "border border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100":
              variant === "outline",
          },
          {
            "h-8 px-3 text-xs rounded-lg gap-1.5": size === "sm",
            "h-10 px-5 text-sm rounded-xl gap-2": size === "md",
            "h-12 px-6 text-base rounded-xl gap-2.5": size === "lg",
          },
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
