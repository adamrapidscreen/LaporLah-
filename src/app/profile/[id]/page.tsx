import { notFound } from 'next/navigation';

import { BadgeCard } from '@/components/gamification/badge-card';
import { CivicCard } from '@/components/profile/civic-card';
import { BADGE_DEFINITIONS, type BadgeType, type BadgeTier } from '@/lib/constants/badges';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database';

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

  const { data: user } = await supabase
    .from('users')
    .select('*') // Select all, as 'full_name', 'total_points', 'current_streak' are already in the Row type
    .eq('id', id)
    .single();

  if (!user) notFound();

  const typedUser = user as Database['public']['Tables']['users']['Row'];

  const { data: badges } = await supabase
    .from('badges')
    .select('type, tier') // Corrected: select 'type' instead of 'badge_type'
    .eq('user_id', id) as { data: { type: BadgeType, tier: BadgeTier }[] | null };

  // Fetch badge progress counts
  // Spotter: reports created
  const { count: spotterCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id);

  // Kampung Hero: comments on others' reports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userComments } = await (supabase as any)
    .from('comments')
    .select('report_id')
    .eq('user_id', id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userReports } = await (supabase as any)
    .from('reports')
    .select('id')
    .eq('user_id', id);

  const userReportIds = new Set(userReports?.map((r: { id: string }) => r.id) ?? []);
  const kampungHeroCount = userComments?.filter((c: { report_id: string }) => !userReportIds.has(c.report_id)).length ?? 0;

  // Closer: confirmed resolutions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: closerCount } = await (supabase as any)
    .from('confirmations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id)
    .eq('vote', 'confirmed');

  const badgeCounts: Record<BadgeType, number> = {
    spotter: spotterCount ?? 0,
    kampung_hero: kampungHeroCount,
    closer: closerCount ?? 0,
  };

  const { count: reportsCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id);

  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id);

  return (
    <div className="space-y-6 p-4 max-w-lg mx-auto">
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
