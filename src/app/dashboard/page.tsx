'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { Search, MapPin, List, Users, Zap, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const mockVendors: Vendor[] = [
  { id: '1', name: 'Mama Mboga Stand', category: 'Mama/Baba Mboga', latitude: -1.2921, longitude: 36.8219, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.5, address: 'Mama Lucy Kibaki Market, Nairobi' },
  { id: '2', name: 'Quick Snacks Corner', category: 'Quick Snacks', latitude: -1.2850, longitude: 36.8180, distance: 0, isOpen: false, photoUrl: '/placeholder.svg', rating: 4.0, address: 'Westlands, Nairobi' },
  { id: '3', name: 'Barber Shop Express', category: 'Barbers', latitude: -1.2800, longitude: 36.8250, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.8, address: 'Kilimani, Nairobi' },
  { id: '4', name: 'Water Source', category: 'Water Vendors', latitude: -1.2950, longitude: 36.8250, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.2, address: 'South B, Nairobi' },
  { id: '5', name: 'Gas Refill Point', category: 'Gas Refillers', latitude: -1.2700, longitude: 36.8300, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.1, address: 'Runda, Nairobi' },
  { id: '6', name: 'Butcheries Ltd', category: 'Butcheries', latitude: -1.2880, longitude: 36.8150, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.6, address: 'Industrial Area, Nairobi' },
  { id: '7', name: 'Fresh Mart Supermarket', category: 'SuperMarkets', latitude: -1.2750, longitude: 36.8200, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.7, address: 'Lavington, Nairobi' },
  { id: '8', name: 'Mama Njeri Eateries', category: 'Eateries', latitude: -1.2830, longitude: 36.8270, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.3, address: 'CBD, Nairobi' },
  { id: '9', name: 'Fresh Laundry Mart', category: 'Laundry Mart', latitude: -1.2910, longitude: 36.8160, distance: 0, isOpen: false, photoUrl: '/placeholder.svg', rating: 4.4, address: 'Kasarani, Nairobi' },
  { id: '10', name: 'Saloon Paradise', category: 'Saloonists', latitude: -1.2770, longitude: 36.8310, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.6, address: 'Westlands, Nairobi' },
  { id: '11', name: 'Maasai General Shop', category: 'Maasai Shop', latitude: -1.2860, longitude: 36.8200, distance: 0, isOpen: true, photoUrl: '/placeholder.svg', rating: 4.2, address: 'CBD, Nairobi' },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [showFilters, setShowFilters] = useState(false);

  if (isLoaded && !user) {
    router.push('/auth/role');
    return null;
  }

  useEffect(() => {
    if (!userLocation) {
      setFilteredVendors(mockVendors);
      return;
    }
    const vendorsWithDistance = mockVendors.map(vendor => {
      const latDiff = vendor.latitude - userLocation.lat;
      const lngDiff = vendor.longitude - userLocation.lng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
      return { ...vendor, distance };
    });
    let results = vendorsWithDistance.filter(vendor =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory) {
      results = results.filter(v => v.category === selectedCategory);
    }
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else {
      results.sort((a, b) => a.distance - b.distance);
    }
    setFilteredVendors(results);
  }, [searchQuery, userLocation, selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLocationSearch = () => {
    setLocation('Nairobi CBD');
    setUserLocation({ lat: -1.286389, lng: 36.817223 });
  };

  const listBtnClass = viewMode === 'list'
    ? 'px-3 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg transition-colors'
    : 'px-3 py-2 text-sm font-medium bg-neutral-100 text-neutral-800 rounded-lg transition-colors hover:bg-neutral-200';

  const mapBtnClass = viewMode === 'map'
    ? 'px-3 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg transition-colors'
    : 'px-3 py-2 text-sm font-medium bg-neutral-100 text-neutral-800 rounded-lg transition-colors hover:bg-neutral-200';

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-brand-700">SökoPay</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600 hidden sm:block">
                {user?.firstName ? `Hi, ${user.firstName}` : 'Dashboard'}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

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
                  className="bg-brand-600 text-white py-3 px-4 rounded-md hover:bg-brand-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <MapPin className="h-4 w-4" />
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
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${sortBy === 'distance' ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                >
                  Distance
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${sortBy === 'rating' ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                >
                  Rating
                </button>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="px-3 py-1 text-xs rounded-full bg-copper-100 text-copper-700 hover:bg-copper-200 transition-colors"
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
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${!selectedCategory ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
            >
              All
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-800">
            {selectedCategory ? selectedCategory : 'All Vendors'}
            {userLocation && <span className="text-sm text-neutral-500 ml-2">({filteredVendors.length} found)</span>}
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
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-14 w-14 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-500 font-medium">{vendor.name.charAt(0)}</span>
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
                        <p className="text-xs text-neutral-400">{vendor.rating} stars</p>
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
                      : 'Tap "Use My Location" to find nearby vendors.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <MapPin className="h-12 w-12 mb-4 text-brand-600" />
                <p className="text-lg font-medium">Map View</p>
                <p className="text-sm">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        )}

        {selectedVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-neutral-900">{selectedVendor.name}</h2>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-20 w-20 bg-neutral-200 rounded-xl flex items-center justify-center">
                    <span className="text-neutral-400 text-2xl font-bold">{selectedVendor.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{selectedVendor.category}</p>
                    <p className="text-sm text-neutral-500">{selectedVendor.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-neutral-600">{selectedVendor.rating} stars</span>
                      {selectedVendor.isOpen && (
                        <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">Open now</span>
                      )}
                    </div>
                  </div>
                </div>
                {userLocation && (
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-sm text-neutral-500">Distance from you</p>
                    <p className="text-lg font-bold text-brand-600">{selectedVendor.distance.toFixed(1)} km</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-1">About</p>
                  <p className="text-sm text-neutral-600">
                    {selectedVendor.name} is a trusted {selectedVendor.category.toLowerCase()} serving the local community with quality products and services.
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  <button className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    Message Vendor
                  </button>
                  <button className="w-full bg-neutral-100 text-neutral-800 py-3 px-4 rounded-lg font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4" />
                    Mark as Served
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}