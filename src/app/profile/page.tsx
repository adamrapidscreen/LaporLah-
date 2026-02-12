import { redirect } from 'next/navigation';

import { BadgeCard } from '@/components/gamification/badge-card';
import { ActivityFeed } from '@/components/profile/activity-feed';
import { CivicCard } from '@/components/profile/civic-card';
import { BADGE_DEFINITIONS, type BadgeType, type BadgeTier } from '@/lib/constants/badges';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database';

export const metadata = {
  title: 'Profil Saya',
  description: 'Lihat profil anda, lencana dan aktiviti.',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect('/login');

  // Fetch user profile
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!user) redirect('/login');

  const typedUser = user as Database['public']['Tables']['users']['Row'];

  // Fetch badges
  const { data: badges } = await supabase
    .from('badges')
    .select('type, tier') // Corrected: select 'type' instead of 'badge_type'
    .eq('user_id', authUser.id) as { data: { type: BadgeType, tier: BadgeTier }[] | null };

  // Fetch badge progress counts
  // Spotter: reports created
  const { count: spotterCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', authUser.id);

  // Kampung Hero: comments on others' reports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userComments } = await (supabase as any)
    .from('comments')
    .select('report_id')
    .eq('user_id', authUser.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userReports } = await (supabase as any)
    .from('reports')
    .select('id')
    .eq('user_id', authUser.id);

  const userReportIds = new Set(userReports?.map((r: { id: string }) => r.id) ?? []);
  const kampungHeroCount = userComments?.filter((c: { report_id: string }) => !userReportIds.has(c.report_id)).length ?? 0;

  // Closer: confirmed resolutions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: closerCount } = await (supabase as any)
    .from('confirmations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', authUser.id)
    .eq('vote', 'confirmed');

  const badgeCounts: Record<BadgeType, number> = {
    spotter: spotterCount ?? 0,
    kampung_hero: kampungHeroCount,
    closer: closerCount ?? 0,
  };

  // Fetch stats
  const { count: reportsCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', authUser.id);

  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', authUser.id);

  // Fetch recent activity (last 10 point events)
  const { data: activities } = await supabase
    .from('point_events')
    .select('id, action, points, created_at') // Select specific fields
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })
    .limit(10);

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

      {/* Badges Section */}
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

      {/* Activity Feed */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Aktiviti Terkini</h2>
        <ActivityFeed activities={activities ?? []} />
      </section>
    </div>
  );
}
