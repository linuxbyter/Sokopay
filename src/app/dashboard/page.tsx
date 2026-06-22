'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distance: number; // in km
  isOpen: boolean;
  photoUrl: string;
  rating: number;
  address: string;
}

// Mock vendor data - in real app, this would come from Supabase
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Mama Mboga Stand',
    category: 'Mama/Baba Mboga',
    latitude: -1.2921,
    longitude: 36.8219,
    distance: 0,
    isOpen: true,
    photoUrl: '/placeholder.svg',
    rating: 4.5,
    address: 'Mama Lucy Kibaki Market, Nairobi'
  },
  {
    id: '2',
    name: 'Quick Snacks Corner',
    category: 'Quick Snacks',
    latitude: -1.2850,
    longitude: 36.8180,
    distance: 0,
    isOpen: false,
    photoUrl: '/placeholder.svg',
    rating: 4.0,
    address: 'Westlands, Nairobi'
  },
  {
    id: '3',
    name: 'Barber Shop Express',
    category: 'Barbers',
    latitude: -1.2800,
    longitude: 36.8250,
    distance: 0,
    isOpen: true,
    photoUrl: '/placeholder.svg',
    rating: 4.8,
    address: 'Kilimani, Nairobi'
  },
  {
    id: '4',
    name: 'Water Source',
    category: 'Water Vendors',
    latitude: -1.2950,
    longitude: 36.8250,
    distance: 0,
    isOpen: true,
    photoUrl: '/placeholder.svg',
    rating: 4.2,
    address: 'South B, Nairobi'
  },
  {
    id: '5',
    name: 'Gas Refill Point',
    category: 'Gas Refillers',
    latitude: -1.2700,
    longitude: 36.8300,
    distance: 0,
    isOpen: true,
    photoUrl: '/placeholder.svg',
    rating: 4.1,
    address: 'Runda, Nairobi'
  },
  {
    id: '6',
    name: 'Butcheries Ltd',
    category: 'Butcheries',
    latitude: -1.2880,
    longitude: 36.8150,
    distance: 0,
    isOpen: true,
    photoUrl: '/placeholder.svg',
    rating: 4.6,
    address: 'Industrial Area, Nairobi'
  },
  {
    id: '7',
    name: 'Fresh Mart Supermarket',
    category: 'SuperMarkets',
    latitude: -1.2750,
    longitude: 36.8200,
    distance: 0,
    isOpen: true,
    photoUrl: '/placeholder.svg',
    rating: 4.7,
    address: 'Lavington, Nairobi'
  ];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Calculate distances and filter vendors based on search query and user location
  useEffect(() => {
    if (!userLocation) return;

    // Simple distance calculation for demo (in real app, use Haversine or a library)
    const vendorsWithDistance = mockVendors.map(vendor => {
      // For demo purposes, we'll use a simple Euclidean distance approximation
      // In a real app, you'd use the Haversine formula or a geolocation library
      const latDiff = vendor.latitude - userLocation.lat;
      const lngDiff = vendor.longitude - userLocation.lng;
      // Rough approximation: 1 degree ≈ 111 km
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
      return { ...vendor, distance };
    });

    // Filter vendors based on search query (case insensitive)
    const filtered = vendorsWithDistance.filter(vendor => 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by distance (closest first)
    const sorted = [...filtered].sort((a, b) => a.distance - b.distance);

    setFilteredVendors(sorted);
  }, [searchQuery, userLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is handled by the useEffect above
  };

  const handleLocationSearch = () => {
    // In a real app, we would use a geocoding service to convert text to coordinates
    // For now, we'll just set a fixed location (Nairobi CBD)
    setLocation('Nairobi CBD');
    setUserLocation({ lat: -1.286389, lng: 36.817223 });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-brand-600 mb-6">Dashboard</h1>
          
          {/* Search and Location */}
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
                      placeholder="Search for vendors..."
                      className="block w-full pl-10 pr-3 py-3 bg-neutral-50 border border-neutral-200 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                    />
                  </div>
                </div>
                <div className="flex sm:flex-col sm:w-auto w-full gap-3">
                  <button
                    onClick={handleLocationSearch}
                    className="flex-1 bg-brand-600 text-white py-3 px-4 rounded-md hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Use My Location
                  </button>
                </div>
              </div>
              {location && (
                <p className="text-sm text-neutral-500">Current location: {location}</p>
              )}
            </form>
          </div>
          
          {/* Category Chips */}
          <div className="mb-6">
            <h2 className="sr-only">Filter by category</h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-3 py-1.5 text-sm bg-neutral-100 text-neutral-800 rounded-full hover:bg-neutral-200 transition-colors">
                All Categories
              </button>
              <button className="px-3 py-1.5 text-sm bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors">
                Mama/Baba Mboga
              </button>
              <button className="px-3 py-1.5 text-sm bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors">
                Quick Snacks
              </button>
              <button className="px-3 py-1.5 text-sm bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors">
                Barbers
              </button>
              <button className="px-3 py-1.5 text-sm bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors">
                Water Vendors
              </button>
              <button className="px-3 py-1.5 text-sm bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors">
                Gas Refillers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}