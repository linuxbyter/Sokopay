"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useCartStore } from "@/lib/stores/cart-store";
import {
  Home,
  Search,
  ShoppingBag,
  Bell,
  User,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { itemCount } = useCartStore();

  if (!user) return null;

  const customerLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/cart", label: "Cart", icon: ShoppingBag, badge: itemCount },
    { href: "/notifications", label: "Alerts", icon: Bell, badge: unreadCount },
    { href: "/settings", label: "Account", icon: User },
  ];

  const vendorLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vendor/products", label: "Products", icon: Package },
    { href: "/notifications", label: "Alerts", icon: Bell, badge: unreadCount },
    { href: "/settings", label: "Account", icon: User },
  ];

  const links = user.role === "vendor" || user.role === "admin" ? vendorLinks : customerLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-100 shadow-bottom-nav safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors duration-200",
                isActive ? "text-brand-700" : "text-neutral-400"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn("w-5 h-5", isActive && "stroke-[2.5]")}
                />
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center px-1 text-2xs font-semibold text-white bg-red-500 rounded-full">
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-2xs font-medium",
                  isActive && "font-semibold"
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
