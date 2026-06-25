"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Star, MessageSquare, Leaf, Store, Scissors, Droplet, Flame, Beef, ShoppingBag, ShoppingCart, Utensils, Cookie, User } from "lucide-react";

const categories = [
  { icon: Leaf, label: "Mama Mboga",     db: "Mama/Baba Mboga" },
  { icon: Store, label: "Maasai Shop",   db: "Maasai Shop" },
  { icon: Scissors, label: "Barbers",     db: "Barbers" },
  { icon: Scissors, label: "Saloonists",  db: "Saloonists" },
  { icon: Droplet, label: "Water Vendors", db: "Water Vendors" },
  { icon: Flame, label: "Gas Refillers",  db: "Gas Refillers" },
  { icon: Beef, label: "Butcheries",      db: "Butcheries" },
  { icon: ShoppingBag, label: "Laundry Mart", db: "Laundry Mart" },
  { icon: ShoppingCart, label: "Supermarkets", db: "SuperMarkets" },
  { icon: Utensils, label: "Eateries",     db: "Eateries" },
  { icon: Cookie, label: "Quick Snacks",   db: "Quick Snacks" },
];

const steps = [
  {
    icon: User,
    title: "Pick your role",
    body: "Shopping for yourself or selling to your neighbourhood? Takes 30 seconds.",
  },
  {
    icon: MapPin,
    title: "Discover nearby",
    body: "Browse vendors on a map or list. Filter by category, rating, or who's open right now.",
  },
  {
    icon: MessageSquare,
    title: "Message & transact",
    body: "Chat directly, agree on price, pay via M-Pesa or cash, and mark it done.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const go = () => router.push("/auth/role");

  return (
    <main className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700 tracking-tight">SökoPay</span>
          <button
            onClick={go}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors min-h-[44px]"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-brand-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600 text-brand-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">
            SökoPay · Changing the ecommerce game
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
            Local vendors,<br className="hidden sm:block" />
            <span className="text-brand-300"> one tap away</span>
          </h1>
          <p className="text-brand-100 text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
            Mama mbogas, barbers, eateries, water vendors — discover and message them
            instantly. No middlemen, no delivery fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={go}
              className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl text-base hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 shadow-lg min-h-[52px]"
            >
              Get started — it's free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={go}
              className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors min-h-[52px]"
            >
              I'm a vendor →
            </button>
          </div>
        </div>
      </section>

      {/* ── Feature strip ── */}
      <section className="bg-brand-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 text-brand-100">
            <MessageSquare className="w-4 h-4" /> Real-time chat with vendors
          </div>
          <div className="flex items-center gap-2 text-brand-100">
            <MapPin className="w-4 h-4" /> Works on slow data
          </div>
          <div className="flex items-center gap-2 text-brand-100">
            <Star className="w-4 h-4" /> Free for vendors & customers
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">What do you need?</h2>
        <p className="text-neutral-500 text-center mb-8 text-sm">11 categories of local vendors, all in one place</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.db}
                  onClick={go}
                  className="flex flex-col items-center gap-2 p-4 bg-neutral-50 hover:bg-brand-50 border border-neutral-100 hover:border-brand-200 rounded-2xl transition-all group min-h-[80px]"
                >
                  <Icon className="w-6 h-6 text-brand-600 group-hover:text-brand-700" />
                  <span className="text-xs font-medium text-neutral-600 group-hover:text-brand-700 text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              );
            })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-neutral-50 py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">How it works</h2>
          <p className="text-neutral-500 text-center mb-10 text-sm">Simple enough to use on a boda stage</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                    <Icon className="w-8 h-8 text-brand-600 mb-3" />
                    <h3 className="font-bold text-neutral-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{s.body}</p>
                  </div>
                );
              })}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={go}
              className="bg-brand-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-700 transition-colors inline-flex items-center gap-2 min-h-[52px]"
            >
              Join SökoPay now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── For vendors callout ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="bg-copper-50 border border-copper-100 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <Store className="w-7 h-7 text-copper-500 mb-2" />
            <h2 className="text-xl font-bold text-neutral-900 mb-1">Own a local business?</h2>
            <p className="text-neutral-500 text-sm max-w-sm">
              Get discovered by customers in your area. Set up your shop profile in under 5 minutes — free.
            </p>
          </div>
          <button
            onClick={go}
            className="bg-copper-400 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-copper-500 transition-colors whitespace-nowrap min-h-[48px] flex-shrink-0"
          >
            Start selling →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 bg-white py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-brand-700">SökoPay</span>
          <p className="text-xs text-neutral-400">© 2025 SökoPay · Connecting local Kenya</p>
          <div className="flex gap-5 text-sm text-neutral-500">
            <a href="/about" className="hover:text-neutral-800 transition-colors">About</a>
            <a href="/support" className="hover:text-neutral-800 transition-colors">Support</a>
            <a href="/contact" className="hover:text-neutral-800 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
