"use client";

import { useNotificationStore } from "@/lib/stores/notification-store";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import {
  Bell,
  Package,
  CheckCircle,
  Tag,
  Store,
} from "lucide-react";

const iconMap = {
  order: <Package className="w-4 h-4" />,
  system: <CheckCircle className="w-4 h-4" />,
  promotion: <Tag className="w-4 h-4" />,
  vendor: <Store className="w-4 h-4" />,
};

const colorMap = {
  order: "bg-blue-50 text-blue-600",
  system: "bg-brand-50 text-brand-600",
  promotion: "bg-amber-50 text-amber-600",
  vendor: "bg-purple-50 text-purple-600",
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotificationStore();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar
        title="Notifications"
        showBack
        rightAction={
          unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <main className="max-w-2xl mx-auto px-4 pt-4">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-12 h-12" />}
            title="No notifications"
            description="You're all caught up!"
          />
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "w-full text-left flex items-start gap-3 p-4 rounded-xl transition-colors",
                  notification.read
                    ? "bg-white"
                    : "bg-brand-50/50 hover:bg-brand-50"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    colorMap[notification.type]
                  )}
                >
                  {iconMap[notification.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "text-sm",
                        notification.read
                          ? "font-medium text-neutral-700"
                          : "font-semibold text-neutral-900"
                      )}
                    >
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-brand-600 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-2xs text-neutral-400 mt-1.5">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
