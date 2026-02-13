import { FileText, AlertTriangle, Clock, CheckCircle, XCircle, Flag } from 'lucide-react';

import { StatCard } from '@/components/admin/stat-card';
import { getAdminStats } from '@/lib/actions/admin';

export const revalidate = 30; // Revalidate every 30 seconds

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6 px-4 pb-24">
      <h2 className="text-lg font-semibold">Overview</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Total Reports" value={stats.totalReports} icon={FileText} />
        <StatCard title="Open" value={stats.open} icon={AlertTriangle} />
        <StatCard title="Acknowledged" value={stats.acknowledged} icon={Clock} />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} />
        <StatCard title="Closed" value={stats.closed} icon={XCircle} />
        <StatCard title="Flagged" value={stats.flaggedCount} icon={Flag} />
      </div>
    </div>
  );
}
