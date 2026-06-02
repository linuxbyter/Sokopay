"use client";

import { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";
import { Plus, Minus, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  vendorId: string;
  compact?: boolean;
  className?: string;
  onSelect?: () => void;
}

export function ProductCard({ product, vendorId, compact, className, onSelect }: ProductCardProps) {
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  if (compact) {
    return (
      <button
        onClick={onSelect}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-100 text-left transition-all duration-200",
          "hover:border-neutral-200 hover:shadow-card",
          !product.inStock && "opacity-50",
          className
        )}
      >
        <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-neutral-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-neutral-900 truncate">
            {product.name}
          </h4>
          <p className="text-xs text-neutral-500">
            {formatCurrency(product.price)} / {product.unit}
          </p>
        </div>
        {quantity > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, quantity - 1);
              }}
              className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-semibold text-neutral-900 w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addItem(product, vendorId);
              }}
              className="w-7 h-7 rounded-lg bg-brand-900 flex items-center justify-center text-white hover:bg-brand-800"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {quantity === 0 && product.inStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(product, vendorId);
            }}
            className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 hover:bg-brand-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl border border-neutral-100 overflow-hidden transition-all duration-200",
        "hover:shadow-card-hover hover:border-neutral-200",
        !product.inStock && "opacity-60",
        className
      )}
    >
      <div className="h-32 bg-neutral-50 flex items-center justify-center relative">
        <Package className="w-10 h-10 text-neutral-300" />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-medium text-neutral-500 bg-white px-2 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        {product.prepTime && (
          <span className="absolute top-2 left-2 text-2xs bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-neutral-600 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {product.prepTime}
          </span>
        )}
      </div>

      <div className="p-3">
        <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-base font-bold text-neutral-900">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-neutral-400 ml-1">
              / {product.unit}
            </span>
          </div>

          {product.inStock && (
            <>
              {quantity > 0 ? (
                <div className="flex items-center gap-1.5 bg-brand-50 rounded-xl px-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-700 hover:bg-brand-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold text-brand-800 w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => addItem(product, vendorId)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-700 hover:bg-brand-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addItem(product, vendorId)}
                  className="w-8 h-8 rounded-xl bg-brand-900 flex items-center justify-center text-white hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
