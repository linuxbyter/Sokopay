"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { Avatar } from "@/components/ui/avatar";
import { Bell, ShoppingBag, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, showBack, rightAction, className }: TopBarProps) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { itemCount } = useCartStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-neutral-100",
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          {showBack ? (
            <Link
              href="/"
              className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">SP</span>
              </div>
              <span className="text-base font-bold text-neutral-900 tracking-tight">
                SokoPay
              </span>
            </Link>
          )}
          {title && (
            <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-1">
          {rightAction}
          {user?.role === "customer" && (
            <Link
              href="/cart"
              className="relative p-2 rounded-xl hover:bg-neutral-100 transition-colors lg:hidden"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-700" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-2xs font-semibold text-white bg-brand-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          <Link
            href="/notifications"
            className="relative p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-neutral-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-2xs font-semibold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link href="/settings" className="ml-1">
            <Avatar name={user?.name || "U"} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
