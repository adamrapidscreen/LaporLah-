import { getCategoryCounts } from '@/lib/actions/admin';

export async function CategoryChart() {
  const categoryCounts = await getCategoryCounts();
  const entries = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);
  const maxCount = entries.length ? Math.max(...entries.map(([, c]) => c)) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold">Reports by Category</h3>
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reports yet</p>
        ) : (
          entries.map(([category, count]) => (
            <div key={category} className="flex items-center gap-3">
              <span className="w-28 text-right text-xs capitalize text-muted-foreground">
                {category.replace(/_/g, ' ')}
              </span>
              <div className="flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-6 rounded-full bg-primary transition-all duration-500"
                  style={{ width: maxCount ? `${(count / maxCount) * 100}%` : '0%' }}
                />
              </div>
              <span className="w-6 text-xs font-medium font-mono">{count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
