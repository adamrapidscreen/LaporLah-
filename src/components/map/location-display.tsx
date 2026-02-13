'use client';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Use explicit icon so the pin loads correctly (Leaflet default breaks with bundlers)
const markerIcon = new L.Icon({
  iconUrl: '/icons/marker-icon.png',
  iconRetinaUrl: '/icons/marker-icon-2x.png',
  shadowUrl: '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
        <Marker position={[lat, lng]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
