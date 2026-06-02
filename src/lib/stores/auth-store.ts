"use client";

import { create } from "zustand";
import { User, UserRole } from "@/lib/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      customer: "Wanjiku Mwangi",
      vendor: "James Kariuki",
      delivery: "Peter Ochieng",
      admin: "Faith Wambui",
    };
    set({
      user: {
        id: `u-${role}`,
        name: roleNames[role],
        email: `${role}@sokopay.co.ke`,
        phone: "+254712345678",
        role,
        createdAt: new Date().toISOString(),
      },
      isAuthenticated: true,
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
