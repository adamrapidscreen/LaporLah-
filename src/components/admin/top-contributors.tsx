import { getTopContributors } from '@/lib/actions/admin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MEDALS = ['🥇', '🥈', '🥉'] as const;

export async function TopContributors() {
  const contributors = await getTopContributors();

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold">Top Contributors</h3>
      <div className="space-y-3">
        {contributors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users yet</p>
        ) : (
          contributors.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-3"
            >
              <span className="w-6 text-base">
                {index < 3 ? MEDALS[index] : index + 1}
              </span>
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={user.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">
                  {user.full_name?.[0]?.toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium truncate">{user.full_name ?? 'Anonymous'}</span>
                <span className="ml-2 text-xs font-mono text-muted-foreground">{user.total_points} pts</span>
                {user.role === 'admin' && (
                  <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    Admin
                  </span>
                )}
                <span className="ml-2 text-xs text-muted-foreground">{user.reportCount} reports</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
