'use client';

import dynamic from 'next/dynamic';

const LocationDisplay = dynamic(
  () => import('./location-display').then(mod => mod.LocationDisplay),
  { ssr: false }
);

interface LocationDisplayWrapperProps {
  lat: number;
  lng: number;
  zoom?: number;
}

export function LocationDisplayWrapper({ lat, lng, zoom }: LocationDisplayWrapperProps) {
  return <LocationDisplay lat={lat} lng={lng} zoom={zoom} />;
}
