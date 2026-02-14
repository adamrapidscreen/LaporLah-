import { getDashboardStats } from '@/lib/actions/admin';

export async function AdminStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-3xl font-bold font-mono text-foreground">{stats.totalReports}</div>
        <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Total Reports</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-3xl font-bold font-mono text-blue-500">{stats.openCount}</div>
        <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Open Now</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-3xl font-bold font-mono text-emerald-500">{stats.resolvedCount}</div>
        <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Resolved</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-3xl font-bold font-mono text-purple-500">{stats.usersCount}</div>
        <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Citizens</div>
      </div>
    </div>
  );
}
