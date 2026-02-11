'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

const addCommentSchema = z.object({
  reportId: z.string().uuid(),
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long'),
});

export async function addComment(reportId: string, content: string) {
  // 1. Validate input
  const parsed = addCommentSchema.safeParse({ reportId, content });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Validation failed' };
  }

  const supabase = await createClient();

  // 2. Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // 3. Check if user is banned
  const { data: profile } = await supabase
    .from('users')
    .select('is_banned')
    .eq('id', user.id)
    .single();

  const profileRow = profile as { is_banned?: boolean } | null;
  if (profileRow?.is_banned) {
    return { error: 'Your account is suspended' };
  }

  // 4. Check if comments are locked on this report
  const { data: report } = await supabase
    .from('reports')
    .select('comments_locked')
    .eq('id', reportId)
    .single();

  if (!report) return { error: 'Report not found' };
  const reportRow = report as { comments_locked?: boolean };
  if (reportRow.comments_locked) return { error: 'Comments are locked on this report' };

  // 5. Insert comment (Supabase generated types don't match client for comments table)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertError } = await (supabase as any)
    .from('comments')
    .insert({
      report_id: reportId,
      user_id: user.id,
      content: parsed.data.content,
    });

  if (insertError) return { error: 'Failed to add comment' };

  // 6-9: Side effects (non-blocking; DB may not have these RPCs yet)
  const db = supabase as unknown as {
    rpc: (fn: string, params: Record<string, unknown>) => Promise<unknown>;
  };
  await db.rpc('award_points', {
    p_user_id: user.id,
    p_action: 'comment',
    p_points: 5,
    p_report_id: reportId,
  });
  await db.rpc('update_streak', { p_user_id: user.id });
  await db.rpc('check_and_award_badges', { p_user_id: user.id });
  await db.rpc('notify_followers', {
    p_report_id: reportId,
    p_type: 'new_comment',
    p_message: 'Komen baru pada laporan / New comment on report',
    p_exclude_user: user.id,
  });

  // 10. Revalidate report page
  revalidatePath(`/report/${reportId}`);

  return { success: true };
}
