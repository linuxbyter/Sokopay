"use client";

import Link from "next/link";
import { Order } from "@/lib/types";
import { cn, formatCurrency, formatDate, formatOrderStatus, getStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight, Clock, MapPin } from "lucide-react";

interface OrderCardProps {
  order: Order;
  showVendor?: boolean;
  className?: string;
}

export function OrderCard({ order, showVendor = true, className }: OrderCardProps) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className={cn(
        "block bg-white rounded-2xl border border-neutral-100 p-4 transition-all duration-200",
        "hover:shadow-card-hover hover:border-neutral-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {showVendor && (
            <p className="text-xs font-medium text-brand-700 mb-1">
              {order.vendorName}
            </p>
          )}
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-neutral-900">
              Order #{order.id.slice(-4)}
            </h3>
            <Badge className={cn(getStatusColor(order.status))} size="sm">
              {formatOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-300 mt-1 shrink-0" />
      </div>

      <div className="mt-2 space-y-1">
        {order.items.slice(0, 2).map((item) => (
          <p key={item.productId} className="text-xs text-neutral-500">
            {item.quantity}x {item.productName}
          </p>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-neutral-400">
            +{order.items.length - 2} more items
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-50">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(order.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            {order.fulfillmentType === "pickup" ? (
              <Package className="w-3 h-3" />
            ) : (
              <MapPin className="w-3 h-3" />
            )}
            {order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}
          </span>
        </div>
        <span className="text-sm font-bold text-neutral-900">
          {formatCurrency(order.total)}
        </span>
      </div>
    </Link>
  );
}
