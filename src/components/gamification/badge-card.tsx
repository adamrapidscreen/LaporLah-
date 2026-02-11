import { Lock } from 'lucide-react';

import { BADGE_DEFINITIONS, TIER_COLORS, type BadgeType, type BadgeTier } from '@/lib/constants/badges';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badgeType: BadgeType;
  tier: BadgeTier;
  currentCount: number;
  earned?: boolean;
}

export function BadgeCard({ badgeType, tier, currentCount, earned = true }: BadgeCardProps) {
  const badge = BADGE_DEFINITIONS[badgeType];

  // Locked state: show progress toward bronze
  if (!earned) {
    const bronzeThreshold = badge.thresholds.bronze;
    const progressPercent = Math.min((currentCount / bronzeThreshold) * 100, 100);

    return (
      <div className="border-2 rounded-lg p-4 space-y-2 border-muted bg-muted/30 opacity-70">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl grayscale">{badge.emoji}</span>
            <Lock className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-muted-foreground">{badge.name}</p>
            <p className="text-xs font-medium uppercase text-muted-foreground">Belum dibuka</p>
          </div>
        </div>

        <p className="text-sm italic text-muted-foreground">{badge.description}</p>

        {/* Progress bar toward bronze */}
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-muted-foreground/40 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {currentCount}/{bronzeThreshold} {badge.metric} untuk buka
          </p>
        </div>
      </div>
    );
  }

  // Earned state: existing logic
  const tierColor = TIER_COLORS[tier];
  const flair = badge.flair[tier];

  // Calculate progress to next tier
  const tiers: BadgeTier[] = ['bronze', 'silver', 'gold'];
  const currentTierIndex = tiers.indexOf(tier);
  const nextTier = currentTierIndex < 2 ? tiers[currentTierIndex + 1] : null;
  const nextThreshold = nextTier ? badge.thresholds[nextTier] : badge.thresholds[tier];
  const isMaxed = tier === 'gold';

  // Progress calculation
  const progressPercent = isMaxed
    ? 100
    : Math.min((currentCount / nextThreshold) * 100, 100);

  return (
    <div className={cn('border-2 rounded-lg p-4 space-y-2', tierColor.border, tierColor.bg)}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{badge.emoji}</span>
        <div>
          <p className="font-semibold">{badge.name}</p>
          <p className={cn('text-xs font-medium uppercase', tierColor.text)}>{tier}</p>
        </div>
      </div>

      <p className="text-sm italic text-muted-foreground">{flair}</p>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isMaxed
            ? `${currentCount} ${badge.metric} — Tahap tertinggi!`
            : `${currentCount}/${nextThreshold} ${badge.metric}`}
        </p>
      </div>
    </div>
  );
}
