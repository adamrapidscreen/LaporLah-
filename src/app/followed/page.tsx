import { redirect } from 'next/navigation';

import { ReportCard } from '@/components/reports/report-card';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/types';


export default async function FollowedReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch reports the user follows, ordered by newest follow first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: follows } = await (supabase as any)
    .from('follows')
    .select('report:reports(*, creator:users!user_id(id, full_name, avatar_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const reports = follows
    ?.map((f: { report: unknown }) => f.report)
    .filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-xl font-bold">
        Laporan Diikuti / My Followed Reports
      </h1>

      {reports.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Anda belum mengikuti sebarang laporan.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            You haven&apos;t followed any reports yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report: unknown) => (
            <ReportCard key={(report as Report).id} report={report as Report} />
          ))}
        </div>
      )}
    </div>
  );
}
