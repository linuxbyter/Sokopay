'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MiniMapProps {
  latitude: number;
  longitude: number;
  vendorName: string;
}

function createMarkerIcon() {
  const html = `
    <div style="
      width: 24px;
      height: 24px;
      background: #D4874D;
      border: 2px solid #CB7233;
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
        font-size: 10px;
        font-weight: bold;
      ">●</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'mini-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
}

export default function MiniMap({ latitude, longitude, vendorName }: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.marker([latitude, longitude], {
      icon: createMarkerIcon(),
    }).addTo(map).bindPopup(vendorName);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, vendorName]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ background: '#0A0A0A' }}
    />
  );
}
