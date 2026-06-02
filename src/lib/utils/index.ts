import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
  });
}

export function formatOrderStatus(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    washing: "Washing",
    chopping: "Chopping",
    packing: "Packing",
    ready: "Ready for Pickup",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    preparing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    washing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    chopping: "bg-indigo-50 text-indigo-700 border-indigo-200",
    packing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
    out_for_delivery: "bg-brand-50 text-brand-700 border-brand-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-neutral-100 text-neutral-600 border-neutral-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  return colors[status] || "bg-neutral-50 text-neutral-600 border-neutral-200";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}
