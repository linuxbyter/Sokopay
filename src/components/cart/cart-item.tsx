"use client";

import { CartItem } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";
import { Minus, Plus, Trash2, MessageSquare, ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem, updateNotes } = useCartStore();

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-neutral-900">
            {item.product.name}
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            {formatCurrency(item.product.price)} / {item.product.unit}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-neutral-50 rounded-xl px-1">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-semibold text-neutral-900">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="relative flex-1 mr-3">
          <input
            type="text"
            value={item.notes || ""}
            onChange={(e) => updateNotes(item.product.id, e.target.value)}
            placeholder="Add notes..."
            className="w-full h-8 px-3 text-xs bg-neutral-50 border border-neutral-100 rounded-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500/20 focus:border-brand-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-900">
            {formatCurrency(item.product.price * item.quantity)}
          </span>
          <button
            onClick={() => removeItem(item.product.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
