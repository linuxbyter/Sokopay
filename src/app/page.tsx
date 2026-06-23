"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, MapPin, Store, ShoppingBag, ArrowRight, Star, Shield, Zap, Users,
  Crop, Scissors, Droplet, Flame, Shirt, Utensils
} from "lucide-react";

const categories = [
  { id: "mama-baba-mboga", label: "Mama/Baba Mboga", icon: "Crop", dbCategory: "Mama/Baba Mboga" },
  { id: "maasai-shop", label: "Maasai Shop", icon: "Store", dbCategory: "Maasai Shop" },
  { id: "barbers", label: "Barbers", icon: "Scissors", dbCategory: "Barbers" },
  { id: "saloonists", label: "Saloonists", icon: "Scissors", dbCategory: "Saloonists" },
  { id: "water-vendors", label: "Water Vendors", icon: "Droplet", dbCategory: "Water Vendors" },
  { id: "gas-refillers", label: "Gas Refillers", icon: "Flame", dbCategory: "Gas Refillers" },
  { id: "butcheries", label: "Butcheries", icon: "Flame", dbCategory: "Butcheries" },
  { id: "laundry-mart", label: "Laundry Mart", icon: "Shirt", dbCategory: "Laundry Mart" },
  { id: "supermarkets", label: "SuperMarkets", icon: "Store", dbCategory: "SuperMarkets" },
  { id: "eateries", label: "Eateries", icon: "Utensils", dbCategory: "Eateries" },
  { id: "quick-snacks", label: "Quick Snacks", icon: "Zap", dbCategory: "Quick Snacks" },
];

const iconMap: Record<string, any> = {
  Crop, Scissors, Droplet, Flame, Shirt, Utensils, Store, Zap
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleCategoryClick = (dbCategory: string) => {
    router.push(`/auth/role`);
  };

  const handleSearch = () => {
    router.push('/auth/role');
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-brand-700">SökoPay</h1>
            <button
              onClick={() => router.push('/auth/role')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
            >
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
            <p className="text-lg sm:text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
              Join Kenya's growing digital marketplace. Discover trusted local vendors, from fresh produce to essential services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                className="z-20 bg-white text-brand-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-colors flex items-center shadow-lg"
                onClick={() => router.push('/auth/role')}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                type="button"
                className="z-20 border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
                onClick={() => {
                  const el = document.getElementById('categories');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-neutral-900 mb-4">Browse Categories</h3>
          <p className="text-neutral-600 max-w-2xl mx-auto">From fresh produce to essential services, find everything you need</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon];
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.dbCategory)}
                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 hover:border-brand-200 group"
              >
                {IconComponent && <IconComponent className="w-6 h-6 text-neutral-600 group-hover:text-brand-600 transition-colors" />}
                <span className="text-sm font-medium text-neutral-700 text-center group-hover:text-brand-600 transition-colors mt-2">
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">How It Works</h3>
            <p className="text-neutral-600 max-w-2xl mx-auto">Simple, fast, and designed for Kenya</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 mb-3">1. Sign Up</h4>
              <p className="text-neutral-600">Create your account in seconds. Choose whether you're shopping or selling.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 mb-3">2. Discover</h4>
              <p className="text-neutral-600">Browse local vendors, compare products, and find exactly what you need.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 mb-3">3. Connect</h4>
              <p className="text-neutral-600">Chat with vendors, place orders, and enjoy local commerce made easy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-neutral-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Already know what you're looking for?</h3>
            <p className="text-neutral-600">Search for specific items, vendors, or services</p>
          </div>
          <div className="relative z-10 bg-white rounded-2xl shadow-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="What do you need? (e.g., sukuma wiki, haircut, water)"
                  className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                type="button"
                className="z-20 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-700 transition-colors whitespace-nowrap"
                onClick={handleSearch}
              >
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
                <li><button onClick={() => router.push('/auth/role')} className="hover:text-white transition-colors">Find Vendors</button></li>
                <li><button onClick={() => router.push('/auth/role')} className="hover:text-white transition-colors">My Orders</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Vendors</h5>
              <ul className="space-y-2 text-neutral-400">
                <li><button onClick={() => router.push('/auth/role')} className="hover:text-white transition-colors">Start Selling</button></li>
                <li><button onClick={() => router.push('/auth/role')} className="hover:text-white transition-colors">Vendor Dashboard</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              &copy; 2024 SökoPay. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="/about" className="text-neutral-400 hover:text-white text-sm transition-colors">About</a>
              <a href="/support" className="text-neutral-400 hover:text-white text-sm transition-colors">Support</a>
              <a href="/contact" className="text-neutral-400 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
