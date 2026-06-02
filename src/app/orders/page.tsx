"use client";

import { useOrderStore } from "@/lib/stores/order-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { OrderCard } from "@/components/order/order-card";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { useState } from "react";
import { Package } from "lucide-react";

export default function OrdersPage() {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");

  const myOrders = orders.filter((o) => o.customerId === user?.id);
  const filteredOrders =
    activeTab === "all"
      ? myOrders
      : activeTab === "active"
      ? myOrders.filter((o) => !["completed", "cancelled"].includes(o.status))
      : myOrders.filter((o) => o.status === activeTab);

  const activeCount = myOrders.filter(
    (o) => !["completed", "cancelled"].includes(o.status)
  ).length;
  const completedCount = myOrders.filter(
    (o) => o.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title="My Orders" showBack />

      <main className="max-w-2xl mx-auto px-4 pt-4">
        <Tabs
          tabs={[
            { id: "all", label: "All", count: myOrders.length },
            { id: "active", label: "Active", count: activeCount },
            { id: "completed", label: "Completed", count: completedCount },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={<Package className="w-12 h-12" />}
              title="No orders yet"
              description="Your orders will appear here"
            />
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
