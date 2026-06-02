"use client";

import { useOrderStore } from "@/lib/stores/order-store";
import { OrderCard } from "@/components/order/order-card";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { useState } from "react";
import { Package } from "lucide-react";

export default function VendorOrdersPage() {
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title="Orders" showBack />

      <main className="max-w-2xl mx-auto px-4 pt-4">
        <Tabs
          tabs={[
            { id: "all", label: "All", count: orders.length },
            { id: "pending", label: "New" },
            { id: "preparing", label: "Preparing" },
            { id: "ready", label: "Ready" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={<Package className="w-12 h-12" />}
              title="No orders found"
              description="Orders will appear here as they come in"
            />
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} showVendor={false} />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
