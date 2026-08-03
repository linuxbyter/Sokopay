'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, MapPin, MessageSquare, TrendingUp, Users, PhoneCall } from 'lucide-react';

const stats = [
  { value: '11', label: 'Vendor categories' },
  { value: 'Free', label: 'For vendors & customers' },
  { value: 'Real-time', label: 'Chat & transactions' },
  { value: 'Kenya', label: 'Starting with Nairobi' },
];

export default function AboutPage() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 bg-surface z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push(user ? '/dashboard' : '/')}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-lg font-bold text-primary">SökoPay</span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
            The Opportunity
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.02em] text-text-primary leading-tight mb-4">
            Digitising Kenya's<br />
            <span className="text-primary">informal commerce</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
            Kenya has millions of micro-vendors — mama mbogas, barbers, eateries, bodas —
            operating entirely offline, invisible to digital consumers. SökoPay is the
            operating layer that connects them.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {stats.map(s => (
            <div key={s.label} className="bg-surface rounded-xl p-4 text-center border border-border">
              <div className="text-2xl font-semibold text-primary mb-1">{s.value}</div>
              <div className="text-xs text-text-secondary font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-10 mb-14">
          <div className="flex gap-5">
            <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <TrendingUp className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-text-primary mb-2">The problem</h2>
              <p className="text-text-secondary leading-relaxed">
                Kenya's informal sector contributes over 30% of GDP yet operates without
                digital infrastructure. Vendors have no online presence. Customers discover
                them only by walking past. Transactions are untracked, unreliable, and unscalable.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-text-primary mb-2">What SökoPay does</h2>
              <p className="text-text-secondary leading-relaxed">
                A mobile-first marketplace where vendors create a digital shop in under 5 minutes.
                Customers discover, message, and transact — all inside the app. No middlemen,
                no delivery fees, no M-Pesa API complexity in V1. We verify trust through
                peer ratings and a structured transaction confirmation flow.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-10 h-10 bg-copper-400/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Users className="w-5 h-5 text-copper-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-text-primary mb-2">Who we serve</h2>
              <p className="text-text-secondary leading-relaxed">
                Urban Kenyans aged 18–45 who already use M-Pesa, WhatsApp, and smartphones.
                Our vendors are the neighbourhood businesses they already rely on daily —
                we give those businesses a digital front door.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-text-primary mb-2">Traction & roadmap</h2>
              <p className="text-text-secondary leading-relaxed">
                Currently in MVP — launching in Nairobi with a focus on street food ("Grab Ka-Snacko"),
                barbers, and quick services. V2 roadmap includes M-Pesa integration, delivery
                tracking, vendor analytics, and expansion to Mombasa and Kisumu.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-2xl p-8">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Talk to the founder</h2>
          <p className="text-primary-foreground/70 text-sm leading-relaxed mb-5">
            We're open to conversations with investors, strategic partners, and
            operators who believe in Kenya's digital commerce future.
            Reach out directly — no pitch deck needed for the first call.
          </p>
          <a
            href="tel:+254700000000"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-5 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm"
          >
            <PhoneCall className="w-4 h-4" />
            Call the founder
          </a>
          <p className="text-xs text-primary-foreground/50 mt-3">+254 700 000 000</p>
        </div>
      </div>
    </div>
  );
}
