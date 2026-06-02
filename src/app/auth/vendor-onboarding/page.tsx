"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Store,
  Phone,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const steps = [
  { id: 1, title: "Market & Stall", description: "Where do you sell?" },
  { id: 2, title: "Business Info", description: "Tell us about your business" },
  { id: 3, title: "Payment Setup", description: "How do customers pay you?" },
  { id: 4, title: "All Set", description: "You're ready to go" },
];

const markets = [
  "City Market",
  "Gikomba Market",
  "Toi Market",
  "Muthurwa Market",
  "Eastleigh Market",
  "Kawangware Market",
  "Kenyatta Market",
  "Mwiki Market",
  "Kasarani Market",
  "Donholm Market",
];

const categories = [
  "Vegetables & Greens",
  "Fruits",
  "Cooked Food",
  "Snacks & Baked Goods",
  "Household Supplies",
  "Water & Beverages",
];

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (currentStep === 4) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      router.push("/vendor/dashboard");
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-sm mx-auto px-6 py-8">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i + 1 <= currentStep ? "bg-brand-600" : "bg-neutral-200"
              }`}
            />
          ))}
        </div>

        {/* Step Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {steps[currentStep - 1].title}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Step Content */}
        <div className="space-y-4 min-h-[320px]">
          {currentStep === 1 && (
            <>
              <Input
                label="Business Name"
                placeholder="e.g. Mama Amina Kitchen"
                icon={<Store className="w-4 h-4" />}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Market Location
                </label>
                <select className="w-full h-11 px-4 text-sm bg-white border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer">
                  <option value="">Select your market</option>
                  {markets.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <Input label="Stall / Shop Number" placeholder="e.g. Stall 42" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className="p-2.5 text-xs font-medium text-neutral-700 border border-neutral-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all text-left"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Business Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what you sell and what makes you special..."
                  className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
              </div>
              <Input
                label="Phone Number"
                placeholder="+254 7XX XXX XXX"
                icon={<Phone className="w-4 h-4" />}
              />
              <Input
                label="Operating Hours"
                placeholder="e.g. 5:00 AM – 6:00 PM"
                icon={<FileText className="w-4 h-4" />}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Business Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Fresh",
                    "Organic",
                    "Wholesale",
                    "Home-cooked",
                    "Fast Service",
                    "Bulk Orders",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="px-3 py-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-full hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <p className="text-sm text-neutral-500 mb-4">
                Customers will see these details to pay you directly via M-Pesa
                or other methods. You can update this anytime.
              </p>
              <Input
                label="M-Pesa Number"
                placeholder="+254 7XX XXX XXX"
                icon={<Phone className="w-4 h-4" />}
              />
              <Input
                label="Paybill Number (optional)"
                placeholder="Paybill number"
              />
              <Input
                label="Till Number (optional)"
                placeholder="Till number"
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800">
                  Payment Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pay via M-Pesa Paybill. Use your phone number as account number."
                  className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-brand-600" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 mb-2">
                You&apos;re all set!
              </h2>
              <p className="text-sm text-neutral-500 max-w-xs">
                Your vendor profile is ready. Start adding products and
                receiving orders from customers near you.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && currentStep < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            type="button"
            onClick={handleNext}
            loading={loading}
            className="flex-1"
          >
            {currentStep === 4 ? "Go to Dashboard" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
