'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  vendors: Array<{
    id: string;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    isOpen: boolean;
    address: string;
  }>;
  userLocation: { lat: number; lng: number } | null;
  onVendorClick: (vendor: any) => void;
}

export default function MapView({ vendors, userLocation, onVendorClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [-1.286389, 36.817223]; // Default to Nairobi

    const map = L.map(mapRef.current, {
      center,
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('Your location');
    }

    // Add vendor markers
    vendors.forEach((vendor) => {
      const vendorIcon = L.divIcon({
        className: 'vendor-marker',
        html: `<div style="width:32px;height:32px;background:${vendor.isOpen ? '#559650' : '#9ca3af'};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([vendor.latitude, vendor.longitude], { icon: vendorIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:150px;">
            <strong style="font-size:14px;">${vendor.name}</strong>
            <br><span style="color:#6b7280;font-size:12px;">${vendor.category}</span>
            <br><span style="font-size:12px;">${vendor.isOpen ? '🟢 Open' : '🔴 Closed'}</span>
          </div>
        `);

      marker.on('click', () => onVendorClick(vendor));
    });

    // Fit bounds if there are vendors
    if (vendors.length > 0) {
      const bounds = L.latLngBounds(
        vendors.map((v) => [v.latitude, v.longitude] as [number, number])
      );
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vendors, userLocation, onVendorClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '500px' }}
    />
  );
}
