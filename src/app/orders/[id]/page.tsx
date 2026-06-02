"use client";

import { useParams } from "next/navigation";
import { useOrderStore } from "@/lib/stores/order-store";
import { OrderTimeline } from "@/components/order/order-timeline";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatOrderStatus, getStatusColor, formatDate } from "@/lib/utils";
import {
  Package,
  MapPin,
  Clock,
  CreditCard,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const { orders } = useOrderStore();
  const orderId = params.id as string;
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-sm text-neutral-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title={`Order #${order.id.slice(-4)}`} showBack />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                {formatOrderStatus(order.status)}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {order.vendorName}
              </p>
            </div>
            <Badge className={cn(getStatusColor(order.status))} size="md">
              {formatOrderStatus(order.status)}
            </Badge>
          </div>

          <OrderTimeline currentStatus={order.status} />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Order Items
          </h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm text-neutral-900">{item.productName}</p>
                  <p className="text-xs text-neutral-500">
                    {item.quantity}x {formatCurrency(item.unitPrice)}/{item.unit}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-neutral-400 mt-0.5 italic">
                      &quot;{item.notes}&quot;
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100">
            <span className="text-sm font-bold text-neutral-900">Total</span>
            <span className="text-base font-bold text-neutral-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Fulfillment</p>
              <p className="text-sm font-medium text-neutral-900 capitalize">
                {order.fulfillmentType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Placed</p>
              <p className="text-sm font-medium text-neutral-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Delivery Address</p>
                <p className="text-sm font-medium text-neutral-900">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>
          )}
        </div>

        {order.status === "completed" && (
          <Button variant="outline" fullWidth className="mt-2">
            Leave a Review
          </Button>
        )}

        {order.status === "ready" && (
          <Button fullWidth className="mt-2">
            <CreditCard className="w-4 h-4" />
            Pay at Pickup
          </Button>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
