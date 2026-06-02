import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-full",
        {
          "bg-neutral-100 text-neutral-700 border-neutral-200": variant === "default",
          "bg-emerald-50 text-emerald-700 border-emerald-200": variant === "success",
          "bg-amber-50 text-amber-700 border-amber-200": variant === "warning",
          "bg-red-50 text-red-600 border-red-200": variant === "danger",
          "bg-blue-50 text-blue-700 border-blue-200": variant === "info",
          "bg-transparent text-neutral-600 border-neutral-300": variant === "outline",
          "text-2xs px-1.5 py-0.5": size === "sm",
          "text-xs px-2 py-0.5": size === "md",
        },
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full mr-1.5", {
            "bg-neutral-500": variant === "default",
            "bg-emerald-500": variant === "success",
            "bg-amber-500": variant === "warning",
            "bg-red-500": variant === "danger",
            "bg-blue-500": variant === "info",
          })}
        />
      )}
      {children}
    </span>
  );
}
