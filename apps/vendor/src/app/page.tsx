"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Store,
  MessageSquare,
  CheckCircle,
  LogOut,
  Clock,
  Users,
  Phone,
  MapPin,
  ChevronRight,
  Circle,
} from "lucide-react"

interface Vendor {
  id: string
  name: string
  category: string
  isOpen: boolean
  address: string
  phone: string
}

interface Chat {
  id: string
  customerName: string
  lastMessage: string
  timestamp: string
  unread: boolean
  category: string
}

type Tab = "home" | "inbox" | "confirm"

export default function VendorPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [tab, setTab] = useState<Tab>("home")
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    // Fast initial load — mock data for now
    setVendor({
      id: "1",
      name: "Mama Njeri's Veggies",
      category: "Mama/Baba Mboga",
      isOpen: true,
      address: "Kenyatta Market, Nairobi",
      phone: "+254712345678",
    })
    setChats([
      {
        id: "1",
        customerName: "Peter",
        lastMessage: "Do you have fresh tomatoes?",
        timestamp: "2m",
        unread: true,
        category: "Mama/Baba Mboga",
      },
      {
        id: "2",
        customerName: "Mary",
        lastMessage: "What's the price for Sukuma Wiki?",
        timestamp: "15m",
        unread: false,
        category: "Mama/Baba Mboga",
      },
      {
        id: "3",
        customerName: "John",
        lastMessage: "I'll take 2kg of potatoes",
        timestamp: "1h",
        unread: false,
        category: "Mama/Baba Mboga",
      },
    ])
  }, [])

  const toggleOpen = useCallback(async () => {
    if (!vendor || toggling) return
    setToggling(true)
    // Optimistic update — instant feedback
    setVendor({ ...vendor, isOpen: !vendor.isOpen })
    // TODO: POST to API
    setTimeout(() => setToggling(false), 300)
  }, [vendor, toggling])

  const unreadCount = chats.filter((c) => c.unread).length

  // Loading skeleton
  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-14 bg-white border-b border-neutral-200 animate-pulse" />
        <div className="p-4 space-y-4">
          <div className="h-32 bg-white rounded-xl animate-pulse" />
          <div className="h-20 bg-white rounded-xl animate-pulse" />
          <div className="h-20 bg-white rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-brand-700 text-lg">SökoPay</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-medium">
              {vendor.isOpen ? "🟢 Open" : "🔴 Closed"}
            </span>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <LogOut className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {tab === "home" && (
          <>
            {/* Shop Card */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    {vendor.name}
                  </h1>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {vendor.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{vendor.address}</span>
                </div>
              </div>

              {/* Open/Closed Toggle — Big, instant, satisfying */}
              <button
                onClick={toggleOpen}
                disabled={toggling}
                className={`w-full h-14 rounded-xl font-bold text-base transition-all duration-200 active:scale-[0.98] ${
                  vendor.isOpen
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200"
                } ${toggling ? "opacity-70" : ""}`}
              >
                {vendor.isOpen ? "Shop is OPEN" : "Shop is CLOSED"}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-card">
                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Today</span>
                </div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-neutral-400">customers</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-card">
                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-medium">Messages</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {unreadCount}
                </p>
                <p className="text-xs text-neutral-400">unread</p>
              </div>
            </div>

            {/* Recent Messages Preview */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-card">
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="font-bold text-foreground">Messages</h2>
                <button
                  onClick={() => setTab("inbox")}
                  className="text-xs text-brand-600 font-semibold hover:text-brand-700"
                >
                  See all
                </button>
              </div>
              <div className="divide-y divide-neutral-100">
                {chats.slice(0, 3).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setTab("inbox")}
                    className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-brand-700">
                        {chat.customerName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          {chat.customerName}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {chat.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread && (
                      <Circle className="w-2.5 h-2.5 fill-brand-500 text-brand-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "inbox" && (
          <div className="space-y-0">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setTab("home")}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-500 rotate-180" />
              </button>
              <h1 className="text-lg font-bold text-foreground">Inbox</h1>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 shadow-card divide-y divide-neutral-100">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-brand-700">
                      {chat.customerName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {chat.customerName}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 truncate mt-0.5">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread && (
                    <Circle className="w-2.5 h-2.5 fill-brand-500 text-brand-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "confirm" && (
          <div className="space-y-0">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setTab("home")}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-500 rotate-180" />
              </button>
              <h1 className="text-lg font-bold text-foreground">Confirm Sale</h1>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-card">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 font-medium">
                  No pending sales to confirm
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  When a customer marks as paid, you&apos;ll confirm it here
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16">
          <button
            onClick={() => setTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              tab === "home"
                ? "text-brand-600"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-xs font-medium">Shop</span>
          </button>
          <button
            onClick={() => setTab("inbox")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative ${
              tab === "inbox"
                ? "text-brand-600"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Inbox</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 right-2 w-4 h-4 bg-copper-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("confirm")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              tab === "confirm"
                ? "text-brand-600"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Confirm</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
