"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockVendors, mockProducts, categories } from "@/lib/data/mock";
import { VendorCard } from "@/components/vendor/vendor-card";
import { ProductCard } from "@/components/product/product-card";
import { SearchBar } from "@/components/search/search-bar";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Leaf,
  Apple,
  UtensilsCrossed,
  Cookie,
  Home,
  Droplets,
  ChevronRight,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  vegetables: <Leaf className="w-5 h-5" />,
  fruits: <Apple className="w-5 h-5" />,
  cooked_food: <UtensilsCrossed className="w-5 h-5" />,
  snacks: <Cookie className="w-5 h-5" />,
  household: <Home className="w-5 h-5" />,
  water: <Droplets className="w-5 h-5" />,
};

export default function CustomerHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const router = useRouter();

  const filteredVendors = mockVendors.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredVendors = mockVendors.filter((v) => v.featured);
  const recentProducts = mockProducts.slice(0, 6);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar />

      <main className="max-w-2xl mx-auto px-4">
        <div className="pt-4 pb-2">
          <p className="text-xs text-neutral-500">Good afternoon</p>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            What do you need?
          </h1>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onFilterClick={() => router.push("/search")}
          className="mb-5"
        />

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border",
                activeCategory === cat.id
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-white text-neutral-700 border-neutral-100 hover:border-neutral-200"
              )}
            >
              {categoryIcons[cat.id as keyof typeof categoryIcons] || (
                <Sparkles className="w-4 h-4" />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        {activeCategory === "all" && !searchQuery && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Featured Vendors
                </h2>
                <p className="text-xs text-neutral-500">
                  Top-rated sellers in your area
                </p>
              </div>
              <button
                onClick={() => router.push("/search")}
                className="text-xs font-medium text-brand-600 flex items-center gap-0.5"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {featuredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                {activeCategory === "all"
                  ? "Nearby Vendors"
                  : categories.find((c) => c.id === activeCategory)?.label}
              </h2>
              <p className="text-xs text-neutral-500">
                {filteredVendors.length} vendor
                {filteredVendors.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-500">
                No vendors found matching your search
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}
        </section>

        {activeCategory === "all" && !searchQuery && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Popular Items
                </h2>
                <p className="text-xs text-neutral-500">
                  Best sellers across vendors
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  vendorId={product.vendorId}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
