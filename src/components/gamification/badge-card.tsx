import { Lock, Lightbulb, Handshake, CheckCircle } from 'lucide-react';

import { BADGE_DEFINITIONS, TIER_COLORS, type BadgeType, type BadgeTier } from '@/lib/constants/badges';
import { cn } from '@/lib/utils';

const BADGE_ICONS: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  handshake: Handshake,
  'check-circle': CheckCircle,
};

const FLAIR_EN: Record<BadgeType, Record<BadgeTier, string>> = {
  spotter: { bronze: 'New Spotter', silver: 'Experienced Spotter', gold: 'Top Spotter' },
  kampung_hero: { bronze: 'Caring Neighbour', silver: 'Kampung Hero', gold: 'Kampung Legend' },
  closer: { bronze: 'New Closer', silver: 'Skilled Closer', gold: 'Top Closer' },
};

const METRIC_UNLOCK: Record<BadgeType, string> = {
  spotter: 'reports to unlock',
  kampung_hero: 'comments to unlock',
  closer: 'resolutions to unlock',
};

const TIER_GLOW = {
  bronze: 'bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]',
  silver: 'bg-slate-400/10 shadow-[0_0_15px_rgba(148,163,184,0.2)]',
  gold: 'bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
} as const;

const TIER_PILL = {
  bronze: 'text-orange-400 bg-orange-500/10',
  silver: 'text-slate-400 bg-slate-400/10',
  gold: 'text-yellow-500/10 bg-yellow-500/10',
} as const;

interface BadgeCardProps {
  badgeType: BadgeType;
  tier: BadgeTier;
  currentCount: number;
  earned?: boolean;
}

export function BadgeCard({ badgeType, tier, currentCount, earned = true }: BadgeCardProps) {
  const badge = BADGE_DEFINITIONS[badgeType];
  const IconComponent = BADGE_ICONS[badge.icon] ?? Lightbulb;

  // Locked state: show progress toward bronze
  if (!earned) {
    const bronzeThreshold = badge.thresholds.bronze;
    const progressPercent = Math.min((currentCount / bronzeThreshold) * 100, 100);

    return (
      <div className="rounded-xl card-inner-glow card-lift overflow-hidden border border-muted bg-muted/30 opacity-70 p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconComponent className="h-8 w-8 grayscale" />
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
            {currentCount}/{bronzeThreshold} {METRIC_UNLOCK[badgeType]}
          </p>
        </div>
      </div>
    );
  }

  // Earned state: existing logic
  const tierColor = TIER_COLORS[tier];
  const flairEn = FLAIR_EN[badgeType][tier];

  // Calculate progress to next tier
  const tiers: BadgeTier[] = ['bronze', 'silver', 'gold'];
  const currentTierIndex = tiers.indexOf(tier);
  const nextTier = currentTierIndex < 2 ? tiers[currentTierIndex + 1] : null;
  const nextThreshold = nextTier ? badge.thresholds[nextTier] : badge.thresholds[tier];
  const isMaxed = tier === 'gold';

  // For max tier, show at least the gold threshold instead of 0
  const displayedCount = isMaxed ? badge.thresholds[tier] : currentCount;

  // Progress calculation
  const progressPercent = isMaxed
    ? 100
    : Math.min((currentCount / nextThreshold) * 100, 100);

  const borderByTier = { bronze: 'border border-orange-500/30', silver: 'border border-slate-400/30', gold: 'border border-yellow-500/30' } as const;

  return (
    <div className={cn('rounded-xl card-inner-glow card-lift overflow-hidden p-4 space-y-2 card-badge-glow', borderByTier[tier], tierColor.bg)}>
      <div className="flex items-center gap-3">
        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', TIER_GLOW[tier])}>
          <IconComponent className="h-8 w-8" />
        </div>
        <div>
          <p className="font-semibold">{badge.name}</p>
          <p className={cn('text-[10px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5', TIER_PILL[tier])}>{tier}</p>
        </div>
      </div>

      <p className="text-sm italic text-muted-foreground">{flairEn}</p>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isMaxed
            ? `${displayedCount} ${badge.metric}, Highest tier!`
            : `${currentCount}/${nextThreshold} ${badge.metric}`}
        </p>
      </div>
    </div>
  );
}
