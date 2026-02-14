import { cn } from '@/lib/utils';

import { getStatusBreakdown } from '@/lib/actions/admin';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-500',
  acknowledged: 'bg-amber-500',
  in_progress: 'bg-orange-500',
  resolved: 'bg-purple-500',
  closed: 'bg-emerald-500',
};

export async function StatusBreakdown() {
  const statusCounts = await getStatusBreakdown();
  const entries = Object.entries(statusCounts);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold">Status Breakdown</h3>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reports yet</p>
        ) : (
          entries.map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn('h-2.5 w-2.5 rounded-full', STATUS_COLORS[status] ?? 'bg-muted-foreground')}
                />
                <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
              </div>
              <span className="text-sm font-medium font-mono">{count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
