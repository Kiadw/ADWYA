'use client';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Supplier {
  name: string;
  country: string;
  lat: number;
  lng: number;
  availability: string;
  price_usd_per_kg?: number;
}

export default function SupplierMap({ suppliers }: { suppliers: Supplier[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || suppliers.length === 0) return;
    if (mapInstance.current) mapInstance.current.remove();

    const map = L.map(mapRef.current).setView([30, 0], 2);
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const colorMap: Record<string, string> = {
      'In Stock': '#10b981',
      'Limited': '#f59e0b',
      'Out of Stock': '#ef4444',
      'Lead Time': '#6366f1'
    };

    for (const s of suppliers) {
      if (!s.lat || !s.lng) continue;
      const color = colorMap[s.availability] || '#6b7280';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      L.marker([s.lat, s.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${s.name}</strong><br/>${s.country}<br/>Status: ${s.availability}${s.price_usd_per_kg ? `<br/>~$${s.price_usd_per_kg}/kg` : ''}`);
    }

    setTimeout(() => map.invalidateSize(), 100);
    return () => { map.remove(); mapInstance.current = null; };
  }, [suppliers]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }} />;
}
