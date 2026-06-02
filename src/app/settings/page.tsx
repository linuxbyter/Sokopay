"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Globe,
  Moon,
  Smartphone,
} from "lucide-react";

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", description: "Name, phone, email" },
      {
        icon: Shield,
        label: "Privacy & Security",
        description: "Password, 2FA",
      },
      { icon: CreditCard, label: "Payment Methods", description: "Manage payment info" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", description: "Push, SMS, email" },
      { icon: Globe, label: "Language", description: "English" },
      { icon: Moon, label: "Appearance", description: "Light mode" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", description: "FAQs and support" },
      {
        icon: Smartphone,
        label: "About SokoPay",
        description: "Version 1.0.0",
      },
    ],
  },
];

export default function SettingsPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title="Settings" showBack />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || "User"} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900">
                {user?.name}
              </h3>
              <p className="text-xs text-neutral-500">{user?.email}</p>
              <p className="text-xs text-neutral-400 capitalize">
                {user?.role}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {settingsSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h3>
            <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-50">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-neutral-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          fullWidth
          onClick={logout}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>

        <p className="text-center text-xs text-neutral-400 pb-4">
          SokoPay v1.0.0 · Made in Kenya
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
