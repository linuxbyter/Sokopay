"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
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
  Users,
  BarChart3,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const customerNav = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
    { href: "/orders", label: "My Orders", icon: Package },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  const vendorNav = [
    { href: "/", label: "Home", icon: Home },
    { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vendor/products", label: "Products", icon: Package },
    { href: "/vendor/orders", label: "Orders", icon: ShoppingBag },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  const adminNav = [
    { href: "/", label: "Home", icon: Home },
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  const nav =
    user.role === "admin"
      ? adminNav
      : user.role === "vendor"
      ? vendorNav
      : customerNav;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-neutral-100 flex-col z-30">
      <div className="px-5 py-5 border-b border-neutral-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-900 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">SP</span>
          </div>
          <div>
            <span className="text-base font-bold text-neutral-900 tracking-tight">
              SokoPay
            </span>
            <p className="text-2xs text-neutral-400 -mt-0.5">Market Commerce</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-50 text-brand-800"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px]", isActive && "text-brand-600")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-100 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-brand-50 text-brand-800"
              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
          )}
        >
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
