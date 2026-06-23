'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Store, MessageCircle, Settings, Plus, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/navbar';

export default function VendorDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (isLoaded && !user) {
    router.push('/auth/role');
    return null;
  }

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
            <button
              onClick={() => router.push('/vendor/profile/create')}
              className="bg-neutral-100 text-neutral-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
