'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface MapViewProps {
  vendors: Vendor[];
  userLocation: { lat: number; lng: number } | null;
  onVendorClick: (vendor: Vendor) => void;
}

function createVendorIcon(isOpen: boolean) {
  const color = isOpen ? '#4CAF50' : '#D4874D';
  const html = `
    <div style="
      width: 28px;
      height: 28px;
      background: ${color};
      border: 2px solid ${isOpen ? '#388E3C' : '#CB7233'};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(45deg);
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">●</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function createUserIcon() {
  const html = `
    <div style="
      width: 16px;
      height: 16px;
      background: #3B82F6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
    "></div>
  `;

  return L.divIcon({
    html,
    className: 'user-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function MapView({ vendors, userLocation, onVendorClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center = userLocation
      ? [userLocation.lat, userLocation.lng] as [number, number]
      : [-1.286389, 36.817223] as [number, number];

    const map = L.map(mapRef.current, {
      center,
      zoom: userLocation ? 14 : 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
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

    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    vendors.forEach(vendor => {
      if (vendor.latitude && vendor.longitude) {
        const marker = L.marker([vendor.latitude, vendor.longitude], {
          icon: createVendorIcon(vendor.isOpen),
        }).addTo(map);

        marker.bindPopup(`
          <div style="
            background: var(--surface, #111);
            color: var(--text-primary, #FAFAFA);
            border: 1px solid var(--border, rgba(255,255,255,0.08));
            border-radius: 12px;
            padding: 12px;
            min-width: 180px;
            font-family: system-ui, sans-serif;
          ">
            ${vendor.photoUrl && vendor.photoUrl !== '/placeholder.svg'
              ? `<img src="${vendor.photoUrl}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />`
              : `<div style="width: 100%; height: 80px; background: var(--surface-hover, #1A1A1A); border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-tertiary, rgba(255,255,255,0.4));">🏪</div>`
            }
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${vendor.name}</div>
            <div style="font-size: 12px; color: var(--text-secondary, rgba(255,255,255,0.65));">${vendor.category}</div>
            <div style="margin-top: 6px;">
              <span style="
                font-size: 11px;
                padding: 2px 8px;
                border-radius: 9999px;
                background: ${vendor.isOpen ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
                color: ${vendor.isOpen ? '#4CAF50' : 'var(--text-tertiary, rgba(255,255,255,0.4))'};
              ">${vendor.isOpen ? 'Open Now' : 'Closed'}</span>
            </div>
          </div>
        `, { className: 'dark-popup' });

        marker.on('click', () => {
          onVendorClick(vendor);
        });
      }
    });

    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserIcon(),
      }).addTo(map).bindPopup('Your location');
    }

    if (vendors.length > 0) {
      const bounds = L.latLngBounds(
        vendors
          .filter(v => v.latitude && v.longitude)
          .map(v => [v.latitude, v.longitude] as [number, number])
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
      className="w-full h-full"
      style={{ background: '#0A0A0A' }}
    />
  );
}
