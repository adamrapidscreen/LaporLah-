'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { BADGE_DEFINITIONS, TIER_COLORS, type BadgeType, type BadgeTier } from '@/lib/constants/badges';
import { cn } from '@/lib/utils';

interface BadgeUnlockProps {
  badgeType: BadgeType;
  tier: BadgeTier;
  onDismiss?: () => void;
}

export function BadgeUnlock({ badgeType, tier, onDismiss }: BadgeUnlockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const badge = BADGE_DEFINITIONS[badgeType];
  const tierColor = TIER_COLORS[tier];
  const flair = badge.flair[tier];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    // Show toast notification
    toast.success(`🏆 Tahniah! Anda dapat lencana: ${badge.name}`);

    // Auto-dismiss after 5 seconds
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(), 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onDismiss, badge.name]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center pointer-events-none',
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Confetti burst */}
      <div className={cn('absolute inset-0', isVisible && 'animate-confetti')} />

      {/* Badge card */}
      <div
        className={cn(
          'relative pointer-events-auto rounded-xl border-2 p-6 shadow-2xl',
          'flex flex-col items-center gap-3 text-center',
          'transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isVisible ? 'scale-100' : 'scale-0',
          tierColor.border,
          tierColor.bg,
          'bg-card'
        )}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Lencana Baharu!
        </p>
        <span className="text-5xl animate-bounce-once">{badge.emoji}</span>
        <div>
          <p className="text-lg font-bold">{badge.name}</p>
          <p className={cn('text-sm font-medium uppercase', tierColor.text)}>{tier}</p>
        </div>
        <p className="text-sm italic text-muted-foreground">{flair}</p>
      </div>
    </div>
  );
}
