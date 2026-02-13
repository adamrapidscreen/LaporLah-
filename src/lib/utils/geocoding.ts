interface NominatimResponse {
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: { 'User-Agent': 'LaporLah/1.0' },
      }
    );

    if (!response.ok) throw new Error('Geocode failed');

    const data: NominatimResponse = await response.json();
    const { road, suburb, city } = data.address;

    // Build a concise area name
    const parts = [road, suburb, city].filter(Boolean);
    return parts.join(', ') || data.display_name;
  } catch {
    return 'Unknown location';
  }
}
