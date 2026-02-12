import { StreakDisplay } from '@/components/gamification/streak-display';
import { StatsGrid } from '@/components/profile/stats-grid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming these are shadcn/ui components
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

  const joinDate = new Date(user.created_at).toLocaleDateString('ms-MY', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="p-6 flex flex-col items-center gap-4">
        {/* Avatar */}
        <Avatar className="h-16 w-16 ring-2 ring-primary/30">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} className="object-cover" />
          <AvatarFallback className="text-lg font-semibold text-muted-foreground">{initials}</AvatarFallback>
        </Avatar>

        {/* Name + join date */}
        <div className="text-center">
          <h1 className="text-xl font-bold">{user.full_name}</h1>
          <p className="text-sm text-muted-foreground">Ahli sejak {joinDate}</p>
        </div>

        {/* Streak */}
        <StreakDisplay streak={user.current_streak} />

        {/* Stats */}
        <StatsGrid {...stats} />
      </div>
    </Card>
  );
}
