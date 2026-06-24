'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, MapPin, Clock, MessageSquare, Phone, Star, ChevronLeft, ChevronRight,
  ExternalLink, Loader2, Store, Share2
} from 'lucide-react';
import dynamic from 'next/dynamic';

const MiniMap = dynamic(() => import('@/components/mini-map'), { ssr: false });

interface VendorData {
  id: string;
  business_name: string;
  category: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  hours: Record<string, { open: string; close: string; closed: boolean }> | null;
  services: { name: string; priceHint: string }[] | null;
  whatsapp: string | null;
  phone: string | null;
  photos: string[];
  is_open: boolean;
  created_at: string;
  rating: number;
  feedbackCount: number;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function VendorProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useUser();
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [creatingChat, setCreatingChat] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      const res = await fetch(`/api/vendors/${id}`);
      if (!res.ok) throw new Error('Vendor not found');
      const data = await res.json();
      const v = data.vendor;

      // Fetch rating from feedback
      let rating = 0;
      let feedbackCount = 0;
      try {
        const fbRes = await fetch(`/api/feedback?vendorId=${id}`);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          feedbackCount = (fbData.feedback || []).length;
          if (feedbackCount > 0) {
            const total = fbData.feedback.reduce((sum: number, f: any) => sum + (f.rating || 0), 0);
            rating = total / feedbackCount;
          }
        }
      } catch {}

      let parsedHours = null;
      if (v.hours) {
        try { parsedHours = typeof v.hours === 'string' ? JSON.parse(v.hours) : v.hours; } catch {}
      }
      let parsedServices = null;
      if (v.services) {
        try { parsedServices = typeof v.services === 'string' ? JSON.parse(v.services) : v.services; } catch {}
      }

      setVendor({
        ...v,
        hours: parsedHours,
        services: parsedServices,
        rating,
        feedbackCount,
      });
    } catch (error) {
      console.error('Failed to load vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageVendor = async () => {
    if (!user || !vendor) {
      router.push('/auth/role');
      return;
    }
    setCreatingChat(true);
    try {
      const customerName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.emailAddresses?.[0]?.emailAddress || null;
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendor.id,
          customerId: user.id,
          customerName,
        }),
      });
      const data = await res.json();
      if (data.chat) {
        router.push('/messages');
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setCreatingChat(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${vendor?.business_name} on Sokopay`;
    if (navigator.share) {
      try {
        await navigator.share({ title: vendor?.business_name, text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatHours = (day: string, hours: { open: string; close: string; closed: boolean }) => {
    if (hours.closed) return 'Closed';
    return `${hours.open} - ${hours.close}`;
  };

  const isOpenNow = () => {
    if (!vendor?.hours) return false;
    const now = new Date();
    const dayIndex = (now.getDay() + 6) % 7; // Mon=0, Sun=6
    const today = daysOfWeek[dayIndex];
    const todayHours = vendor.hours[today];
    if (!todayHours || todayHours.closed) return false;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
        <Store className="w-16 h-16 text-neutral-300 mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Shop Not Found</h2>
        <p className="text-neutral-500 mb-6">This shop may have been removed.</p>
        <button
          onClick={() => router.push(user ? '/dashboard' : '/')}
          className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  const open = isOpenNow();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="font-semibold text-neutral-900 truncate">{vendor.business_name}</h1>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={copied ? 'Link copied!' : 'Share'}
          >
            {copied ? <span className="text-xs text-brand-600 font-medium">Copied!</span> : <Share2 className="w-5 h-5 text-neutral-600" />}
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto pb-24">
        {/* Photo Gallery */}
        {vendor.photos && vendor.photos.length > 0 ? (
          <div className="relative bg-neutral-200 aspect-[4/3]">
            <img
              src={vendor.photos[currentPhoto]}
              alt={vendor.business_name}
              className="w-full h-full object-cover"
            />
            {vendor.photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhoto(prev => (prev > 0 ? prev - 1 : vendor.photos.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPhoto(prev => (prev < vendor.photos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {vendor.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhoto(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === currentPhoto ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-neutral-200 aspect-[4/3] flex items-center justify-center">
            <Store className="w-20 h-20 text-neutral-400" />
          </div>
        )}

        {/* Shop Info */}
        <div className="bg-white px-5 py-5 border-b border-neutral-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{vendor.business_name}</h2>
              <p className="text-neutral-500 mt-0.5">{vendor.category}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              open ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
            }`}>
              {open ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {vendor.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-copper-400 fill-copper-400" />
                <span className="font-medium text-neutral-900">{vendor.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-neutral-500">({vendor.feedbackCount} review{vendor.feedbackCount !== 1 ? 's' : ''})</span>
            </div>
          )}

          {vendor.address && (
            <div className="flex items-center gap-2 text-neutral-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{vendor.address}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {vendor.description && (
          <div className="bg-white px-5 py-5 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-2">About</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">{vendor.description}</p>
          </div>
        )}

        {/* Services */}
        {vendor.services && vendor.services.length > 0 && (
          <div className="bg-white px-5 py-5 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-3">Services & Products</h3>
            <div className="space-y-2">
              {vendor.services.map((service, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                  <span className="text-sm text-neutral-700">{service.name}</span>
                  {service.priceHint && (
                    <span className="text-sm font-medium text-brand-600">KES {service.priceHint}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hours */}
        {vendor.hours && (
          <div className="bg-white px-5 py-5 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-3">Operating Hours</h3>
            <div className="space-y-2">
              {daysOfWeek.map(day => (
                <div key={day} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-neutral-600 w-10">{day}</span>
                  <span className={`text-sm ${vendor.hours![day]?.closed ? 'text-neutral-400' : 'text-neutral-700'}`}>
                    {vendor.hours![day] ? formatHours(day, vendor.hours![day]) : 'Not set'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Map */}
        {vendor.latitude && vendor.longitude && (
          <div className="bg-white px-5 py-5 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-3">Location</h3>
            <div className="h-48 rounded-lg overflow-hidden">
              <MiniMap
                latitude={vendor.latitude}
                longitude={vendor.longitude}
                vendorName={vendor.business_name}
              />
            </div>
            <p className="text-sm text-neutral-500 mt-2">{vendor.address}</p>
          </div>
        )}

        {/* Contact */}
        {(vendor.whatsapp || vendor.phone) && (
          <div className="bg-white px-5 py-5 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 mb-3">Contact</h3>
            <div className="space-y-2">
              {vendor.whatsapp && (
                <a
                  href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-2 text-neutral-700 hover:text-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{vendor.whatsapp}</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              )}
              {vendor.phone && (
                <a
                  href={`tel:${vendor.phone}`}
                  className="flex items-center gap-3 py-2 text-neutral-700 hover:text-brand-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{vendor.phone}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleMessageVendor}
            disabled={creatingChat}
            className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-50"
          >
            {creatingChat ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
            {creatingChat ? 'Starting chat...' : 'Message Vendor'}
          </button>
        </div>
      </div>
    </div>
  );
}
