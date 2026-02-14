import { StreakDisplay } from '@/components/gamification/streak-display';
import { StatsGrid } from '@/components/profile/stats-grid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CivicCardProps {
  user: {
    full_name: string;
    avatar_url: string | null;
    created_at: string;
    total_points: number; // Not directly used in CivicCard, but passed to StatsGrid
    current_streak: number;
  };
  stats: {
    points: number;
    reportsCount: number;
    commentsCount: number;
  };
}

export function CivicCard({ user, stats }: CivicCardProps) {
  const initials = user.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl glow-primary bg-gradient-to-br from-card/80 to-background border border-white/10 shadow-xl backdrop-blur-md group">
      <div className="absolute inset-0 card-gradient-overlay pointer-events-none" />
      <div className="relative z-10 p-6 flex flex-col items-center gap-4">
        <span className="absolute top-4 right-4 text-xs text-muted-foreground/70 bg-muted/30 backdrop-blur-sm rounded-full px-3 py-1 border border-border/30">
          Member since {joinDate}
        </span>
        {/* Avatar */}
        <Avatar className="h-20 w-20 ring-4 ring-primary/50 shadow-md shadow-primary/30 avatar-glow">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} className="object-cover" />
          <AvatarFallback className="text-lg font-semibold text-muted-foreground">{initials}</AvatarFallback>
        </Avatar>

        {/* Name */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground drop-shadow-sm">{user.full_name}</h1>
        </div>

        {/* Streak */}
        <StreakDisplay streak={user.current_streak} />

        {/* Stats */}
        <StatsGrid {...stats} />
      </div>
    </div>
  );
}
