import { getActivityFeed } from '@/lib/actions/admin';

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export async function ActivityFeed() {
  const activities = await getActivityFeed();

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recent Activity</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
      <div className="max-h-[400px] space-y-1 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No recent activity</p>
        ) : (
          activities.map((activity, i) => (
            <div
              key={`${activity.type}-${activity.timestamp}-${i}`}
              className="flex items-start gap-3 rounded-lg px-3 py-2 transition hover:bg-muted/50"
            >
              <span className="mt-0.5 text-base">{activity.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
