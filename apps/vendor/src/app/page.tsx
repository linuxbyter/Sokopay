"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@sokopay/ui"
import { cn } from "@sokopay/ui"
import { 
  Store, 
  MessageSquare, 
  CheckCircle, 
  LogOut,
  Clock,
  TrendingUp
} from "lucide-react"

interface Vendor {
  id: string
  businessName: string
  isOpen: boolean
  category: string
}

interface Message {
  id: string
  customerName: string
  content: string
  timestamp: string
  read: boolean
}

export default function VendorDashboard() {
  const { user, isLoaded } = useUser()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState<"dashboard" | "inbox">("dashboard")

  useEffect(() => {
    if (isLoaded && user) {
      // Fetch vendor data
      fetchVendorData()
    }
  }, [isLoaded, user])

  const fetchVendorData = async () => {
    // TODO: Fetch from Neon DB
    setVendor({
      id: "1",
      businessName: "Mama Njeri's Veggies",
      isOpen: true,
      category: "Mama/Baba Mboga",
    })
    setMessages([
      {
        id: "1",
        customerName: "Peter",
        content: "Do you have fresh tomatoes?",
        timestamp: "2m ago",
        read: false,
      },
      {
        id: "2",
        customerName: "Mary",
        content: "What's the price for Sukuma Wiki?",
        timestamp: "15m ago",
        read: true,
      },
    ])
  }

  const toggleOpen = async () => {
    if (!vendor) return
    setVendor({ ...vendor, isOpen: !vendor.isOpen })
    // TODO: Update in Neon DB
  }

  const handleLogout = async () => {
    // TODO: Implement logout
    window.location.href = "/"
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-secondary">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-text-primary">SökoPay Vendor</h1>
          <p className="text-text-secondary">Sign in to manage your shop</p>
          <Button onClick={() => window.location.href = "/sign-in"}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-nav-bg border-b border-border">
        <div className="container-sm flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="font-semibold text-text-primary">Vendor</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-text-secondary hover:text-text-primary"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-sm py-6 space-y-6">
        {/* Shop Status Card */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {vendor?.businessName || "Your Shop"}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {vendor?.category || "Category"}
              </p>
            </div>
            <Button
              onClick={toggleOpen}
              variant={vendor?.isOpen ? "default" : "outline"}
              size="sm"
              className={cn(
                "min-w-[80px]",
                vendor?.isOpen && "bg-success hover:bg-success/90"
              )}
            >
              {vendor?.isOpen ? "Open" : "Closed"}
            </Button>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Open since 8:00 AM</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>12 customers today</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => setActiveTab("inbox")}
          >
            <MessageSquare className="w-6 h-6" />
            <span>Inbox</span>
            {messages.filter(m => !m.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Confirm</span>
          </Button>
        </div>

        {/* Messages Preview */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-semibold text-text-primary mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  message.read
                    ? "border-border bg-surface"
                    : "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-text-primary text-sm">
                      {message.customerName}
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-text-tertiary">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-nav-bg border-t border-border">
        <div className="container-sm flex items-center justify-around h-14">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex flex-col items-center gap-1 text-xs",
              activeTab === "dashboard" ? "text-primary" : "text-text-secondary"
            )}
          >
            <Store className="w-5 h-5" />
            <span>Shop</span>
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={cn(
              "flex flex-col items-center gap-1 text-xs relative",
              activeTab === "inbox" ? "text-primary" : "text-text-secondary"
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Inbox</span>
            {messages.filter(m => !m.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>
          <button
            className="flex flex-col items-center gap-1 text-xs text-text-secondary"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirm</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
