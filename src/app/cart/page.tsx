"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { useOrderStore } from "@/lib/stores/order-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { CartItemRow } from "@/components/cart/cart-item";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Package, Truck, ArrowRight, CheckCircle } from "lucide-react";

export default function CartPage() {
  const { items, vendorId, total, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
        <TopBar title="Cart" showBack />
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="Your cart is empty"
          description="Browse vendors and add items to get started"
          action={
            <Button onClick={() => router.push("/customer-home")}>
              Browse Vendors
            </Button>
          }
        />
        <BottomNav />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
        <TopBar title="Order Confirmed" showBack />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Order Placed!
          </h2>
          <p className="text-sm text-neutral-500 mb-1">
            Order #{orderId.slice(-4)} has been sent to the vendor
          </p>
          <p className="text-xs text-neutral-400 mb-8">
            {fulfillment === "pickup"
              ? "You'll be notified when it's ready for pickup"
              : "Delivery partner will be assigned shortly"}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/orders")}
            >
              View Orders
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                clearCart();
                router.push("/customer-home");
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const deliveryFee = fulfillment === "delivery" ? 150 : 0;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user || !vendorId) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const id = placeOrder({
      customerId: user.id,
      vendorId,
      vendorName: "Vendor",
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price,
        unit: i.product.unit,
        notes: i.notes,
      })),
      fulfillmentType: fulfillment,
      total: grandTotal,
      notes,
      deliveryAddress: fulfillment === "delivery" ? deliveryAddress : undefined,
    });

    setOrderId(id);
    setOrderPlaced(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title="Cart" showBack />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            How do you want to receive this?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFulfillment("pickup")}
              className={cn(
                "p-3 rounded-xl border-2 text-left transition-all",
                fulfillment === "pickup"
                  ? "border-brand-600 bg-brand-50"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <Package
                className={cn(
                  "w-5 h-5 mb-2",
                  fulfillment === "pickup"
                    ? "text-brand-600"
                    : "text-neutral-400"
                )}
              />
              <p className="text-sm font-medium text-neutral-900">Pickup</p>
              <p className="text-xs text-neutral-500">Collect from vendor</p>
            </button>
            <button
              onClick={() => setFulfillment("delivery")}
              className={cn(
                "p-3 rounded-xl border-2 text-left transition-all",
                fulfillment === "delivery"
                  ? "border-brand-600 bg-brand-50"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <Truck
                className={cn(
                  "w-5 h-5 mb-2",
                  fulfillment === "delivery"
                    ? "text-brand-600"
                    : "text-neutral-400"
                )}
              />
              <p className="text-sm font-medium text-neutral-900">Delivery</p>
              <p className="text-xs text-neutral-500">
                +KES 150 delivery fee
              </p>
            </button>
          </div>

          {fulfillment === "delivery" && (
            <div className="mt-3">
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">
            Order Notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or instructions..."
            rows={2}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-100 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-brand-500/20 focus:border-brand-300"
          />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span className="text-neutral-900">{formatCurrency(total)}</span>
          </div>
          {fulfillment === "delivery" && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Delivery Fee</span>
              <span className="text-neutral-900">
                {formatCurrency(deliveryFee)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-neutral-100">
            <span className="text-neutral-900">Total</span>
            <span className="text-neutral-900">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={handlePlaceOrder}
          loading={loading}
          className="mb-4"
        >
          Place Order — {formatCurrency(grandTotal)}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
