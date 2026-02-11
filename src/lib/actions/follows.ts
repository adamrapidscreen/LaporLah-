'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function toggleFollow(reportId: string) {
  const supabase = await createClient();

  // 1. Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // 2. Check if already following
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingFollow } = await (supabase as any)
    .from('follows')
    .select('id')
    .eq('report_id', reportId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingFollow) {
    // 3a. Already following → unfollow (DELETE)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('follows')
      .delete()
      .eq('id', existingFollow.id);

    if (error) return { error: 'Failed to unfollow' };

    revalidatePath(`/report/${reportId}`);
    return { followed: false };
  } else {
    // 3b. Not following → follow (INSERT)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('follows')
      .insert({
        report_id: reportId,
        user_id: user.id,
      });

    if (error) return { error: 'Failed to follow' };

    // 4. Award points to report creator for gaining a new follower
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: report } = await (supabase as any)
      .from('reports')
      .select('user_id')
      .eq('id', reportId)
      .single();

    if (report && report.user_id !== user.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).rpc('award_points', {
        p_user_id: report.user_id,
        p_action: 'report_followed',
        p_points: 3,
        p_report_id: reportId,
      });
    }

    revalidatePath(`/report/${reportId}`);
    return { followed: true };
  }
}
