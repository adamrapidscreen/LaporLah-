import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LaporLah!',
    short_name: 'LaporLah',
    description: 'Community-driven civic issue reporting for Malaysia',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0D12',
    theme_color: '#10B981',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
