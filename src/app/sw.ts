import { CacheFirst, ExpirationPlugin, NetworkFirst, Serwist } from 'serwist';

import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === 'image',
      handler: new CacheFirst({
        cacheName: 'images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      }),
    },
    {
      matcher: ({ request }) => request.destination === 'font',
      handler: new CacheFirst({
        cacheName: 'fonts',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          }),
        ],
      }),
    },
    {
      matcher: ({ request }) => request.url.includes('/api/'),
      handler: new NetworkFirst({
        cacheName: 'api',
        networkTimeoutSeconds: 10,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 5 * 60,
          }),
        ],
      }),
    },
  ],
});

// Handle share target POST requests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self as any).addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/report/new') {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const file = formData.get('photos') as File | null;
        const title = formData.get('title') as string | null;
        const text = formData.get('description') as string | null;

        // Cache shared file temporarily
        if (file) {
          const cache = await caches.open('share-target-temp');
          await cache.put(
            '/shared-photo',
            new Response(file, {
              headers: {
                'Content-Type': file.type,
                'X-File-Name': file.name,
              },
            })
          );
        }

        // Redirect with query params
        const redirectUrl = new URL('/report/new', url.origin);
        redirectUrl.searchParams.set('shared', '1');
        if (title) redirectUrl.searchParams.set('title', title);
        if (text) redirectUrl.searchParams.set('description', text);

        return Response.redirect(redirectUrl.toString(), 303);
      })()
    );
  }
});

serwist.addEventListeners();

// Handle SKIP_WAITING message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self as any).addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (self as any).skipWaiting();
  }
});
