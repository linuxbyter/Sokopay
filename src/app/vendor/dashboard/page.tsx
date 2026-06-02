"use client";

import { useState } from "react";
import { useOrderStore } from "@/lib/stores/order-store";
import { mockVendors } from "@/lib/data/mock";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatCurrency, formatOrderStatus, getStatusColor, formatDate } from "@/lib/utils";
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  ShoppingBag,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function VendorDashboardPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [activeTab, setActiveTab] = useState("new");

  const vendor = mockVendors[0];
  const vendorOrders = orders.filter((o) => o.vendorId === vendor.id);

  const newOrders = vendorOrders.filter((o) =>
    ["pending", "confirmed"].includes(o.status)
  );
  const preparingOrders = vendorOrders.filter((o) =>
    ["preparing", "washing", "chopping", "packing"].includes(o.status)
  );
  const readyOrders = vendorOrders.filter((o) => o.status === "ready");

  const stats = [
    {
      label: "Today's Orders",
      value: vendorOrders.length.toString(),
      icon: ShoppingBag,
      change: "+12%",
    },
    {
      label: "Revenue",
      value: formatCurrency(
        vendorOrders.reduce((sum, o) => sum + o.total, 0)
      ),
      icon: TrendingUp,
      change: "+8%",
    },
    {
      label: "Ready",
      value: readyOrders.length.toString(),
      icon: CheckCircle,
      change: "",
    },
    {
      label: "Avg. Prep",
      value: "15m",
      icon: Clock,
      change: "-2m",
    },
  ];

  const filteredOrders =
    activeTab === "new"
      ? newOrders
      : activeTab === "preparing"
      ? preparingOrders
      : activeTab === "ready"
      ? readyOrders
      : vendorOrders;

  const nextStatus: Record<string, string> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "completed",
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar />

      <main className="max-w-2xl mx-auto px-4 pt-4 pb-4">
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={vendor.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-neutral-900">
                  {vendor.name}
                </h1>
                {vendor.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-brand-600 fill-brand-50" />
                )}
              </div>
              <p className="text-xs text-neutral-500">
                {vendor.marketLocation} · {vendor.stallNumber}
              </p>
            </div>
            <Badge
              variant={vendor.isOpen ? "success" : "default"}
              dot
              size="md"
            >
              {vendor.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-neutral-100 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-neutral-500" />
                  </div>
                  {stat.change && (
                    <span className="text-2xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <ArrowUpRight className="w-2.5 h-2.5" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-neutral-900">
                  {stat.value}
                </p>
                <p className="text-2xs text-neutral-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-neutral-900">
              Order Queue
            </h2>
            <Link
              href="/vendor/orders"
              className="text-xs font-medium text-brand-600 flex items-center gap-0.5"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Tabs
            tabs={[
              { id: "new", label: "New", count: newOrders.length },
              {
                id: "preparing",
                label: "Preparing",
                count: preparingOrders.length,
              },
              { id: "ready", label: "Ready", count: readyOrders.length },
              { id: "all", label: "All" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-3"
          />

          <div className="space-y-2">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">No orders here</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-neutral-100 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900">
                          #{order.id.slice(-4)}
                        </span>
                        <Badge
                          className={cn(getStatusColor(order.status))}
                          size="sm"
                        >
                          {formatOrderStatus(order.status)}
                        </Badge>
                      </div>
                      <div className="mt-1.5 space-y-0.5">
                        {order.items.map((item) => (
                          <p key={item.productId} className="text-xs text-neutral-600">
                            {item.quantity}x {item.productName}
                            {item.notes && (
                              <span className="text-neutral-400 italic">
                                {" "}
                                — {item.notes}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                        <span>{formatDate(order.createdAt)}</span>
                        <span className="capitalize">
                          {order.fulfillmentType}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  {nextStatus[order.status] && (
                    <Button
                      size="sm"
                      fullWidth
                      className="mt-3"
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          nextStatus[order.status] as any
                        )
                      }
                    >
                      Mark as {formatOrderStatus(nextStatus[order.status])}
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
