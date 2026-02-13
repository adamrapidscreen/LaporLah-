'use client';

import { useState, useTransition } from 'react';

import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function UpdateChecker() {
  const [isPending, startTransition] = useTransition();
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    setIsChecking(true);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          await registration.update();
          
          if (registration.waiting) {
            // New service worker is waiting
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            toast.success('Kemaskini ditemui!', {
              description: 'Aplikasi akan dimuat semula / App will reload',
            });
            
            // Wait a moment then reload
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            toast.success('Anda sudah menggunakan versi terkini', {
              description: 'You\'re on the latest version',
            });
          }
        } else {
          toast.info('Service worker tidak dijumpai', {
            description: 'Service worker not found',
          });
        }
      } else {
        toast.info('PWA tidak disokong', {
          description: 'Service workers not supported',
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
        onClick={() => startTransition(() => { void checkForUpdates(); })}
        disabled={isPending || isChecking}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${(isPending || isChecking) ? 'animate-spin' : ''}`} />
        Semak Kemaskini
      </Button>
    </div>
  );
}
