'use client';

import { useRouter } from 'next/navigation';
import { Mail, MessageCircle, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Get in Touch</h1>
          <p className="text-neutral-600">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="mailto:support@sokopay.com"
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-all hover:border-brand-200 group"
          >
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
              <Mail className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">Email Us</h3>
            <p className="text-sm text-neutral-500 mb-3">support@sokopay.com</p>
            <div className="flex items-center gap-1 text-sm text-brand-600">
              <span>Send email</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>

          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-all hover:border-green-200 group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">WhatsApp</h3>
            <p className="text-sm text-neutral-500 mb-3">Chat with us on WhatsApp</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <span>Open WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="font-bold text-neutral-900 mb-4">Send us a message</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! We\'ll get back to you soon.'); }} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea
                id="message"
                rows={4}
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
