export const BADGE_DEFINITIONS = {
  spotter: {
    name: 'Spotter',
    emoji: '🔦',
    description: 'Pelapor aktif komuniti',
    flair: {
      bronze: 'Pemerhati Baru',
      silver: 'Pemerhati Berpengalaman',
      gold: 'Pemerhati Utama',
    },
    thresholds: {
      bronze: 1,
      silver: 3,
      gold: 8,
    },
    metric: 'reports created',
  },
  kampung_hero: {
    name: 'Kampung Hero',
    emoji: '🤝',
    description: 'Pembantu komuniti',
    flair: {
      bronze: 'Jiran Prihatin',
      silver: 'Wira Kampung',
      gold: 'Legenda Kampung',
    },
    thresholds: {
      bronze: 3,
      silver: 10,
      gold: 25,
    },
    metric: 'comments on others\' reports',
  },
  closer: {
    name: 'Closer',
    emoji: '✅',
    description: 'Penyelesai isu',
    flair: {
      bronze: 'Penyelesai Baru',
      silver: 'Penyelesai Handal',
      gold: 'Penyelesai Utama',
    },
    thresholds: {
      bronze: 1,
      silver: 3,
      gold: 10,
    },
    metric: 'confirmed resolutions',
  },
} as const;

export type BadgeType = keyof typeof BADGE_DEFINITIONS;
export type BadgeTier = 'bronze' | 'silver' | 'gold';

export const TIER_COLORS = {
  bronze: { border: 'border-amber-700', bg: 'bg-amber-700/10', text: 'text-amber-700' },
  silver: { border: 'border-slate-400', bg: 'bg-slate-400/10', text: 'text-slate-400' },
  gold: { border: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
} as const;
