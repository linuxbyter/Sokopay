"use client";

import { useState } from "react";
import { mockVendors, categories } from "@/lib/data/mock";
import { VendorCard } from "@/components/vendor/vendor-card";
import { SearchBar } from "@/components/search/search-bar";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const results = mockVendors
    .filter((v) => {
      const matchesQuery =
        !query ||
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.description.toLowerCase().includes(query.toLowerCase()) ||
        v.marketLocation.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || v.category === activeCategory;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "orders") return b.orderCount - a.orderCount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      <TopBar title="Search" showBack />

      <main className="max-w-2xl mx-auto px-4 pt-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          autoFocus
          className="mb-4"
        />

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            { id: "rating", label: "Top Rated" },
            { id: "orders", label: "Most Popular" },
            { id: "newest", label: "Newest" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap",
                sortBy === opt.id
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 mb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap",
                activeCategory === cat.id
                  ? "bg-brand-50 text-brand-700 border-brand-200"
                  : "bg-white text-neutral-500 border-neutral-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <p className="text-xs text-neutral-500 mb-3">
            {results.length} vendor{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="space-y-3">
            {results.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
          {results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm font-medium text-neutral-600 mb-1">
                No vendors found
              </p>
              <p className="text-xs text-neutral-400">
                Try a different search or category
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
