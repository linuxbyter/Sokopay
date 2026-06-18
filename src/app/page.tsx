"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Store, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Users,
  Crop,
  Scissors,
  Hair,
  Droplet,
  Flame,
  Cow,
  Shirt,
  Utensils,
  Shop
} from "lucide-react";

const categories = [
  { id: "mama-baba-mboga", label: "Mama/Baba Mboga", icon: "Crop" },
  { id: "maasai-shop", label: "Maasai Shop", icon: "Shop" },
  { id: "barbers", label: "Barbers", icon: "Scissors" },
  { id: "saloonists", label: "Saloonists", icon: "Hair" },
  { id: "water-vendors", label: "Water Vendors", icon: "Droplet" },
  { id: "gas-refillers", label: "Gas Refillers", icon: "Flame" },
  { id: "butcheries", label: "Butcheries", icon: "Cow" },
  { id: "laundry-mart", label: "Laundry Mart", icon: "Shirt" },
  { id: "supermarkets", label: "SuperMarkets", icon: "Store" },
  { id: "eateries", label: "Eateries", icon: "Utensils" },
  { id: "quick-snacks", label: "Quick Snacks", icon: "Zap" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-brand-700">SökoPay</h1>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-brand-600 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Your Local Market, <br className="hidden sm:block" />
              <span className="text-brand-100">Digitally Connected</span>
            </h2>
            <p className="text-lg sm:text-xl text-brand-100 mb-12 max-w-2xl mx-auto">
              Join Kenya's growing digital marketplace. Whether you're selling fresh produce or looking for local services, SökoPay connects you.
            </p>
          </div>

          {/* User Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
{/* Customer Card */}
<div className="bg-white rounded-2xl shadow-xl p-8 text-neutral-900 hover:shadow-2xl transition-shadow duration-300">
  <div className="flex items-center mb-6">
    <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mr-4">
      <ShoppingBag className="w-7 h-7 text-brand-600" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-neutral-900">Shop Local</h3>
      <p className="text-neutral-500 text-sm">Find vendors near you</p>
    </div>
  </div>
              
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Discover trusted local vendors, from fresh produce to essential services. Browse categories, compare prices, and get what you need delivered or pick it up nearby.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-neutral-600">
                  <Star className="w-4 h-4 text-copper-400 mr-2" />
                  <span>Find verified vendors in your area</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <Star className="w-4 h-4 text-copper-400 mr-2" />
                  <span>Compare prices and quality</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <Star className="w-4 h-4 text-copper-400 mr-2" />
                  <span>Chat directly with sellers</span>
                </div>
              </div>

<button 
  type="button"
  className="w-full bg-brand-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors flex items-center justify-center"
  onClick={() => console.log('Start Shopping clicked')}
>
  Start Shopping
  <ArrowRight className="ml-2 w-5 h-5" />
</button>
            </div>

{/* Vendor Card */}
<div className="bg-white rounded-2xl shadow-xl p-8 text-neutral-900 hover:shadow-2xl transition-shadow duration-300">
  <div className="flex items-center mb-6">
    <div className="w-14 h-14 bg-copper-100 rounded-xl flex items-center justify-center mr-4">
      <Store className="w-7 h-7 text-copper-600" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-neutral-900">Sell & Grow</h3>
      <p className="text-neutral-500 text-sm">Expand your business</p>
    </div>
  </div>
              
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Create your digital storefront in minutes. Reach more customers, manage orders, and grow your business with powerful tools designed for Kenyan entrepreneurs.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-neutral-600">
                  <Zap className="w-4 h-4 text-copper-400 mr-2" />
                  <span>Set up your shop in minutes</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <Zap className="w-4 h-4 text-copper-400 mr-2" />
                  <span>Reach thousands of customers</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <Zap className="w-4 h-4 text-copper-400 mr-2" />
                  <span>Manage orders and payments</span>
                </div>
              </div>

<button 
  type="button"
  className="w-full bg-copper-400 text-white py-4 rounded-xl font-semibold text-lg hover:bg-copper-500 transition-colors flex items-center justify-center"
  onClick={() => console.log('Open Your Shop clicked')}
>
  Open Your Shop
  <ArrowRight className="ml-2 w-5 h-5" />
</button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-neutral-900 mb-4">
            Browse Categories
          </h3>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            From fresh produce to essential services, find everything you need
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 hover:border-brand-200 group"
            >
{/* Render icon based on category */}
{category.icon === 'Crop' && <Crop className="w-6 h-6" />}
/*{category.icon === 'Shop' && <Search className="w-6 h-6" />}{category.icon === 'Scissors' && <Scissors className="w-6 h-6" />}{category.icon === 'Hair' && <Hair className="w-6 h-6" />}{category.icon === 'Droplet' && <Droplet className="w-6 h-6" />}{category.icon === 'Flame' && <Flame className="w-6 h-6" />}{category.icon === 'Cow' && <Cow className="w-6 h-6" />}{category.icon === 'Shirt' && <Shirt className="w-6 h-6" />}{category.icon === 'Store' && <Store className="w-6 h-6" />}{category.icon === 'Utensils' && <Utensils className="w-6 h-6" />}{category.icon === 'Zap' && <Zap className="w-6 h-6" />}
              <span className="text-sm font-medium text-neutral-700 text-center group-hover:text-brand-600 transition-colors">
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              How It Works
            </h3>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Simple, fast, and designed for Kenya
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 mb-3">1. Sign Up</h4>
              <p className="text-neutral-600">
                Create your account in seconds. Choose whether you're shopping or selling.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 mb-3">2. Discover</h4>
              <p className="text-neutral-600">
                Browse local vendors, compare products, and find exactly what you need.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 mb-3">3. Connect</h4>
              <p className="text-neutral-600">
                Chat with vendors, place orders, and enjoy local commerce made easy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section (for returning users) */}
      <div className="bg-neutral-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Already know what you're looking for?
            </h3>
            <p className="text-neutral-600">
              Search for specific items, vendors, or services
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="What do you need? (e.g., sukuma wiki, haircut, water)"
                  className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative sm:w-64">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button className="bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-700 transition-colors whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-2xl font-bold mb-4">SökoPay</h4>
              <p className="text-neutral-400 max-w-md">
                Connecting local vendors and customers across Kenya. Supporting the informal economy through digital innovation.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Customers</h5>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">How to Shop</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Vendors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Orders</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Vendors</h5>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Start Selling</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © 2024 SökoPay. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="/about" className="text-neutral-400 hover:text-white text-sm transition-colors">About</a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
