'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { z } from 'zod';

import { STATUS_FLOW, statusConfig, type ReportStatus } from '@/lib/constants/statuses';
import { createClient } from '@/lib/supabase/server';

const createReportSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  category: z.enum(['infrastructure', 'cleanliness', 'safety', 'facilities', 'other']),
  photo_url: z.string().url().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  area_name: z.string().optional().nullable(),
});

interface ActionState {
  error: string | null;
}

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
  const { data: profile, error: profileError } = await supabase
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
    return { error: 'Failed to create report. Please try again.' };
  }

  // Auto-follow creator on their own report
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('follows').insert({
    user_id: user.id,
    report_id: report.id,
  });

  // Award points (10 pts for creating a report)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('award_points', {
    p_user_id: user.id,
    p_action: 'create_report',
    p_points: 10,
    p_report_id: report.id,
  });

  // Update streak
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('update_streak', { p_user_id: user.id });

  // Check for badge eligibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('check_and_award_badges', { p_user_id: user.id });

  revalidatePath('/');
  redirect(`/report/${report.id}`);
}

const updateStatusSchema = z.object({
  reportId: z.string().uuid(),
  newStatus: z.enum(['acknowledged', 'in_progress', 'resolved', 'closed']),
});

export async function updateReportStatus(reportId: string, newStatus: ReportStatus) {
  const parsed = updateStatusSchema.safeParse({ reportId, newStatus });
  if (!parsed.success) return { error: 'Invalid input' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Check if user is banned
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('is_banned')
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
  const isCreatorOrAdmin = report.user_id === user.id; // TODO: add admin check
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

  // Side effect: Notify followers
  const statusLabel = statusConfig[newStatus].labelMs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('notify_followers', {
    p_report_id: reportId,
    p_type: 'status_change',
    p_message: `Status dikemaskini kepada ${statusLabel}`,
    p_exclude_user: user.id,
  }).catch((err: unknown) => {
    // Log but don't fail the action
    console.error('Failed to notify followers:', err);
  });

  // Side effect: When status becomes 'resolved', notify with confirmation request
  if (newStatus === 'resolved') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('notify_followers', {
      p_report_id: reportId,
      p_type: 'confirmation_request',
      p_message: 'Adakah isu ini telah diselesaikan? Sahkan sekarang.',
      p_exclude_user: user.id,
    }).catch((err: unknown) => {
      // Log but don't fail the action
      console.error('Failed to send confirmation request:', err);
    });
  }

  revalidatePath(`/report/${reportId}`);
  return { success: true };
}
