"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "vendor">("customer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(role);
    router.push(role === "vendor" ? "/vendor/dashboard" : "/customer-home");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-sm mx-auto w-full">
        <div className="mb-8">
          <div className="w-11 h-11 bg-brand-900 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-base">SP</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Sign in to continue to SokoPay
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
            {(["customer", "vendor"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  role === r
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500"
                }`}
              >
                {r === "customer" ? "Customer" : "Vendor"}
              </button>
            ))}
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-neutral-600">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            className="mt-2"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-brand-600 font-semibold hover:text-brand-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
