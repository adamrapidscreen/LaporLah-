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
    <MapContainer center={[lat, lng]} zoom={zoom} className="h-48 w-full rounded-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
