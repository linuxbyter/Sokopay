'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Store, MessageCircle, ShoppingBag, Plus, Settings, Star, Users, MessageSquare, Trash2, Power, EyeOff } from 'lucide-react';
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
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchVendorProfiles();
    }
  }, [isLoaded, user]);

  const fetchVendorProfiles = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/vendors?userId=${user.id}`);
      const data = await response.json();
      const vendorList = data.vendors || [];
      setVendors(vendorList);
      if (vendorList.length === 1) {
        setSelectedVendor(vendorList[0]);
        fetchStats(vendorList[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch vendor profiles:', error);
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

  const handleToggleOpen = async (vendor: VendorProfile) => {
    try {
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_open: !vendor.is_open }),
      });
      if (response.ok) {
        setVendors(prev => prev.map(v =>
          v.id === vendor.id ? { ...v, is_open: !v.is_open } : v
        ));
        if (selectedVendor?.id === vendor.id) {
          setSelectedVendor(prev => prev ? { ...prev, is_open: !prev.is_open } : null);
        }
      }
    } catch (error) {
      console.error('Failed to toggle open status:', error);
    }
  };

  const handleDeactivate = async (vendor: VendorProfile) => {
    if (!confirm(`Deactivate "${vendor.business_name}"? Your shop will be hidden from customers but all data is kept. You can reactivate anytime by toggling it back open.`)) return;
    setDeleting(vendor.id);
    try {
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_open: false }),
      });
      if (response.ok) {
        setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, is_open: false } : v));
      } else {
        alert('Failed to deactivate shop');
      }
    } catch (error) {
      console.error('Failed to deactivate vendor:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleDelete = async (vendor: VendorProfile) => {
    const confirmed = confirm(
      `Permanently delete "${vendor.business_name}"?\n\n` +
      `WARNING: This will fail if you have any open conversations or unpaid transactions.\n\n` +
      `Consider deactivating instead — it hides your shop without losing any data.`
    );
    if (!confirmed) return;
    setDeleting(vendor.id);
    try {
      const response = await fetch(`/api/vendors/${vendor.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        setVendors(prev => prev.filter(v => v.id !== vendor.id));
        if (selectedVendor?.id === vendor.id) {
          setSelectedVendor(null);
          setStats(null);
        }
      } else {
        alert(data.error || 'Failed to delete shop');
      }
    } catch (error) {
      console.error('Failed to delete vendor:', error);
    } finally {
      setDeleting(null);
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

  // Vendor has no shops — show onboarding
  if (vendors.length === 0) {
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
              <h3 className="font-bold text-neutral-900 mb-1">Create Your First Shop</h3>
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
        </div>
      </div>
    );
  }

  // Vendor has shops — show management view
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar title="SökoPay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
              My Shops
            </h2>
            <p className="text-neutral-600">{vendors.length} shop{vendors.length !== 1 ? 's' : ''} active</p>
          </div>
          <button
            onClick={() => router.push('/vendor/profile/create')}
            className="bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add New Shop
          </button>
        </div>

        {/* Shop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {vendors.map((v) => (
            <div
              key={v.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                selectedVendor?.id === v.id
                  ? 'border-brand-400 ring-2 ring-brand-100'
                  : 'border-neutral-100 hover:shadow-md'
              }`}
            >
              {/* Shop Header */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {v.photos?.[0] ? (
                      <img src={v.photos[0]} alt={v.business_name} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-6 h-6 text-brand-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 truncate">{v.business_name}</h3>
                    <p className="text-sm text-neutral-500">{v.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    v.is_open ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {v.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-neutral-100 px-5 py-3 flex items-center gap-2">
                <button
                  onClick={() => { setSelectedVendor(v); fetchStats(v.id); }}
                  className="flex-1 text-center py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors min-h-[40px]"
                >
                  View Stats
                </button>
                <button
                  onClick={() => handleToggleOpen(v)}
                  className={`p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                    v.is_open ? 'text-green-600 hover:bg-green-50' : 'text-neutral-400 hover:bg-neutral-50'
                  }`}
                  title={v.is_open ? 'Mark as closed' : 'Mark as open'}
                >
                  <Power className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push(`/vendor/profile/create?edit=${v.id}`)}
                  className="p-2 text-neutral-500 hover:bg-neutral-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="Edit shop"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeactivate(v)}
                  disabled={deleting === v.id}
                  className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center disabled:opacity-50"
                  title="Deactivate shop (hides from customers, keeps data)"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(v)}
                  disabled={deleting === v.id}
                  className="p-2 text-red-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center disabled:opacity-50"
                  title="Permanently delete shop"
                >
                  {deleting === v.id ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Add New Shop Card */}
          <button
            onClick={() => router.push('/vendor/profile/create')}
            className="bg-white rounded-xl shadow-sm border-2 border-dashed border-neutral-200 p-6 flex flex-col items-center justify-center min-h-[180px] hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-brand-600" />
            </div>
            <p className="font-medium text-neutral-700">Add New Shop</p>
          </button>
        </div>

        {/* Stats for selected shop */}
        {selectedVendor && stats && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">{selectedVendor.business_name} — Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => router.push('/vendor/messages')}
            className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 cursor-pointer hover:shadow-md transition-all hover:border-copper-200"
          >
            <div className="w-12 h-12 bg-copper-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">Messages</h3>
            <p className="text-sm text-neutral-500">Chat with customers across all your shops</p>
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
