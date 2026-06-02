"use client";

import { useOrderStore } from "@/lib/stores/order-store";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { mockProducts } from "@/lib/data/mock";
import { Plus, Package, Edit3, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function VendorProductsPage() {
  const products = mockProducts.filter((p) => p.vendorId === "v1");
  const [filter, setFilter] = useState<"all" | "in_stock" | "out_of_stock">(
    "all"
  );

  const filteredProducts =
    filter === "all"
      ? products
      : filter === "in_stock"
      ? products.filter((p) => p.inStock)
      : products.filter((p) => !p.inStock);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar
        title="Products"
        showBack
        rightAction={
          <Button size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        }
      />

      <main className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-4">
          {(["all", "in_stock", "out_of_stock"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                filter === f
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-white text-neutral-600 border-neutral-200"
              )}
            >
              {f === "all"
                ? "All"
                : f === "in_stock"
                ? "In Stock"
                : "Out of Stock"}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-neutral-100 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-neutral-900">
                      {product.name}
                    </h4>
                    <Badge
                      variant={product.inStock ? "success" : "danger"}
                      size="sm"
                    >
                      {product.inStock ? "In Stock" : "Out"}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                    {product.description}
                  </p>
                  <p className="text-sm font-bold text-neutral-900 mt-1.5">
                    {formatCurrency(product.price)}
                    <span className="text-xs font-normal text-neutral-500 ml-1">
                      / {product.unit}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-50">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  {product.inStock ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
