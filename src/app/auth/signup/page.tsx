"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
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
    if (role === "vendor") {
      router.push("/auth/vendor-onboarding");
    } else {
      router.push("/customer-home");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-sm mx-auto w-full">
        <div className="mb-8">
          <div className="w-11 h-11 bg-brand-900 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-base">SP</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Join SokoPay and start trading
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
            label="Full Name"
            type="text"
            placeholder="Your full name"
            icon={<User className="w-4 h-4" />}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+254 7XX XXX XXX"
            icon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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

          <p className="text-xs text-neutral-400">
            By creating an account you agree to our{" "}
            <span className="text-brand-600 cursor-pointer">Terms</span> and{" "}
            <span className="text-brand-600 cursor-pointer">Privacy Policy</span>
          </p>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            className="mt-2"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-brand-600 font-semibold hover:text-brand-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
