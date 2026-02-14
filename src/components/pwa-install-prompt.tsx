'use client';

import { Download, X } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { usePWAInstall } from '@/hooks/use-pwa-install';

export function PWAInstallPrompt() {
  const { isInstallable, showPrompt, promptInstall, dismissPrompt } = usePWAInstall();

  useEffect(() => {
    // Show toast when install prompt is available
    if (isInstallable && showPrompt) {
      const toastId = toast('Pasang LaporLah ke telefon anda', {
        description: 'Dapatkan akses pantas dan notifikasi masa nyata!',
        action: {
          label: 'Pasang',
          onClick: () => {
            promptInstall();
          },
        },
        duration: 0, // Don't auto-dismiss
      });

      // Store toast ID to dismiss later
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [isInstallable, showPrompt, promptInstall]);

  if (!showPrompt || !isInstallable || !isClientSide()) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4 fade-in-4 duration-300">
      <div className="bg-card border-2 border-primary/20 rounded-xl p-4 shadow-2xl">
        <button
          onClick={dismissPrompt}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded-md transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Download className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">Pasang LaporLah</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Dapatkan akses pantas dan notifikasi masa nyata terus ke telefon anda!
            </p>

            <Button
              onClick={async () => {
                const installed = await promptInstall();
                if (installed) {
                  toast.success('Terima kasih kerana memasang LaporLah!');
                }
                dismissPrompt();
              }}
              size="sm"
              className="w-full"
            >
              Pasang Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to ensure we only render on client side
function isClientSide() {
  return typeof window !== 'undefined';
}
