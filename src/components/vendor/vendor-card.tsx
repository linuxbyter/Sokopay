"use client";

import Link from "next/link";
import { Vendor } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { MapPin, Clock, ShoppingBag, CheckCircle } from "lucide-react";

interface VendorCardProps {
  vendor: Vendor;
  compact?: boolean;
  className?: string;
}

export function VendorCard({ vendor, compact, className }: VendorCardProps) {
  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className={cn(
        "group block bg-white rounded-2xl border border-neutral-100 p-4 transition-all duration-200",
        "hover:shadow-card-hover hover:border-neutral-200",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={vendor.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-neutral-900 truncate">
              {vendor.name}
            </h3>
            {vendor.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0 fill-brand-50" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={vendor.rating} showValue />
            <span className="text-2xs text-neutral-400">({vendor.reviewCount})</span>
          </div>
        </div>
        <Badge
          variant={vendor.isOpen ? "success" : "default"}
          dot
          size="sm"
        >
          {vendor.isOpen ? "Open" : "Closed"}
        </Badge>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {vendor.marketLocation}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {vendor.openHours}
        </span>
      </div>

      <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
        {vendor.description}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-50">
        <div className="flex items-center gap-1 text-2xs text-neutral-400">
          <ShoppingBag className="w-3 h-3" />
          {vendor.orderCount.toLocaleString()} orders
        </div>
        <div className="flex gap-1.5">
          {vendor.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-2xs px-1.5 py-0.5 bg-neutral-50 text-neutral-500 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function VendorCardCompact({ vendor, className }: VendorCardProps) {
  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors",
        className
      )}
    >
      <Avatar name={vendor.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-medium text-neutral-900 truncate">
            {vendor.name}
          </h3>
          {vendor.verified && (
            <CheckCircle className="w-3 h-3 text-brand-600 shrink-0 fill-brand-50" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <StarRating rating={vendor.rating} />
          <span>{vendor.marketLocation}</span>
        </div>
      </div>
      <Badge variant={vendor.isOpen ? "success" : "default"} dot size="sm">
        {vendor.isOpen ? "Open" : "Closed"}
      </Badge>
    </Link>
  );
}
