"use client";

import { mockVendors, mockOrders, mockUsers } from "@/lib/data/mock";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatCurrency, formatDate, formatOrderStatus, getStatusColor } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  Store,
  ShoppingBag,
  ArrowUpRight,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const openVendors = mockVendors.filter((v) => v.isOpen).length;
  const activeOrders = mockOrders.filter(
    (o) => !["completed", "cancelled"].includes(o.status)
  ).length;

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+23%",
      icon: TrendingUp,
      color: "bg-brand-50 text-brand-600",
    },
    {
      label: "Total Vendors",
      value: mockVendors.length.toString(),
      change: "+2",
      icon: Store,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Users",
      value: mockUsers.length.toString(),
      change: "+5",
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Active Orders",
      value: activeOrders.toString(),
      change: "",
      icon: ShoppingBag,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title="Admin Dashboard" showBack />

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-neutral-100 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      stat.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {stat.change && (
                    <span className="text-2xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <ArrowUpRight className="w-2.5 h-2.5" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold text-neutral-900">
                  {stat.value}
                </p>
                <p className="text-2xs text-neutral-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-900">
              Vendor Overview
            </h3>
            <span className="text-2xs text-neutral-500">
              {openVendors}/{mockVendors.length} open
            </span>
          </div>
          <div className="space-y-2">
            {mockVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center gap-3 py-2">
                <Avatar name={vendor.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {vendor.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {vendor.orderCount} orders · {vendor.rating}★
                  </p>
                </div>
                <Badge
                  variant={vendor.isOpen ? "success" : "default"}
                  dot
                  size="sm"
                >
                  {vendor.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-900">
              Recent Orders
            </h3>
            <Link
              href="/vendor/orders"
              className="text-xs font-medium text-brand-600 flex items-center gap-0.5"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900">
                      #{order.id.slice(-4)}
                    </span>
                    <Badge
                      className={cn(getStatusColor(order.status))}
                      size="sm"
                    >
                      {formatOrderStatus(order.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {order.vendorName} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className="text-sm font-bold text-neutral-900">
                  {formatCurrency(order.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800">
                Pending Reviews
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                2 vendor verification requests awaiting approval
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
