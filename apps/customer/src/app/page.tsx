"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Star, MessageSquare, Leaf, Store, Scissors, Droplet, Flame, Beef, ShoppingBag, ShoppingCart, Utensils, Cookie } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useEffect, useRef } from "react";

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
    icon: Store,
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
  const revealRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* ── Nav ── */}
      <nav className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-bold text-primary tracking-tight">SökoPay</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={go}
              className="text-sm font-semibold text-primary hover:text-primary-hover px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors min-h-[44px]"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(76, 175, 80, 0.08), transparent)"
        }} />
        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide border border-primary/20">
            SökoPay · Changing the ecommerce game
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] leading-tight mb-5 text-text-primary">
            Local vendors,<br className="hidden sm:block" />
            <span className="text-primary"> one tap away</span>
          </h1>
          <p className="text-text-secondary text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
            Mama mbogas, barbers, eateries, water vendors — discover and message them
            instantly. No middlemen, no delivery fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={go}
              className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-base hover:bg-primary-hover transition-all flex items-center justify-center gap-2 min-h-[52px] accent-glow"
            >
              Get started — it's free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={go}
              className="border border-border text-text-secondary font-medium px-8 py-4 rounded-xl text-base hover:bg-surface-hover hover:text-text-primary transition-all min-h-[52px]"
            >
              I'm a vendor →
            </button>
          </div>
        </div>
      </section>

      {/* ── Feature strip ── */}
      <section className="border-y border-border bg-surface/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 text-text-secondary">
            <MessageSquare className="w-4 h-4 text-primary" /> Real-time chat with vendors
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin className="w-4 h-4 text-copper-400" /> Works on slow data
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Star className="w-4 h-4 text-copper-400" /> Free for vendors & customers
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-5xl mx-auto px-4 py-14" ref={addRevealRef}>
        <div className="reveal">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-2 text-center">What do you need?</h2>
          <p className="text-text-tertiary text-center mb-8 text-sm">11 categories of local vendors, all in one place</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.db}
                    onClick={go}
                    className="flex flex-col items-center gap-2 p-4 bg-surface border border-border hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all group min-h-[80px] card-interactive"
                  >
                    <Icon className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium text-text-secondary group-hover:text-primary text-center leading-tight transition-colors">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-border bg-surface/30 py-14">
        <div className="max-w-4xl mx-auto px-4" ref={addRevealRef}>
          <div className="reveal">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-2 text-center">How it works</h2>
            <p className="text-text-tertiary text-center mb-10 text-sm">Simple enough to use on a boda stage</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.title} className="bg-surface border border-border rounded-xl p-6 card-interactive">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
                    </div>
                  );
                })}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={go}
                className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:bg-primary-hover transition-all inline-flex items-center gap-2 min-h-[52px] accent-glow"
              >
                Join SökoPay now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── For vendors callout ── */}
      <section className="max-w-5xl mx-auto px-4 py-14" ref={addRevealRef}>
        <div className="reveal">
          <div className="bg-surface border border-copper-400/20 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="w-10 h-10 bg-copper-400/10 rounded-lg flex items-center justify-center mb-3">
                <Store className="w-5 h-5 text-copper-400" />
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-text-primary mb-1">Own a local business?</h2>
              <p className="text-text-secondary text-sm max-w-sm">
                Get discovered by customers in your area. Set up your shop profile in under 5 minutes — free.
              </p>
            </div>
            <button
              onClick={go}
              className="bg-copper-400 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-copper-500 transition-colors whitespace-nowrap min-h-[48px] flex-shrink-0"
            >
              Start selling →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-surface py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-primary">SökoPay</span>
          <p className="text-xs text-text-tertiary">© 2025 SökoPay · Connecting local Kenya</p>
          <div className="flex gap-5 text-sm text-text-secondary">
            <a href="/about" className="hover:text-text-primary transition-colors">About</a>
            <a href="/support" className="hover:text-text-primary transition-colors">Support</a>
            <a href="/contact" className="hover:text-text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
