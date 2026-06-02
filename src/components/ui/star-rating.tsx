import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  showValue,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "shrink-0",
            size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4",
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-400/50 text-amber-400"
              : "fill-neutral-200 text-neutral-200"
          )}
        />
      ))}
      {showValue && (
        <span
          className={cn(
            "font-medium text-neutral-700 ml-1",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
