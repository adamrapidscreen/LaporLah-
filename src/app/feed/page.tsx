import { PenSquare } from 'lucide-react';

import { GreetingHeader } from '@/components/layout/greeting-header';
import { PresenceCounter } from '@/components/layout/presence-counter';
import { CommunityPulse } from '@/components/reports/community-pulse';
import { ReportCard } from '@/components/reports/report-card';
import { ReportFeed } from '@/components/reports/report-feed';
import { EmptyState } from '@/components/shared/empty-state';
import { getCommunityStats } from '@/lib/actions/reports';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/types';

export const revalidate = 30; // Revalidate every 30 seconds

interface HomePageProps {
  searchParams: Promise<{ category?: string; status?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, status } = await searchParams;
  const supabase = await createClient();

  // Build reports query
  let reportsQuery = supabase
    .from('reports')
    .select(`
      *,
      creator:users!user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(20);

  // Apply filters
  if (category && category !== 'all') {
    reportsQuery = reportsQuery.eq('category', category);
  }
  if (status && status !== 'all') {
    reportsQuery = reportsQuery.eq('status', status);
  }

  // Parallel fetch: reports, user profile (for greeting), and community stats
  const [reportsResult, userResult, stats] = await Promise.all([
    reportsQuery,
    supabase.auth.getUser(),
    getCommunityStats(),
  ]);

  const reports = reportsResult.data;
  const user = userResult.data?.user;

  // Fetch display name if user is authenticated (separate query to keep parallel benefits)
  let displayName: string | null = null;
  if (user?.id) {
    const { data: profiles } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .limit(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = profiles?.[0] as any;
    displayName = profile?.full_name ?? user.user_metadata?.full_name ?? null;
  }

  return (
    <div className="mx-auto max-w-lg pb-24">
      <GreetingHeader displayName={displayName} />
      <PresenceCounter />
      <CommunityPulse stats={stats} />
      <ReportFeed searchStatus={status} searchCategory={category} />
      {/* Report List */}
      {!reports || reports.length === 0 ? (
        <EmptyState
          icon={<PenSquare className="h-16 w-16" />}
          title="No reports yet"
          subtitle="Be the first to Lapor!"
          action={{ label: "Create Report", href: "/report/new" }}
        />
      ) : (
        <div className="mt-3 space-y-3">
          {(reports as Report[]).map((report, index) => (
            <ReportCard key={report.id} report={report} priority={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
