'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { awardPoints, checkAndAwardBadges, updateStreak } from '@/lib/actions/gamification';
import { STATUS_FLOW, statusConfig, type ReportStatus } from '@/lib/constants/statuses';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '@/lib/types';
import { uuidLike } from '@/lib/validations/ids';

const createReportSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  category: z.enum(['infrastructure', 'cleanliness', 'safety', 'facilities', 'other']),
  photo_url: z.string().url().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  area_name: z.string().optional().nullable(),
});

export async function createReport(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be signed in to create a report.' };
  }

  // Check banned - use any to bypass type issues with generated types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error: profileError } = await (supabase as any)
    .from('users')
    .select('is_banned')
    .eq('id', user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!profileError && profile && (profile as any).is_banned) {
    return { error: 'Your account has been suspended.' };
  }

  // Validate form data
  const parsed = createReportSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    photo_url: formData.get('photo_url') || null,
    latitude: formData.get('latitude') || null,
    longitude: formData.get('longitude') || null,
    area_name: formData.get('area_name') || null,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Validation failed' };
  }

  // Insert report - use any to bypass type issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: report, error: insertError } = await (supabase as any)
    .from('reports')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      photo_url: parsed.data.photo_url ?? null,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
      area_name: parsed.data.area_name ?? null,
    })
    .select('id')
    .single();

  if (insertError || !report) {
    console.error('Insert error:', insertError);
    return { error: 'Failed to create report. Please try again.' };
  }

  // Auto-follow creator on their own report
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('follows').insert({
    user_id: user.id,
    report_id: report.id,
  });

  // Gamification actions
  console.log('[Report Create] Awarding points to user:', user.id);
  await awardPoints(user.id, 'create_report', report.id);
  await updateStreak(user.id);

  console.log('[Report Create] Checking for badges...');
  const badgeResult = await checkAndAwardBadges(user.id);
  const { badges: newBadges } = badgeResult;

  if ('error' in badgeResult) {
    console.error('[Report Create] Badge check failed:', badgeResult.error);
  } else {
    console.log('[Report Create] Badge check result:', JSON.stringify(newBadges, null, 2));
  }

  revalidatePath('/');
  revalidatePath('/profile');
  // Redirect happens client-side after toast, so return reportId
  return { newBadges, reportId: report.id };
}

const updateStatusSchema = z.object({
  reportId: uuidLike,
  newStatus: z.enum(['in_progress', 'resolved', 'closed']),
});

export async function updateReportStatus(reportId: string, newStatus: ReportStatus) {
  const parsed = updateStatusSchema.safeParse({ reportId, newStatus });
  if (!parsed.success) return { error: 'Invalid input' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Check if user is banned and get role for admin status updates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('is_banned, role')
    .eq('id', user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (profile && (profile as any).is_banned) {
    return { error: 'Your account has been suspended.' };
  }

  // Fetch report to check authorization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: report } = await (supabase as any)
    .from('reports')
    .select('user_id, status')
    .eq('id', reportId)
    .single();

  if (!report) return { error: 'Report not found' };

  const currentIndex = STATUS_FLOW.indexOf(report.status as ReportStatus);
  const newIndex = STATUS_FLOW.indexOf(newStatus);

  // Authorization: creator/admin for forward, any auth for resolved
  const isCreatorOrAdmin = report.user_id === user.id || (profile as { role?: string } | null)?.role === 'admin';
  if (newStatus !== 'resolved' && !isCreatorOrAdmin) {
    return { error: 'Not authorized' };
  }
  if (newIndex <= currentIndex) {
    return { error: 'Invalid status transition' };
  }

  // Build update payload
  const updatePayload: Record<string, unknown> = { status: newStatus };
  if (newStatus === 'resolved') {
    updatePayload.resolved_at = new Date().toISOString();
    updatePayload.resolved_by = user.id; // Track who proposed resolution
  }

  // Update status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('reports')
    .update(updatePayload)
    .eq('id', reportId);

  if (error) return { error: 'Failed to update status' };

  // Side effect: Notify followers (best-effort; don't fail the action)
  const statusLabel = statusConfig[newStatus].labelMs;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).rpc('notify_followers', {
      p_report_id: reportId,
      p_type: 'status_change',
      p_message: `Status dikemaskini kepada ${statusLabel}`,
      p_exclude_user: user.id,
    });
    if (error) console.error('Failed to notify followers:', error);
  } catch (err) {
    console.error('Failed to notify followers:', err);
  }

  // Side effect: When status becomes 'resolved', notify with confirmation request
  if (newStatus === 'resolved') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).rpc('notify_followers', {
        p_report_id: reportId,
        p_type: 'confirmation_request',
        p_message: 'Adakah isu ini telah diselesaikan? Sahkan sekarang.',
        p_exclude_user: user.id,
      });
      if (error) console.error('Failed to send confirmation request:', error);
    } catch (err) {
      console.error('Failed to send confirmation request:', err);
    }
  }

  revalidatePath(`/report/${reportId}`);
  return { success: true };
}

export async function getCommunityStats() {
  const supabase = await createClient();

  // Parallelize all count queries for better performance
  const [openResult, inProgressResult, closedResult, resolvedResult] = await Promise.all([
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open").eq("is_hidden", false),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "in_progress").eq("is_hidden", false),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "closed").eq("is_hidden", false),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "resolved").eq("is_hidden", false),
  ]);

  return {
    open: openResult.count || 0,
    in_progress: inProgressResult.count || 0,
    closed: closedResult.count || 0,
    resolved: resolvedResult.count || 0,
  };
}
