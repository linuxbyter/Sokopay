"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockVendors, mockProducts, mockReviews } from "@/lib/data/mock";
import { ProductCard } from "@/components/product/product-card";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs } from "@/components/ui/tabs";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn, formatCurrency } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  ShoppingBag,
  Share2,
  Heart,
  CreditCard,
  QrCode,
} from "lucide-react";

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;
  const [activeTab, setActiveTab] = useState("products");
  const { items, vendorId: cartVendorId } = useCartStore();

  const vendor = mockVendors.find((v) => v.id === vendorId);
  const products = mockProducts.filter((p) => p.vendorId === vendorId);
  const reviews = mockReviews.filter((r) => r.vendorId === vendorId);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-sm text-neutral-500">Vendor not found</p>
      </div>
    );
  }

  const cartItemCount =
    cartVendorId === vendorId
      ? items.reduce((sum, i) => sum + i.quantity, 0)
      : 0;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar showBack />

      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-4">
          <div className="flex items-start gap-3">
            <Avatar name={vendor.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
                  {vendor.name}
                </h1>
                {vendor.verified && (
                  <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 fill-brand-50" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={vendor.rating} size="md" showValue />
                <span className="text-xs text-neutral-400">
                  ({vendor.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {vendor.marketLocation}
                  {vendor.stallNumber && `, ${vendor.stallNumber}`}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {vendor.openHours}
                </span>
              </div>
            </div>
            <Badge
              variant={vendor.isOpen ? "success" : "default"}
              dot
              size="md"
            >
              {vendor.isOpen ? "Open Now" : "Closed"}
            </Badge>
          </div>

          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {vendor.description}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-1.5 flex-wrap">
              {vendor.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-2xs px-2 py-1 bg-neutral-50 text-neutral-500 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        <Tabs
          tabs={[
            { id: "products", label: "Products", count: products.length },
            { id: "reviews", label: "Reviews", count: reviews.length },
            { id: "payment", label: "Payment" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {activeTab === "products" && (
          <div className="space-y-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                vendorId={vendorId}
                compact
              />
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-8">
                No reviews yet
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl border border-neutral-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={review.customerName} size="sm" />
                      <span className="text-sm font-medium text-neutral-900">
                        {review.customerName}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "payment" && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">
                  Payment Details
                </h3>
                <p className="text-xs text-neutral-500">
                  Pay directly to this vendor
                </p>
              </div>
            </div>

            {vendor.paymentInfo.mpesaNumber && (
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 mb-0.5">M-Pesa Number</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {vendor.paymentInfo.mpesaNumber}
                </p>
              </div>
            )}

            {vendor.paymentInfo.paybill && (
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 mb-0.5">Paybill</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {vendor.paymentInfo.paybill}
                </p>
              </div>
            )}

            {vendor.paymentInfo.tillNumber && (
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 mb-0.5">Till Number</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {vendor.paymentInfo.tillNumber}
                </p>
              </div>
            )}

            {vendor.paymentInfo.instructions && (
              <div className="p-3 bg-brand-50 rounded-xl">
                <p className="text-xs text-brand-700 font-medium mb-0.5">
                  Instructions
                </p>
                <p className="text-sm text-brand-800">
                  {vendor.paymentInfo.instructions}
                </p>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <div className="w-32 h-32 bg-white border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center">
                <QrCode className="w-12 h-12 text-neutral-300" />
                <span className="text-2xs text-neutral-400 mt-1">QR Code</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 max-w-2xl mx-auto z-30">
          <button
            onClick={() => router.push("/cart")}
            className="w-full h-14 bg-brand-900 text-white rounded-2xl flex items-center justify-between px-5 shadow-elevated hover:bg-brand-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium">
                {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in cart
              </span>
            </div>
            <span className="text-sm font-bold">View Cart</span>
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
