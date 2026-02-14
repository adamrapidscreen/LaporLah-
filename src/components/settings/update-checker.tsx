'use client';

import { useState } from 'react';

import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

const notAvailableToast = () =>
  toast.info('Semak kemaskini hanya tersedia dalam versi dipasang (PWA) atau production.', {
    description: 'Update check is only available when the app is installed as PWA or in production.',
  });

export function UpdateChecker() {
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    setIsChecking(true);

    try {
      if (!('serviceWorker' in navigator)) {
        toast.info('PWA tidak disokong', {
          description: 'Service workers not supported',
        });
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        notAvailableToast();
        return;
      }

      let registration: ServiceWorkerRegistration | undefined;
      try {
        registration = await navigator.serviceWorker.register('/sw.js');
      } catch {
        registration =
          (await navigator.serviceWorker.getRegistration()) ??
          (await navigator.serviceWorker.getRegistrations())[0];
      }

      if (!registration) {
        notAvailableToast();
        return;
      }

      await registration.update();
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        toast.success('Kemaskini ditemui!', {
          description: 'Aplikasi akan dimuat semula / App will reload',
        });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.success('Anda sudah menggunakan versi terkini', {
          description: "You're on the latest version",
        });
      }
    } catch (error) {
      toast.error('Gagal memeriksa kemaskini', {
        description: 'Failed to check for updates',
      });
      console.error('Update check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Kemaskini / Updates</h3>
      <Button
        variant="secondary"
        className="w-full min-h-[44px]"
        onClick={() => void checkForUpdates()}
        disabled={isChecking}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
        Semak Kemaskini
      </Button>
    </div>
  );
}
