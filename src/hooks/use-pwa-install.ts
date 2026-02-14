'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PROMPT_DELAY_MS = 1500;
const PWA_PROMPT_DISMISSED_KEY = 'laporlah-pwa-prompt-dismissed';

function getDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PWA_PROMPT_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function setDismissed(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PWA_PROMPT_DISMISSED_KEY, '1');
  } catch {
    // ignore
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const showPromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      if (getDismissed()) return;

      if (showPromptTimerRef.current) clearTimeout(showPromptTimerRef.current);
      showPromptTimerRef.current = setTimeout(() => {
        if (getDismissed()) return;
        setShowPrompt(true);
        showPromptTimerRef.current = null;
      }, PROMPT_DELAY_MS);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (showPromptTimerRef.current) {
        clearTimeout(showPromptTimerRef.current);
        showPromptTimerRef.current = null;
      }
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.error('[PWA] No deferred prompt available');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('[PWA] User accepted install prompt');
        setIsInstalled(true);
      } else {
        console.log('[PWA] User dismissed install prompt');
      }
      setDismissed();

      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowPrompt(false);

      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Error prompting install:', error);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setDismissed();
    setShowPrompt(false);
  }, []);

  return {
    isInstallable,
    isInstalled,
    showPrompt,
    promptInstall,
    dismissPrompt,
  };
}
