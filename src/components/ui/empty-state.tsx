"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
      {icon && <div className="text-neutral-300 mb-4">{icon}</div>}
      <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again later.",
  action,
}: EmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={action}
    />
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center justify-center py-8">
      <svg
        className={cn("animate-spin text-brand-600", {
          "w-5 h-5": size === "sm",
          "w-8 h-8": size === "md",
          "w-12 h-12": size === "lg",
        })}
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
    </div>
  );
}
