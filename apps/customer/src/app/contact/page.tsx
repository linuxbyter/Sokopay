'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Mail, MessageCircle, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();
  const { user } = useUser();

  const goHome = () => router.push(user ? '/dashboard' : '/');

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={goHome}
              className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors"
            >
              SökoPay
            </button>
            <button
              onClick={() => router.back()}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-text-primary mb-2">Get in Touch</h1>
          <p className="text-text-secondary">We&apos;d love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="mailto:support@sokopay.com"
            className="bg-surface rounded-xl border border-border p-6 hover:bg-surface-hover transition-all group card-interactive"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">Email Us</h3>
            <p className="text-sm text-text-secondary mb-3">support@sokopay.com</p>
            <div className="flex items-center gap-1 text-sm text-primary">
              <span>Send email</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>

          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface rounded-xl border border-border p-6 hover:bg-surface-hover transition-all group card-interactive"
          >
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success/15 transition-colors">
              <MessageCircle className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">WhatsApp</h3>
            <p className="text-sm text-text-secondary mb-3">Chat with us on WhatsApp</p>
            <div className="flex items-center gap-1 text-sm text-success">
              <span>Open WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </div>

        <div className="mt-12 bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Send us a message</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! We\'ll get back to you soon.'); }} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm text-text-primary placeholder:text-text-tertiary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm text-text-primary placeholder:text-text-tertiary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message</label>
              <textarea
                id="message"
                rows={4}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm text-text-primary placeholder:text-text-tertiary resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
