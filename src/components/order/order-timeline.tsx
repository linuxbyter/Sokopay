"use client";

import { OrderStatus } from "@/lib/types";
import { cn, formatOrderStatus } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const statusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
];

const statusIcons: Record<OrderStatus, string> = {
  pending: "Order placed",
  confirmed: "Vendor confirmed",
  preparing: "Being prepared",
  washing: "Washing",
  chopping: "Chopping",
  packing: "Packing",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = statusFlow.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="space-y-0">
      {statusFlow.map((status, index) => {
        const isComplete = currentIndex >= index;
        const isCurrent = currentIndex === index;

        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                  isComplete
                    ? "bg-brand-600 text-white"
                    : "bg-neutral-100 text-neutral-400 border border-neutral-200",
                  isCurrent && "ring-2 ring-brand-200"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              {index < statusFlow.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8 my-1",
                    isComplete ? "bg-brand-300" : "bg-neutral-200"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent
                    ? "text-brand-700"
                    : isComplete
                    ? "text-neutral-900"
                    : "text-neutral-400"
                )}
              >
                {formatOrderStatus(status)}
              </p>
              {isCurrent && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  {statusIcons[status]}
                </p>
              )}
            </div>
          </div>
        );
      })}
      {isCancelled && (
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 text-red-600 shrink-0">
            <Circle className="w-3 h-3" />
          </div>
          <p className="text-sm font-medium text-red-600">Cancelled</p>
        </div>
      )}
    </div>
  );
}
