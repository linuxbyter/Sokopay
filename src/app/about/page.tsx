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
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-neutral-100 sticky top-0 bg-white z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push(user ? '/dashboard' : '/')}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-lg font-bold text-brand-700">SökoPay</span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="mb-12">
          <div className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
            The Opportunity
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight mb-4">
            Digitising Kenya's<br />
            <span className="text-brand-600">informal commerce</span>
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
            Kenya has millions of micro-vendors — mama mbogas, barbers, eateries, bodas —
            operating entirely offline, invisible to digital consumers. SökoPay is the
            operating layer that connects them.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {stats.map(s => (
            <div key={s.label} className="bg-neutral-50 rounded-2xl p-4 text-center border border-neutral-100">
              <div className="text-2xl font-extrabold text-brand-700 mb-1">{s.value}</div>
              <div className="text-xs text-neutral-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Problem / Solution */}
        <div className="space-y-10 mb-14">
          <div className="flex gap-5">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <TrendingUp className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">The problem</h2>
              <p className="text-neutral-600 leading-relaxed">
                Kenya's informal sector contributes over 30% of GDP yet operates without
                digital infrastructure. Vendors have no online presence. Customers discover
                them only by walking past. Transactions are untracked, unreliable, and unscalable.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <MessageSquare className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">What SökoPay does</h2>
              <p className="text-neutral-600 leading-relaxed">
                A mobile-first marketplace where vendors create a digital shop in under 5 minutes.
                Customers discover, message, and transact — all inside the app. No middlemen,
                no delivery fees, no M-Pesa API complexity in V1. We verify trust through
                peer ratings and a structured transaction confirmation flow.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-10 h-10 bg-copper-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Users className="w-5 h-5 text-copper-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Who we serve</h2>
              <p className="text-neutral-600 leading-relaxed">
                Urban Kenyans aged 18–45 who already use M-Pesa, WhatsApp, and smartphones.
                Our vendors are the neighbourhood businesses they already rely on daily —
                we give those businesses a digital front door.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Traction & roadmap</h2>
              <p className="text-neutral-600 leading-relaxed">
                Currently in MVP — launching in Nairobi with a focus on street food ("Grab Ka-Snacko"),
                barbers, and quick services. V2 roadmap includes M-Pesa integration, delivery
                tracking, vendor analytics, and expansion to Mombasa and Kisumu.
              </p>
            </div>
          </div>
        </div>

        {/* Founder contact */}
        <div className="bg-brand-700 text-white rounded-3xl p-8">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
            <PhoneCall className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Talk to the founder</h2>
          <p className="text-brand-200 text-sm leading-relaxed mb-5">
            We're open to conversations with investors, strategic partners, and
            operators who believe in Kenya's digital commerce future.
            Reach out directly — no pitch deck needed for the first call.
          </p>
          <a
            href="tel:+254700000000"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-5 py-3 rounded-xl hover:bg-brand-50 transition-colors text-sm"
          >
            <PhoneCall className="w-4 h-4" />
            Call the founder
          </a>
          <p className="text-xs text-brand-300 mt-3">+254 700 000 000</p>
        </div>
      </div>
    </div>
  );
}
