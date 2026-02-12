'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationDisplayProps {
  lat: number;
  lng: number;
  zoom?: number;
}

export function LocationDisplay({ lat, lng, zoom = 15 }: LocationDisplayProps) {
  return (
    <div className="relative z-0 rounded-xl overflow-hidden h-[180px]">
      <MapContainer center={[lat, lng]} zoom={zoom} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
    </div>
  );
}
