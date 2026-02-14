import { redirect } from 'next/navigation';

import { BadgeCard } from '@/components/gamification/badge-card';
import { ActivityFeed } from '@/components/profile/activity-feed';
import { CivicCard } from '@/components/profile/civic-card';
import { BADGE_DEFINITIONS, type BadgeType, type BadgeTier } from '@/lib/constants/badges';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: 'My Profile',
  description: 'View your profile, badges and activity.',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect('/login');

  // Parallel fetch all profile data after auth check
  const [
    userResult,
    badgesResult,
    spotterCountResult,
    userCommentsResult,
    userReportsResult,
    closerCountResult,
    reportsCountResult,
    commentsCountResult,
    activitiesResult,
  ] = await Promise.all([
    // User profile
    supabase.from('users').select('*').eq('id', authUser.id).single(),
    // Badges
    supabase.from('badges').select('type, tier').eq('user_id', authUser.id),
    // Spotter count (reports created)
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', authUser.id),
    // User comments (for Kampung Hero calculation)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('comments').select('report_id').eq('user_id', authUser.id),
    // User reports (for Kampung Hero calculation)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('reports').select('id').eq('user_id', authUser.id),
    // Closer count (confirmed resolutions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('confirmations').select('*', { count: 'exact', head: true }).eq('user_id', authUser.id).eq('vote', 'confirmed'),
    // Reports count for stats
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', authUser.id),
    // Comments count for stats
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', authUser.id),
    // Recent activity
    supabase.from('point_events').select('id, action, points, created_at').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(10),
  ]);

  const user = userResult.data;
  if (!user) redirect('/login');

  const typedUser = user as Database['public']['Tables']['users']['Row'];
  const badges = badgesResult.data as { type: BadgeType, tier: BadgeTier }[] | null;
  const spotterCount = spotterCountResult.count;
  const userComments = userCommentsResult.data;
  const userReports = userReportsResult.data;
  const closerCount = closerCountResult.count;
  const reportsCount = reportsCountResult.count;
  const commentsCount = commentsCountResult.count;
  const activities = activitiesResult.data;

  // Calculate Kampung Hero count (comments on others' reports)
  const userReportIds = new Set(userReports?.map((r: { id: string }) => r.id) ?? []);
  const kampungHeroCount = userComments?.filter((c: { report_id: string }) => !userReportIds.has(c.report_id)).length ?? 0;

  const badgeCounts: Record<BadgeType, number> = {
    spotter: spotterCount ?? 0,
    kampung_hero: kampungHeroCount,
    closer: closerCount ?? 0,
  };

  const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{ backgroundImage: noiseSvg, backgroundRepeat: 'repeat' }}
      />
      <div className="relative z-10 space-y-6 p-4 max-w-lg mx-auto pb-24">
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
          <div className="flex items-center gap-3 mt-8 mb-4 px-4">
            <h2 className="text-lg font-semibold text-foreground">Badges</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="grid gap-3">
            {(Object.keys(BADGE_DEFINITIONS) as BadgeType[]).map((badgeType) => {
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
          <div className="flex items-center gap-3 mt-8 mb-4 px-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <ActivityFeed activities={activities ?? []} />
        </section>
      </div>
    </div>
  );
}
