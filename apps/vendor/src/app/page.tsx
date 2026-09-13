"use client"

import { useState, useEffect } from "react"
import {
  Store,
  MessageSquare,
  CheckCircle,
  LogOut,
} from "lucide-react"

interface Vendor {
  id: string
  name: string
  isOpen: boolean
}

export default function VendorPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate slow network — show skeleton first
    const timer = setTimeout(() => {
      setVendor({
        id: "1",
        name: "Mama Njeri's Veggies",
        isOpen: true,
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white">
        <p className="text-neutral-500">Loading vendor data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Vendor</span>
            </div>
            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors" onClick={() => window.location.href = "/"}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container pb-12">
        {/* Shop Status */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-neutral-500">Shop Status</span>
            <span className={vendor.isOpen ? "text-green-600" : "text-gray-500"}>
              {vendor.isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <p className="text-sm text-neutral-500">Mama Njeri's Veggies — Mama/Baba Mboga</p>
        </div>

        {/* Quick Action */}
        <button className="button-primary w-full mb-4" onClick={() => window.alert("Toggle open/clicked")}>
          Toggle Open/Closed
        </button>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-10">
        <div className="container flex items-center justify-around h-14">
          <button className="flex flex-col items-center gap-1 text-sm text-neutral-500 hover:text-primary transition-colors">
            <Store className="w-5 h-5" />
            <span>Shop</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-sm text-neutral-500 hover:text-primary transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-sm text-neutral-500 hover:text-primary transition-colors">
            <CheckCircle className="w-5 h-5" />
            <span>Confirm</span>
          </button>
        </div>
      </nav>
    </div>
  )
}