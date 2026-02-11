'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

const castVoteSchema = z.object({
  reportId: z.string().uuid(),
  vote: z.enum(['confirmed', 'not_yet']),
});

interface CastVoteResult {
  success?: true;
  error?: string;
}

export async function castVote(
  reportId: string,
  vote: 'confirmed' | 'not_yet'
): Promise<CastVoteResult> {
  const parsed = castVoteSchema.safeParse({ reportId, vote });
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Check if user is banned
  const { data: profile } = await supabase
    .from('users')
    .select('is_banned')
    .eq('id', user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (profile && (profile as any).is_banned) {
    return { error: 'Your account has been suspended' };
  }

  // Verify report exists and is in 'resolved' status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: report } = await (supabase as any)
    .from('reports')
    .select('id, status, user_id')
    .eq('id', reportId)
    .single();

  if (!report) {
    return { error: 'Report not found' };
  }
  if (report.status !== 'resolved') {
    return { error: 'Report is not in resolved status' };
  }

  // Insert vote (UNIQUE constraint prevents duplicates)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertError } = await (supabase as any)
    .from('confirmations')
    .insert({
      report_id: reportId,
      user_id: user.id,
      vote,
    });

  if (insertError) {
    if (insertError.code === '23505') {
      return { error: 'You have already voted' };
    }
    return { error: 'Failed to cast vote' };
  }

  // Award points for voting
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('award_points', {
    p_user_id: user.id,
    p_action: 'confirmation_vote',
    p_points: 8,
    p_report_id: reportId,
  });

  // Check resolution thresholds
  await checkResolution(reportId);

  revalidatePath(`/report/${reportId}`);
  return { success: true };
}

export async function checkResolution(reportId: string): Promise<void> {
  const supabase = await createClient();

  // Fetch report details — use user_id (creator) and resolved_by (resolver)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: report } = await (supabase as any)
    .from('reports')
    .select('id, status, resolved_at, user_id, resolved_by')
    .eq('id', reportId)
    .single();

  if (!report || report.status !== 'resolved') {
    return;
  }

  // Fetch all votes for this report
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: votes } = await (supabase as any)
    .from('confirmations')
    .select('vote')
    .eq('report_id', reportId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const confirmed = votes?.filter((v: any) => v.vote === 'confirmed').length ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notYet = votes?.filter((v: any) => v.vote === 'not_yet').length ?? 0;

  const resolvedAt = new Date(report.resolved_at);
  const now = new Date();
  const hoursElapsed = (now.getTime() - resolvedAt.getTime()) / (1000 * 60 * 60);
  const isExpired = hoursElapsed >= 72;

  // Scenario 1: ≥3 confirmed votes → close
  if (confirmed >= 3) {
    await closeReport(supabase, report);
    return;
  }

  // Scenario 2: Majority not_yet → revert
  if (notYet > confirmed && notYet > 0) {
    await revertReport(supabase, report);
    return;
  }

  // Scenario 3: Timeout checks
  if (isExpired) {
    if (confirmed >= 1 && notYet === 0) {
      // Auto-close: at least 1 confirmed, no objections
      await closeReport(supabase, report);
    } else if (confirmed === 0 && notYet === 0) {
      // No votes at all → revert
      await revertReport(supabase, report);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function closeReport(supabase: any, report: any): Promise<void> {
  await supabase
    .from('reports')
    .update({ status: 'closed', updated_at: new Date().toISOString() })
    .eq('id', report.id);

  // Award 25 pts to report creator (user_id)
  await supabase.rpc('award_points', {
    p_user_id: report.user_id,
    p_action: 'report_closed',
    p_points: 25,
    p_report_id: report.id,
  });

  // Award 15 pts to resolver (resolved_by — set in E4-S4 when status was proposed as resolved)
  if (report.resolved_by && report.resolved_by !== report.user_id) {
    await supabase.rpc('award_points', {
      p_user_id: report.resolved_by,
      p_action: 'resolution_confirmed',
      p_points: 15,
      p_report_id: report.id,
    });

    await supabase.rpc('check_and_award_badges', { p_user_id: report.resolved_by });
  }

  await supabase.rpc('check_and_award_badges', { p_user_id: report.user_id });

  // Notify followers
  await supabase.rpc('notify_followers', {
    p_report_id: report.id,
    p_type: 'status_change',
    p_message: 'Laporan telah ditutup selepas pengesahan komuniti',
    p_exclude_user: null,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function revertReport(supabase: any, report: any): Promise<void> {
  await supabase
    .from('reports')
    .update({
      status: 'in_progress',
      resolved_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', report.id);

  // Notify followers of revert
  await supabase.rpc('notify_followers', {
    p_report_id: report.id,
    p_type: 'status_change',
    p_message: 'Laporan dikembalikan ke "Dalam Proses" — komuniti belum berpuas hati',
    p_exclude_user: null,
  });
}
