'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import L from 'leaflet';
import { MapPin, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';

import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { reverseGeocode } from '@/lib/utils/geocoding';

import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    area_name: string;
  }) => void;
}

// Default: Kuala Lumpur
const DEFAULT_CENTER: [number, number] = [3.139, 101.6869];
const DEFAULT_ZOOM = 15;

// Fix Leaflet default icon issue with bundlers
const markerIcon = new L.Icon({
  iconUrl: '/icons/marker-icon.png',
  iconRetinaUrl: '/icons/marker-icon-2x.png',
  shadowUrl: '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function DraggableMarker({
  position,
  onMove,
}: {
  position: [number, number];
  onMove: (lat: number, lng: number) => void;
}) {
  const eventHandlers = {
    dragend(e: L.DragEndEvent) {
      const marker = e.target;
      const pos = marker.getLatLng();
      onMove(pos.lat, pos.lng);
    },
  };

  return <Marker position={position} draggable icon={markerIcon} eventHandlers={eventHandlers} />;
}

function MapViewUpdater({
  position,
  zoom,
}: {
  position: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom, { animate: true });
  }, [position, zoom, map]);
  return null;
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const { latitude, longitude, accuracy, loading, error, requestLocation } = useGeolocation();
  const [position, setPosition] = useState<[number, number]>(DEFAULT_CENTER);
  const [areaName, setAreaName] = useState<string>('');
  const mapKeyRef = useRef(0);

  const handleGeocode = useCallback(async (lat: number, lng: number) => {
    const name = await reverseGeocode(lat, lng);
    setAreaName(name);
    onLocationSelect({ latitude: lat, longitude: lng, area_name: name });
  }, [onLocationSelect]);

  useEffect(() => {
    if (latitude && longitude) {
      // Update position to show GPS coordinates on map
      setPosition([latitude, longitude]);
      handleGeocode(latitude, longitude);
    }
  }, [latitude, longitude, handleGeocode]);

  const handleMarkerMove = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    handleGeocode(lat, lng);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Location</label>
      <div className="relative rounded-xl overflow-hidden h-[180px] z-0 border border-border">
        <MapContainer
          center={position}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
          scrollWheelZoom={false}
          key={mapKeyRef.current}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewUpdater position={position} zoom={DEFAULT_ZOOM} />
          <DraggableMarker position={position} onMove={handleMarkerMove} />
        </MapContainer>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 z-10 min-h-[44px] min-w-[44px]"
          onClick={requestLocation}
          disabled={loading}
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      {areaName && (
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {areaName}
        </p>
      )}
      {accuracy && (
        <p className="text-xs text-muted-foreground">
          Accuracy: ±{Math.round(accuracy)} m
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
