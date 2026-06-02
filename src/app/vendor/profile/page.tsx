"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { mockVendors, mockProducts } from "@/lib/data/mock";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Edit3,
  CreditCard,
  QrCode,
  CheckCircle,
  Package,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function VendorProfilePage() {
  const vendor = mockVendors[0];
  const products = mockProducts.filter((p) => p.vendorId === vendor.id);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title="My Profile" showBack />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <div className="flex items-start gap-4">
            <Avatar name={vendor.name} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-900">
                  {vendor.name}
                </h1>
                {vendor.verified && (
                  <CheckCircle className="w-4 h-4 text-brand-600 fill-brand-50" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={vendor.rating} showValue />
                <span className="text-xs text-neutral-400">
                  ({vendor.reviewCount})
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">
                {vendor.marketLocation} · {vendor.stallNumber}
              </p>
              <p className="text-xs text-neutral-500">{vendor.openHours}</p>
            </div>
            <Button variant="ghost" size="sm">
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {vendor.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-neutral-100 p-3 text-center">
            <p className="text-lg font-bold text-neutral-900">
              {vendor.orderCount.toLocaleString()}
            </p>
            <p className="text-2xs text-neutral-500">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-3 text-center">
            <p className="text-lg font-bold text-neutral-900">
              {products.length}
            </p>
            <p className="text-2xs text-neutral-500">Products</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-3 text-center">
            <p className="text-lg font-bold text-neutral-900">
              {vendor.rating}
            </p>
            <p className="text-2xs text-neutral-500">Rating</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-semibold text-neutral-900">
                Payment Details
              </h3>
            </div>
            <Button variant="ghost" size="sm">
              <Edit3 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {vendor.paymentInfo.mpesaNumber && (
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg">
                <span className="text-xs text-neutral-500">M-Pesa</span>
                <span className="text-sm font-medium text-neutral-900">
                  {vendor.paymentInfo.mpesaNumber}
                </span>
              </div>
            )}
            {vendor.paymentInfo.paybill && (
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg">
                <span className="text-xs text-neutral-500">Paybill</span>
                <span className="text-sm font-medium text-neutral-900">
                  {vendor.paymentInfo.paybill}
                </span>
              </div>
            )}
            {vendor.paymentInfo.tillNumber && (
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg">
                <span className="text-xs text-neutral-500">Till</span>
                <span className="text-sm font-medium text-neutral-900">
                  {vendor.paymentInfo.tillNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-neutral-500" />
            <h3 className="text-sm font-semibold text-neutral-900">
              Your QR Code
            </h3>
          </div>
          <div className="flex justify-center">
            <div className="w-40 h-40 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center">
              <QrCode className="w-16 h-16 text-neutral-300" />
              <span className="text-xs text-neutral-400 mt-1">
                QR Code Display
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-semibold text-neutral-900">
                Products ({products.length})
              </h3>
            </div>
            <Link href="/vendor/products">
              <Button variant="ghost" size="sm">
                View all
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatCurrency(product.price)}/{product.unit}
                  </p>
                </div>
                <Badge
                  variant={product.inStock ? "success" : "danger"}
                  size="sm"
                >
                  {product.inStock ? "In Stock" : "Out"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
