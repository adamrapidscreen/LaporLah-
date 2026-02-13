import { redirect } from 'next/navigation';

import { Eye } from 'lucide-react';

import { ReportCard } from '@/components/reports/report-card';
import { EmptyState } from '@/components/shared/empty-state';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/types';

export const revalidate = 30; // Revalidate every 30 seconds

export default async function FollowedReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch reports user follows, ordered by newest follow first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: follows } = await (supabase as any)
    .from('follows')
    .select('report:reports(*, creator:users!user_id(id, full_name, avatar_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const reports = follows
    ?.map((f: { report: unknown }) => f.report)
    .filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-2xl p-4 pb-24">
      <h1 className="mb-4 text-xl font-bold">
        My Followed Reports
      </h1>

      {reports.length === 0 ? (
        <EmptyState
          icon={<Eye className="h-16 w-16" />}
          title="No followed reports"
          subtitle="Follow reports to track progress"
          action={{ label: "Browse Reports", href: "/" }}
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report: unknown, index: number) => (
            <ReportCard key={(report as Report).id} report={report as Report} priority={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
