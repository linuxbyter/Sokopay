"use client";

import { create } from "zustand";
import { Order } from "@/lib/types";
import { mockOrders } from "@/lib/data/mock";
import { generateId } from "@/lib/utils";

interface OrderState {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">) => string;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByVendor: (vendorId: string) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: mockOrders,

  placeOrder: (orderData) => {
    const id = `ord-${generateId()}`;
    const now = new Date().toISOString();
    const order: Order = {
      ...orderData,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ orders: [order, ...state.orders] }));
    return id;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }));
  },

  getOrdersByCustomer: (customerId) => {
    return get().orders.filter((o) => o.customerId === customerId);
  },

  getOrdersByVendor: (vendorId) => {
    return get().orders.filter((o) => o.vendorId === vendorId);
  },
}));
