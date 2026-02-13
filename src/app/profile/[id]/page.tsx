import { notFound } from 'next/navigation';

import { BadgeCard } from '@/components/gamification/badge-card';
import { CivicCard } from '@/components/profile/civic-card';
import { BADGE_DEFINITIONS, type BadgeType, type BadgeTier } from '@/lib/constants/badges';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database';

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: user } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', id)
    .single();

  return {
    title: user ? `${(user as { full_name: string }).full_name}'s Profile` : 'Public Profile',
    description: user ? `View ${(user as { full_name: string }).full_name}'s LaporLah profile and contributions.` : 'LaporLah public profile.',
  };
}

interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Parallel fetch all profile data
  const [
    userResult,
    badgesResult,
    spotterCountResult,
    userCommentsResult,
    userReportsResult,
    closerCountResult,
    reportsCountResult,
    commentsCountResult,
  ] = await Promise.all([
    // User profile
    supabase.from('users').select('*').eq('id', id).single(),
    // Badges
    supabase.from('badges').select('type, tier').eq('user_id', id),
    // Spotter count (reports created)
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', id),
    // User comments (for Kampung Hero calculation)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('comments').select('report_id').eq('user_id', id),
    // User reports (for Kampung Hero calculation)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('reports').select('id').eq('user_id', id),
    // Closer count (confirmed resolutions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('confirmations').select('*', { count: 'exact', head: true }).eq('user_id', id).eq('vote', 'confirmed'),
    // Reports count for stats
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', id),
    // Comments count for stats
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', id),
  ]);

  const user = userResult.data;
  if (!user) notFound();

  const typedUser = user as Database['public']['Tables']['users']['Row'];
  const badges = badgesResult.data as { type: BadgeType, tier: BadgeTier }[] | null;
  const spotterCount = spotterCountResult.count;
  const userComments = userCommentsResult.data;
  const userReports = userReportsResult.data;
  const closerCount = closerCountResult.count;
  const reportsCount = reportsCountResult.count;
  const commentsCount = commentsCountResult.count;

  // Calculate Kampung Hero count (comments on others' reports)
  const userReportIds = new Set(userReports?.map((r: { id: string }) => r.id) ?? []);
  const kampungHeroCount = userComments?.filter((c: { report_id: string }) => !userReportIds.has(c.report_id)).length ?? 0;

  const badgeCounts: Record<BadgeType, number> = {
    spotter: spotterCount ?? 0,
    kampung_hero: kampungHeroCount,
    closer: closerCount ?? 0,
  };

  return (
    <div className="space-y-6 p-4 max-w-lg mx-auto pb-24">
      <CivicCard
        user={{
          full_name: typedUser.full_name,
          avatar_url: typedUser.avatar_url,
          created_at: typedUser.created_at,
          total_points: typedUser.total_points,
          current_streak: typedUser.current_streak,
        }}
        stats={{
          points: typedUser.total_points,
          reportsCount: reportsCount ?? 0,
          commentsCount: commentsCount ?? 0,
        }}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Lencana</h2>
        <div className="grid gap-3">
          {(Object.keys(BADGE_DEFINITIONS) as BadgeType[]).map((badgeType) => {
            // Find earned badges for this type and get highest tier
            const earnedBadges = badges?.filter(b => b.type === badgeType) ?? [];
            const tierOrder: BadgeTier[] = ['gold', 'silver', 'bronze'];
            const highestTier = tierOrder.find(t => earnedBadges.some(b => b.tier === t));
            const isEarned = !!highestTier;

            return (
              <BadgeCard
                key={badgeType}
                badgeType={badgeType}
                tier={highestTier ?? 'bronze'}
                currentCount={badgeCounts[badgeType]}
                earned={isEarned}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
