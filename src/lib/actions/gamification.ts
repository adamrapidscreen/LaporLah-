'use server';

import type { BadgeType, BadgeTier } from '@/lib/constants/badges';
import { POINTS_PER_ACTION, type PointAction } from '@/lib/constants/points';
import { createClient } from '@/lib/supabase/server';

interface NewBadge {
  new_badge_type: BadgeType;
  new_tier: BadgeTier;
}

export async function awardPoints(
  userId: string,
  action: PointAction,
  reportId?: string
) {
  const supabase = await createClient();
  const points = POINTS_PER_ACTION[action];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc('award_points', {
    p_user_id: userId,
    p_action: action,
    p_points: points,
    p_report_id: reportId ?? null,
  });

  if (error) {
    console.error('Failed to award points:', error);
    return { error: 'Failed to award points' };
  }

  return { success: true, points };
}

export async function checkAndAwardBadges(userId: string): Promise<{ badges: NewBadge[] } | { error: string, badges: [] }> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: newBadges, error } = await (supabase as any).rpc('check_and_award_badges', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Failed to check badges:', error);
    return { error: 'Failed to check badges', badges: [] };
  }

  // The RPC function returns an array of objects with new_badge_type and new_tier
  return { badges: (newBadges as NewBadge[] | null) ?? [] };
}

export async function updateStreak(userId: string) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc('update_streak', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Failed to update streak:', error);
    return { error: 'Failed to update streak' };
  }

  return { success: true };
}
