import { ReportCard } from '@/components/reports/report-card';
import { ReportFeed } from '@/components/reports/report-feed';
import { GreetingHeader } from '@/components/layout/greeting-header';
import { CommunityPulse } from '@/components/reports/community-pulse';
import { EmptyState } from '@/components/shared/empty-state';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/types';

interface HomePageProps {
  searchParams: Promise<{ category?: string; status?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
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
    query = query.eq('category', category);
  }
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: reports } = await query;

  return (
    <div className="mx-auto max-w-lg pb-24">
      <GreetingHeader />
      <CommunityPulse />
      <ReportFeed searchStatus={status} searchCategory={category} />
      {/* Report List */}
      {!reports || reports.length === 0 ? (
        <EmptyState
          emoji="📝"
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
