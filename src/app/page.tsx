"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";

const categories = [
  { id: "mama-baba-mboga", label: "Mama/Baba Mboga", icon: "🥬" },
  { id: "maasai-shop", label: "Maasai Shop", icon: "🛍️" },
  { id: "barbers", label: "Barbers", icon: "💈" },
  { id: "saloonists", label: "Saloonists", icon: "💇‍♀️" },
  { id: "water-vendors", label: "Water Vendors", icon: "💧" },
  { id: "gas-refillers", label: "Gas Refillers", icon: "🔥" },
  { id: "butcheries", label: "Butcheries", icon: "🥩" },
  { id: "laundry-mart", label: "Laundry Mart", icon: "👕" },
  { id: "supermarkets", label: "SuperMarkets & Wholesellers", icon: "🏪" },
  { id: "eateries", label: "Eateries", icon: "🍽️" },
  { id: "quick-snacks", label: "Quick Snacks", icon: "🍟" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-700">SökoPay</h1>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-brand-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-2">
            Find Local Services Near You
          </h2>
          <p className="text-brand-100 mb-6">
            Discover trusted vendors and service providers in your area
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="What do you need? (e.g., sukuma wiki, haircut, water)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="w-full sm:w-64 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Browse Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700 text-center">
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Vendors Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Featured Vendors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder vendor cards - will be populated with real data later */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-400">Vendor Image</span>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Vendor Name {i}
                </h4>
                <p className="text-sm text-gray-500 mb-2">Category</p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>0.{i} km away</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-xl font-bold">SökoPay</h4>
              <p className="text-gray-400 text-sm mt-1">
                Connecting you to local services
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 SökoPay. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}