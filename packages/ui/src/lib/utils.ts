import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
  })
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
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-copper-400/10 text-copper-400 border-copper-400/20",
    confirmed: "bg-primary/10 text-primary border-primary/20",
    preparing: "bg-primary/10 text-primary border-primary/20",
    washing: "bg-primary/10 text-primary border-primary/20",
    chopping: "bg-primary/10 text-primary border-primary/20",
    packing: "bg-primary/10 text-primary border-primary/20",
    ready: "bg-success/10 text-success border-success/20",
    out_for_delivery: "bg-primary/10 text-primary border-primary/20",
    delivered: "bg-success/10 text-success border-success/20",
    completed: "bg-surface-hover text-text-secondary border-border",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  }
  return colors[status] || "bg-surface-hover text-text-secondary border-border"
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "…"
}
