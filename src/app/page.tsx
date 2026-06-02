"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Store,
  ShoppingBag,
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  Star,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"customer" | "vendor">(
    "customer"
  );

  const handleGetStarted = () => {
    login(selectedRole);
    if (selectedRole === "vendor") {
      router.push("/vendor/dashboard");
    } else {
      router.push("/customer-home");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900 to-brand-950" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-copper-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-6 pt-12 pb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-base">SP</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
            Your market,
            <br />
            <span className="text-copper-300">smarter.</span>
          </h1>

          <p className="mt-5 text-base text-brand-200 leading-relaxed max-w-md mx-auto">
            Order fresh food and goods from vendors near you. Skip the queue,
            pick up when ready, or get it delivered.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-brand-200">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Trusted Vendors</span>
            </div>
            <div className="flex items-center gap-2 text-brand-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Order Ahead</span>
            </div>
            <div className="flex items-center gap-2 text-brand-200">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Near You</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="max-w-2xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-elevated p-6">
          <h2 className="text-base font-semibold text-neutral-900 text-center mb-4">
            How do you want to use SokoPay?
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole("customer")}
              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedRole === "customer"
                  ? "border-brand-600 bg-brand-50"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {selectedRole === "customer" && (
                <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-brand-600" />
              )}
              <ShoppingBag
                className={`w-8 h-8 mb-3 ${
                  selectedRole === "customer"
                    ? "text-brand-600"
                    : "text-neutral-400"
                }`}
              />
              <h3 className="text-sm font-semibold text-neutral-900">
                Customer
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Browse vendors, order food & goods
              </p>
            </button>

            <button
              onClick={() => setSelectedRole("vendor")}
              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedRole === "vendor"
                  ? "border-brand-600 bg-brand-50"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {selectedRole === "vendor" && (
                <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-brand-600" />
              )}
              <Store
                className={`w-8 h-8 mb-3 ${
                  selectedRole === "vendor"
                    ? "text-brand-600"
                    : "text-neutral-400"
                }`}
              />
              <h3 className="text-sm font-semibold text-neutral-900">Vendor</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Sell goods, manage orders
              </p>
            </button>
          </div>

          <Button
            onClick={handleGetStarted}
            fullWidth
            size="lg"
            className="mt-5"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-center text-xs text-neutral-400 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Verified Vendors
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Every vendor is vetted
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Order Ahead
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Skip the market queue
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Rated & Reviewed
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Real customer feedback
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-6">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs text-neutral-400">
            SokoPay — Connecting Kenyan markets to your fingertips
          </p>
        </div>
      </footer>
    </div>
  );
}
