'use client';

import { useState, useCallback } from 'react';
import type { BadgeType, BadgeTier } from '@/lib/constants/badges';

interface NewBadge {
  badgeType: BadgeType;
  tier: BadgeTier;
}

export function useBadgeUnlock() {
  const [badge, setBadge] = useState<NewBadge | null>(null);

  const showBadgeUnlock = useCallback((newBadge: NewBadge) => {
    setBadge(newBadge);
  }, []);

  const dismissBadgeUnlock = useCallback(() => {
    setBadge(null);
  }, []);

  return { badge, showBadgeUnlock, dismissBadgeUnlock };
}
