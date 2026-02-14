'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const registerSw = async () => {
        try {
          const ok = await fetch('/sw.js', { method: 'HEAD' }).then((r) => r.ok);
          if (!ok) return;
          const registration = await navigator.serviceWorker.register('/sw.js');
          if (process.env.NODE_ENV === 'development') {
            console.log('[SW] Service worker registered:', registration);
          }
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              if (process.env.NODE_ENV === 'development') {
                console.log('[SW] New service worker found, installing...');
              }
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[SW] New content is available; please refresh.');
                }
              });
            }
          });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[SW] Service worker registration failed:', error);
          }
        }
      };
      void registerSw();
    }
  }, []);

  return null;
}
