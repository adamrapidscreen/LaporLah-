import { ActivityFeed } from '@/components/admin/activity-feed';
import { AdminStats } from '@/components/admin/admin-stats';
import { CategoryChart } from '@/components/admin/category-chart';
import { StatusBreakdown } from '@/components/admin/status-breakdown';
import { TopContributors } from '@/components/admin/top-contributors';

export const revalidate = 30; // Revalidate every 30 seconds

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6 px-4 pt-6 pb-24">
      <h2 className="text-lg font-semibold">Overview</h2>

      <AdminStats />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <CategoryChart />
          <StatusBreakdown />
        </div>
        <div className="space-y-4">
          <TopContributors />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
