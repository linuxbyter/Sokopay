"use client";

import { create } from "zustand";
import { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  vendorId: string | null;
  addItem: (product: Product, vendorId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  vendorId: null,
  total: 0,
  itemCount: 0,

  addItem: (product: Product, vendorId: string) => {
    const { items, vendorId: currentVendorId } = get();
    if (currentVendorId && currentVendorId !== vendorId) {
      set({ items: [], vendorId, total: 0, itemCount: 0 });
    }
    const existing = items.find((i) => i.product.id === product.id);
    let newItems: CartItem[];
    if (existing) {
      newItems = items.map((i) =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...items, { product, quantity: 1 }];
    }
    set({
      items: newItems,
      vendorId: vendorId,
      total: newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  },

  removeItem: (productId: string) => {
    const newItems = get().items.filter((i) => i.product.id !== productId);
    set({
      items: newItems,
      vendorId: newItems.length > 0 ? get().vendorId : null,
      total: newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const newItems = get().items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    set({
      items: newItems,
      total: newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  },

  updateNotes: (productId: string, notes: string) => {
    set({
      items: get().items.map((i) =>
        i.product.id === productId ? { ...i, notes } : i
      ),
    });
  },

  clearCart: () => set({ items: [], vendorId: null, total: 0, itemCount: 0 }),
}));
