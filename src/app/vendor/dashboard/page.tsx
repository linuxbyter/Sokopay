'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Store, MessageCircle, ShoppingBag, Plus, Settings, Star, Users, MessageSquare } from 'lucide-react';
import Navbar from '@/components/navbar';

interface VendorProfile {
  id: string;
  business_name: string;
  category: string;
  photos: string[];
  is_open: boolean;
}

interface VendorStats {
  customersServed: number;
  totalFeedback: number;
  averageRating: number;
  totalMessages: number;
}

export default function VendorDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchVendorProfile();
    }
  }, [isLoaded, user]);

  const fetchVendorProfile = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/vendors?userId=${user.id}`);
      const data = await response.json();
      const vendors = data.vendors || [];
      if (vendors.length > 0) {
        setVendor(vendors[0]);
        fetchStats(vendors[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch vendor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (isLoaded && !user) {
    router.push('/auth/role');
    return null;
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Vendor has no profile — show onboarding
  if (!vendor) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar title="SökoPay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Welcome{user?.firstName ? `, ${user.firstName}` : ''}!
            </h2>
            <p className="text-neutral-600">Set up your shop and start reaching customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              onClick={() => router.push('/vendor/profile/create')}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 cursor-pointer hover:shadow-md transition-all hover:border-brand-200"
            >
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Create Your Profile</h3>
              <p className="text-sm text-neutral-500">Set up your shop with photos, services, and location</p>
            </div>

            <div
              onClick={() => router.push('/vendor/messages')}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 cursor-pointer hover:shadow-md transition-all hover:border-copper-200"
            >
              <div className="w-12 h-12 bg-copper-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-copper-600" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Messages</h3>
              <p className="text-sm text-neutral-500">Chat with customers and answer their questions</p>
            </div>

            <div
              onClick={() => router.push('/dashboard')}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 cursor-pointer hover:shadow-md transition-all hover:border-neutral-200"
            >
              <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-neutral-600" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Browse as Customer</h3>
              <p className="text-sm text-neutral-500">See the marketplace from a customer perspective</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/vendor/profile/create')}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Set Up Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vendor has a profile — show dashboard with stats
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar title="SökoPay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {vendor.business_name}
          </h2>
          <p className="text-neutral-600">{vendor.category} • {vendor.is_open ? 'Open now' : 'Closed'}</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.customersServed}</p>
                  <p className="text-xs text-neutral-500">Customers Served</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-copper-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-copper-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}</p>
                  <p className="text-xs text-neutral-500">Avg Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalFeedback}</p>
                  <p className="text-xs text-neutral-500">Reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalMessages}</p>
                  <p className="text-xs text-neutral-500">Messages</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => router.push('/vendor/messages')}
            className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 cursor-pointer hover:shadow-md transition-all hover:border-copper-200"
          >
            <div className="w-12 h-12 bg-copper-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">Messages</h3>
            <p className="text-sm text-neutral-500">Chat with customers and answer their questions</p>
          </div>

          <div
            onClick={() => router.push('/vendor/profile/create')}
            className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 cursor-pointer hover:shadow-md transition-all hover:border-brand-200"
          >
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">Edit Profile</h3>
            <p className="text-sm text-neutral-500">Update your shop details, photos, and services</p>
          </div>

          <div
            onClick={() => router.push('/dashboard')}
            className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 cursor-pointer hover:shadow-md transition-all hover:border-neutral-200"
          >
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-neutral-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">Browse as Customer</h3>
            <p className="text-sm text-neutral-500">See the marketplace from a customer perspective</p>
          </div>
        </div>
      </div>
    </div>
  );
}
