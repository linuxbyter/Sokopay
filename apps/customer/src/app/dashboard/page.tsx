'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { Search, MapPin, SlidersHorizontal, Loader2, Star, X, Leaf, Store, Scissors, Droplet, Flame, Beef, ShoppingBag, ShoppingCart, Utensils, Cookie, Map } from 'lucide-react';
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
  { icon: Leaf, label: 'Mama Mboga',     db: 'Mama/Baba Mboga' },
  { icon: Store, label: 'Maasai Shop',   db: 'Maasai Shop' },
  { icon: Scissors, label: 'Barbers',     db: 'Barbers' },
  { icon: Scissors, label: 'Saloonists',  db: 'Saloonists' },
  { icon: Droplet, label: 'Water',        db: 'Water Vendors' },
  { icon: Flame, label: 'Gas',            db: 'Gas Refillers' },
  { icon: Beef, label: 'Butcheries',      db: 'Butcheries' },
  { icon: ShoppingBag, label: 'Laundry',   db: 'Laundry Mart' },
  { icon: ShoppingCart, label: 'Supermarkets', db: 'SuperMarkets' },
  { icon: Utensils, label: 'Eateries',    db: 'Eateries' },
  { icon: Cookie, label: 'Snacks',        db: 'Quick Snacks' },
];

function SkeletonCard() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-border animate-pulse">
      <div className="h-40 bg-surface-hover" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-surface-hover rounded w-3/4" />
        <div className="h-3 bg-surface-hover rounded w-1/2" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 bg-surface-hover rounded-full w-16" />
          <div className="h-5 bg-surface-hover rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

function VendorCard({ vendor, onClick, userLocation }: {
  vendor: Vendor;
  onClick: () => void;
  userLocation: { lat: number; lng: number } | null;
}) {
  const cat = allCategories.find(c => c.db === vendor.category);

  return (
    <button
      onClick={onClick}
      className="bg-surface rounded-xl overflow-hidden border border-border hover:border-border-strong hover:bg-surface-hover transition-all text-left w-full card-interactive"
    >
      <div className="h-40 bg-surface-hover relative overflow-hidden">
        {vendor.photoUrl && vendor.photoUrl !== '/placeholder.svg' ? (
          <img
            src={vendor.photoUrl}
            alt={vendor.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            {cat ? <cat.icon className="w-10 h-10 text-text-tertiary" /> : <Store className="w-10 h-10 text-text-tertiary" />}
            <span className="text-xs text-text-tertiary">{vendor.category}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            vendor.isOpen
              ? 'bg-success text-white'
              : 'bg-black/40 text-white/90'
          }`}>
            {vendor.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        {userLocation && vendor.distance > 0 && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/40 text-white">
              {vendor.distance < 1
                ? `${Math.round(vendor.distance * 1000)}m`
                : `${vendor.distance.toFixed(1)}km`}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="font-semibold text-text-primary text-sm truncate">{vendor.name}</div>
        <div className="text-xs text-text-tertiary mt-0.5 truncate">{vendor.address || vendor.category}</div>
        <div className="flex items-center gap-2 mt-2">
          {vendor.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-copper-400 text-copper-400" />
              <span className="text-xs font-medium text-text-secondary">{vendor.rating.toFixed(1)}</span>
              <span className="text-xs text-text-tertiary">({vendor.feedbackCount})</span>
            </div>
          ) : (
            <span className="text-xs text-text-tertiary">No reviews yet</span>
          )}
        </div>
      </div>
    </button>
  );
}

function EmptyState({ search, category, onClear }: {
  search: string;
  category: string | null;
  onClear: () => void;
}) {
  return (
    <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center py-16 text-center px-4">
      <Search className="w-12 h-12 text-text-tertiary mb-4" />
      <h3 className="font-semibold text-text-primary mb-1">
        {search ? `No results for "${search}"` : category ? `No ${category} vendors yet` : 'No vendors found'}
      </h3>
      <p className="text-sm text-text-secondary mb-5 max-w-xs">
        {search
          ? 'Try a different search — maybe "sukuma", "chips", or your vendor\'s name'
          : 'Be the first in this area or try another category'}
      </p>
      {(search || category) && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          <X className="w-4 h-4" /> Clear filters
        </button>
      )}
    </div>
  );
}

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [draftQuery, setDraftQuery] = useState(searchParams.get('search') || '');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchVendors = async () => {
      setFetchLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`/api/vendors?${params.toString()}`);
        const data = await response.json();

        let list: Vendor[] = (data.vendors || []).map((v: any) => ({
          id: v.id,
          name: v.business_name,
          category: v.category,
          latitude: parseFloat(v.latitude) || 0,
          longitude: parseFloat(v.longitude) || 0,
          distance: 0,
          isOpen: v.is_open,
          photoUrl: v.photos?.[0] || '/placeholder.svg',
          rating: parseFloat(v.avg_rating) || 0,
          feedbackCount: parseInt(v.feedback_count) || 0,
          address: v.address || '',
        }));

        if (userLocation) {
          list = list.map(vendor => {
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

        if (openNowOnly) list = list.filter(v => v.isOpen);
        list.sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.distance - b.distance);

        setVendors(list);
      } catch {
        setVendors([]);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchVendors();
  }, [searchQuery, userLocation, selectedCategory, sortBy, openNowOnly, isLoaded]);

  const handleVendorClick = useCallback((vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  }, [router]);

  const handleLocationSearch = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setUserLocation({ lat: -1.286389, lng: 36.817223 });
        setLocationLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDraftQuery('');
    setSelectedCategory(null);
    setOpenNowOnly(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/role');
    return null;
  }

  const firstName = user.firstName || 'there';
  const activeFilters = [selectedCategory, openNowOnly ? 'Open Now' : null].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar glass />

      <div className="max-w-5xl mx-auto px-4 pb-10">

        {/* ── Greeting + location ───────────────────────── */}
        <div className="pt-5 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-text-primary">Habari, {firstName}!</h1>
            <p className="text-sm text-text-secondary mt-0.5">What do you need today?</p>
          </div>
          <button
            onClick={handleLocationSearch}
            disabled={locationLoading}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-colors min-h-[36px] ${
              userLocation
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-surface text-text-secondary border-border hover:border-primary/30 hover:text-primary'
            }`}
          >
            {locationLoading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <MapPin className="w-3.5 h-3.5" />}
            {userLocation ? 'Near me' : 'Use location'}
          </button>
        </div>

        {/* ── Search bar ────────────────────────────────── */}
        <div className="flex gap-2 mb-4">
          <form
            onSubmit={e => { e.preventDefault(); setSearchQuery(draftQuery); }}
            className="flex-1 relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              type="search"
              value={draftQuery}
              onChange={e => setDraftQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearchQuery(draftQuery)}
              placeholder="Search vendors, sukuma wiki, barber…"
              className="w-full pl-9 pr-3 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none min-h-[48px]"
            />
            {draftQuery && (
              <button
                type="button"
                onClick={() => { setDraftQuery(''); setSearchQuery(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-3 rounded-xl border text-sm font-medium transition-colors min-h-[48px] ${
              showFilters || activeFilters.length > 0
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-surface text-text-secondary border-border hover:border-primary/30'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilters.length > 0 ? `Filters (${activeFilters.length})` : 'Filter'}
          </button>
        </div>

        {/* ── Filter panel ──────────────────────────────── */}
        {showFilters && (
          <div className="bg-surface border border-border rounded-xl p-4 mb-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">Sort by</p>
              <div className="flex gap-2">
                {(['distance', 'rating'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
                      sortBy === s ? 'bg-primary text-primary-foreground' : 'bg-surface-hover text-text-secondary hover:bg-surface'
                    }`}
                  >
                    {s === 'distance' ? 'Nearest' : 'Top rated'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">Availability</p>
              <button
                onClick={() => setOpenNowOnly(v => !v)}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
                  openNowOnly ? 'bg-success text-white' : 'bg-surface-hover text-text-secondary hover:bg-surface'
                }`}
              >
                Open now only
              </button>
            </div>
            {activeFilters.length > 0 && (
              <button onClick={clearFilters} className="text-xs text-destructive hover:text-destructive/80 font-medium">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Category chips ────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
              !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-secondary border border-border hover:border-primary/30'
            }`}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat.db}
              onClick={() => setSelectedCategory(selectedCategory === cat.db ? null : cat.db)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                selectedCategory === cat.db
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-text-secondary border border-border hover:border-primary/30'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" /> {cat.label}
            </button>
          ))}
        </div>

        {/* ── View toggle + count ───────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-secondary">
            {fetchLoading ? 'Loading…' : `${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} found`}
          </p>
          <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              Map
            </button>
          </div>
        </div>

        {/* ── Grid view ─────────────────────────────────── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {!fetchLoading && !selectedCategory && !searchQuery && (
              <button
                onClick={() => setSelectedCategory('Quick Snacks')}
                className="col-span-2 sm:col-span-3 bg-gradient-to-r from-copper-500/20 to-copper-400/20 rounded-xl p-5 text-left border border-copper-400/20 hover:border-copper-400/40 transition-all"
              >
                <div className="text-3xl mb-2">🧆</div>
                <h3 className="font-semibold text-text-primary text-lg leading-tight">Quick Snacks</h3>
                <p className="text-text-secondary text-sm mt-1">
                  Smocha, Chapati, Viazi — find top-rated street food stalls near you
                </p>
                <span className="inline-block mt-3 bg-copper-400/20 text-copper-400 text-xs font-semibold px-3 py-1 rounded-full">
                  Browse now →
                </span>
              </button>
            )}

            {fetchLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : vendors.length === 0
                ? <EmptyState search={searchQuery} category={selectedCategory} onClear={clearFilters} />
                : vendors.map(vendor => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onClick={() => handleVendorClick(vendor)}
                      userLocation={userLocation}
                    />
                  ))
            }
          </div>
        )}

        {/* ── Map view ──────────────────────────────────── */}
        {viewMode === 'map' && (
          <div className="bg-surface rounded-xl border border-border overflow-hidden h-[70vh] min-h-[400px]">
            {fetchLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-surface-hover animate-pulse">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                  <p className="text-sm text-text-tertiary">Loading map…</p>
                </div>
              </div>
            ) : vendors.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center px-6">
                  <Map className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
                  <h3 className="font-semibold text-text-primary mb-1">No vendors on the map</h3>
                  <p className="text-sm text-text-secondary">Try removing filters or searching a different area</p>
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors">
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <MapView
                vendors={vendors}
                userLocation={userLocation}
                onVendorClick={handleVendorClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-7 h-7 text-primary animate-spin" />
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
