'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { Search, MapPin, List, SlidersHorizontal, Loader2, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/navbar';

const MapView = dynamic(() => import('@/components/map-view'), { ssr: false });

interface Vendor {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distance: number;
  isOpen: boolean;
  photoUrl: string;
  rating: number;
  feedbackCount: number;
  address: string;
}

const allCategories = [
  'Mama/Baba Mboga',
  'Maasai Shop',
  'Barbers',
  'Saloonists',
  'Water Vendors',
  'Gas Refillers',
  'Butcheries',
  'Laundry Mart',
  'SuperMarkets',
  'Eateries',
  'Quick Snacks',
];

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- ALL useState hooks FIRST, before any conditional returns ---
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);

  // --- ALL useEffect hooks BEFORE conditional returns ---
  // Fetch vendors when search/category/sort changes. No location dependency for the fetch itself.
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`/api/vendors?${params.toString()}`);
        const data = await response.json();

        let vendors: Vendor[] = (data.vendors || []).map((v: any) => ({
          id: v.id,
          name: v.business_name,
          category: v.category,
          latitude: v.latitude,
          longitude: v.longitude,
          distance: 0,
          isOpen: v.is_open,
          photoUrl: v.photos?.[0] || '/placeholder.svg',
          rating: parseFloat(v.avg_rating) || 0,
          feedbackCount: parseInt(v.feedback_count) || 0,
          address: v.address || '',
        }));

        // Calculate distance client-side if we have user location
        if (userLocation) {
          vendors = vendors.map(vendor => {
            const R = 6371;
            const dLat = (vendor.latitude - userLocation.lat) * (Math.PI / 180);
            const dLng = (vendor.longitude - userLocation.lng) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userLocation.lat * (Math.PI / 180)) *
                Math.cos(vendor.latitude * (Math.PI / 180)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return { ...vendor, distance };
          });
        }

        if (openNowOnly) {
          vendors = vendors.filter(v => v.isOpen);
        }

        if (sortBy === 'rating') {
          vendors.sort((a, b) => b.rating - a.rating);
        } else {
          vendors.sort((a, b) => a.distance - b.distance);
        }

        setFilteredVendors(vendors);
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        setFilteredVendors([]);
      }
    };

    // Only fetch vendors after Clerk auth is loaded
    if (isLoaded) {
      fetchVendors();
    }
  }, [searchQuery, userLocation, selectedCategory, sortBy, openNowOnly, isLoaded]);

  // --- ALL useCallback hooks BEFORE conditional returns ---
  const handleVendorClick = useCallback((vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  }, [router]);

  // --- Conditional returns AFTER all hooks ---
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/role');
    return null;
  }

  // --- Regular functions AFTER all hooks and conditional returns ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocation('My Location');
        setLocationLoading(false);
      },
      (error) => {
        // Location denied or unavailable — fall back to Nairobi, don't crash
        console.warn('Geolocation error:', error.message);
        setUserLocation({ lat: -1.286389, lng: 36.817223 });
        setLocation('Nairobi (default)');
        setLocationLoading(false);
      }
    );
  };

  const listBtnClass = viewMode === 'list'
    ? 'px-4 py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg transition-colors min-h-[44px]'
    : 'px-4 py-2.5 text-sm font-medium bg-neutral-100 text-neutral-800 rounded-lg transition-colors hover:bg-neutral-200 min-h-[44px]';

  const mapBtnClass = viewMode === 'map'
    ? 'px-4 py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg transition-colors min-h-[44px]'
    : 'px-4 py-2.5 text-sm font-medium bg-neutral-100 text-neutral-800 rounded-lg transition-colors hover:bg-neutral-200 min-h-[44px]';

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <label htmlFor="search" className="sr-only">Search vendors</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you need? (e.g., sukuma wiki, haircut, water)"
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleLocationSearch}
                  type="button"
                  disabled={locationLoading}
                  className="bg-brand-600 text-white py-3 px-4 rounded-md hover:bg-brand-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 min-h-[48px]"
                >
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {location || 'Use My Location'}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  type="button"
                  className="bg-neutral-100 text-neutral-800 py-3 px-4 rounded-md hover:bg-neutral-200 transition-colors flex items-center gap-2 text-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>
            {showFilters && (
              <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-neutral-100">
                <span className="text-sm text-neutral-500">Sort by:</span>
                <button
                  type="button"
                  onClick={() => setSortBy('distance')}
                  className={`px-4 py-2 text-xs rounded-full transition-colors min-h-[40px] ${sortBy === 'distance' ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                >
                  Distance
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-2 text-xs rounded-full transition-colors min-h-[40px] ${sortBy === 'rating' ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                >
                  Rating
                </button>
                <button
                  type="button"
                  onClick={() => setOpenNowOnly(v => !v)}
                  className={`px-4 py-2 text-xs rounded-full transition-colors min-h-[40px] ${openNowOnly ? 'bg-green-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                >
                  Open Now
                </button>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 text-xs rounded-full bg-copper-100 text-copper-700 hover:bg-copper-200 transition-colors min-h-[40px]"
                  >
                    Clear: {selectedCategory}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2.5 text-sm rounded-full transition-colors min-h-[44px] ${!selectedCategory ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
            >
              All
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-4 py-2.5 text-sm rounded-full transition-colors min-h-[44px] ${selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-800">
            {selectedCategory ? selectedCategory : 'All Vendors'}
            <span className="text-sm text-neutral-500 ml-2">({filteredVendors.length} found)</span>
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('list')} className={listBtnClass}>
              <List className="mr-1 h-4 w-4" />
              List
            </button>
            <button onClick={() => setViewMode('map')} className={mapBtnClass}>
              <MapPin className="mr-1 h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {filteredVendors.length > 0 ? (
                filteredVendors.map(vendor => (
                  <div
                    key={vendor.id}
                    className="p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                    onClick={() => router.push(`/vendor/${vendor.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-14 w-14 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {vendor.photoUrl && vendor.photoUrl !== '/placeholder.svg' ? (
                          <img src={vendor.photoUrl} alt={vendor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-neutral-500 font-medium">{vendor.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-neutral-900 truncate">{vendor.name}</h3>
                          {vendor.isOpen && (
                            <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">Open</span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mt-0.5">{vendor.category}</p>
                        <p className="text-sm text-neutral-400 mt-0.5 truncate">{vendor.address}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {userLocation && (
                          <p className="text-sm font-medium text-neutral-700">{vendor.distance.toFixed(1)} km</p>
                        )}
                        <div className="flex items-center gap-1">
                          {vendor.rating > 0 ? (
                            <>
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-neutral-600">{vendor.rating}</span>
                              <span className="text-xs text-neutral-400">({vendor.feedbackCount})</span>
                            </>
                          ) : (
                            <span className="text-xs text-neutral-400">No reviews</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Search className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">
                    {userLocation
                      ? 'No vendors found. Try adjusting your search or filters.'
                      : 'No vendors found. Try a different search or category.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] sm:h-[500px]">
            <MapView
              vendors={filteredVendors}
              userLocation={userLocation}
              onVendorClick={handleVendorClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
