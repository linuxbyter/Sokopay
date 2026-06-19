'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Star, 
  Shield, 
  Zap, 
  Users,
  Menu,
  List,
  Frame,
  Phone,
} from 'lucide-react';

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

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const mapRef = useRef<any>(null);
  const router = useRouter();

  // Mock vendor data - in real app, this would come from Supabase
  const mockVendors: Vendor[] = [
    {
      id: '1',
      name: 'Mama Mboga Stand',
      category: 'Mama/Baba Mboga',
      latitude: -1.2921,
      longitude: 36.8219,
      distance: 0, // Will be calculated
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
    }

  return (
    <div className="min-h-screen bg-neutral-50">
      <h1>Dashboard</h1>
    </div>
  );
}