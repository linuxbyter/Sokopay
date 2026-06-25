'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ChevronDown, ChevronUp, MessageSquare, Store, Search, Shield, CreditCard, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    icon: HelpCircle,
    items: [
      {
        q: 'How do I create a shop on SökoPay?',
        a: 'Sign in as a vendor, then go to your dashboard and tap "Create Your Profile". Follow the 7-step wizard to add your business name, category, location, hours, photos, services, and contact info.',
      },
      {
        q: 'How do I find vendors near me?',
        a: 'Sign in as a customer, go to the dashboard, and tap "Use My Location" to see nearby vendors. You can also search by name or browse by category.',
      },
      {
        q: 'Is SökoPay free to use?',
        a: 'Yes! SökoPay is completely free for both vendors and customers. There are no fees for listing or discovering vendors.',
      },
    ],
  },
  {
    category: 'Chat & Transactions',
    icon: MessageSquare,
    items: [
      {
        q: 'How do I chat with a vendor?',
        a: 'Find a vendor on the dashboard, tap on their profile, and tap "Message Vendor". You can then chat in real-time to discuss your order.',
      },
      {
        q: 'How does the transaction flow work?',
        a: 'After chatting with a vendor: 1) Mark as Paid (customer), 2) Confirm Payment (vendor), 3) Mark as Dispatched (vendor), 4) Mark as Served (both parties), 5) Finalize Order.',
      },
      {
        q: 'Can I order again from the same vendor?',
        a: 'Yes! After an order is finalized, tap "Buy Again" to start a new transaction with the same vendor.',
      },
    ],
  },
  {
    category: 'Vendor Profile',
    icon: Store,
    items: [
      {
        q: 'How do I update my shop information?',
        a: 'Go to your vendor dashboard and tap "Edit Profile". You can update your business details, photos, services, and location.',
      },
      {
        q: 'How many photos can I add?',
        a: 'You can add up to 10 photos to your vendor profile. Photos are compressed automatically before upload.',
      },
      {
        q: 'How do customers find my shop?',
        a: 'Customers can find you through search, category browsing, or by viewing vendors on the map near their location.',
      },
    ],
  },
  {
    category: 'Account & Safety',
    icon: Shield,
    items: [
      {
        q: 'How do I sign up?',
        a: 'Tap "Sign In" on the landing page, choose whether you\'re a customer or vendor, and follow the Clerk authentication flow.',
      },
      {
        q: 'Is my information safe?',
        a: 'Yes. We use industry-standard encryption and authentication. Your phone number and personal data are never shared with other users.',
      },
      {
        q: 'How do I report a problem?',
        a: 'Contact us at support@sokopay.com or use the contact page. We respond to all reports within 24 hours.',
      },
    ],
  },
];

export default function SupportPage() {
  const router = useRouter();
  const { user } = useUser();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const goHome = () => router.push(user ? '/dashboard' : '/');

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={goHome}
              className="text-2xl font-bold text-brand-700 hover:text-brand-800 transition-colors"
            >
              SökoPay
            </button>
            <button
              onClick={() => router.back()}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Support Center</h1>
          <p className="text-neutral-600">Find answers to common questions</p>
        </div>

        <div className="space-y-8">
          {faqs.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-brand-600" />
                  <h2 className="text-lg font-semibold text-neutral-900">{section.category}</h2>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 divide-y divide-neutral-100">
                  {section.items.map((item, idx) => {
                    const key = `${section.category}-${idx}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={key}>
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                        >
                          <span className="font-medium text-neutral-900 text-sm">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4">
                            <p className="text-sm text-neutral-600 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
          <MessageSquare className="w-8 h-8 text-brand-600 mx-auto mb-3" />
          <h3 className="font-bold text-neutral-900 mb-1">Still need help?</h3>
          <p className="text-sm text-neutral-500 mb-4">
            WhatsApp us directly — complaints, feedback, or anything at all.
            We respond fast.
          </p>
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            WhatsApp Support
          </a>
          <p className="text-xs text-neutral-400 mt-2">+254 700 000 000</p>
        </div>
      </div>
    </div>
  );
}
