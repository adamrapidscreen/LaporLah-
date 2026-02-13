'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

const idSchema = z.string().uuid();

interface RequireAdminResult {
  error: string | null;
  supabase: Awaited<ReturnType<typeof createClient>> | null;
  user: { id: string } | null;
}

async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated', supabase: null, user: null };

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== 'admin') return { error: 'Not authorized', supabase: null, user: null };

  return { error: null, supabase, user };
}

export async function hideReport(reportId: string) {
  const parsed = idSchema.safeParse(reportId);
  if (!parsed.success) return { error: 'Invalid report ID' };

  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase update() has typing issues
  const { error } = await (supabase as any).from('reports').update({ is_hidden: true }).eq('id', parsed.data);

  if (error) return { error: 'Failed to hide report' };

  revalidatePath('/admin/flagged');
  revalidatePath('/');
  return { error: null };
}

export async function unhideReport(reportId: string) {
  const parsed = idSchema.safeParse(reportId);
  if (!parsed.success) return { error: 'Invalid report ID' };

  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase update() has typing issues
  const { error } = await (supabase as any).from('reports').update({ is_hidden: false }).eq('id', parsed.data);

  if (error) return { error: 'Failed to unhide report' };

  revalidatePath('/admin/flagged');
  revalidatePath('/');
  return { error: null };
}

export async function lockComments(reportId: string) {
  const parsed = idSchema.safeParse(reportId);
  if (!parsed.success) return { error: 'Invalid report ID' };

  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase update() has typing issues
  const { error } = await (supabase as any).from('reports').update({ comments_locked: true }).eq('id', parsed.data);

  if (error) return { error: 'Failed to lock comments' };

  revalidatePath('/admin/flagged');
  revalidatePath('/');
  return { error: null };
}

export async function unlockComments(reportId: string) {
  const parsed = idSchema.safeParse(reportId);
  if (!parsed.success) return { error: 'Invalid report ID' };

  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase update() has typing issues
  const { error } = await (supabase as any).from('reports').update({ comments_locked: false }).eq('id', parsed.data);

  if (error) return { error: 'Failed to unlock comments' };

  revalidatePath('/admin/flagged');
  revalidatePath('/');
  return { error: null };
}

export async function banUser(userId: string) {
  const parsed = idSchema.safeParse(userId);
  if (!parsed.success) return { error: 'Invalid user ID' };

  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase update() has typing issues
  const { error } = await (supabase as any).from('users').update({ is_banned: true }).eq('id', parsed.data);

  if (error) return { error: 'Failed to ban user' };

  revalidatePath('/admin/users');
  revalidatePath('/');
  return { error: null };
}

export async function unbanUser(userId: string) {
  const parsed = idSchema.safeParse(userId);
  if (!parsed.success) return { error: 'Invalid user ID' };

  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase update() has typing issues
  const { error } = await (supabase as any).from('users').update({ is_banned: false }).eq('id', parsed.data);

  if (error) return { error: 'Failed to unban user' };

  revalidatePath('/admin/users');
  revalidatePath('/');
  return { error: null };
}

export interface AdminStats {
  totalReports: number;
  open: number;
  acknowledged: number;
  inProgress: number;
  resolved: number;
  closed: number;
  flaggedCount: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) throw new Error(authError ?? 'Unauthorized');

  // Parallel fetch all stats for better performance
  const [
    totalReportsResult,
    openResult,
    acknowledgedResult,
    inProgressResult,
    resolvedResult,
    closedResult,
    flaggedCountResult,
  ] = await Promise.all([
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'acknowledged'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
    supabase.from('flags').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalReports: totalReportsResult.count ?? 0,
    open: openResult.count ?? 0,
    acknowledged: acknowledgedResult.count ?? 0,
    inProgress: inProgressResult.count ?? 0,
    resolved: resolvedResult.count ?? 0,
    closed: closedResult.count ?? 0,
    flaggedCount: flaggedCountResult.count ?? 0,
  };
}

export interface FlaggedItem {
  id: string;
  type: 'report' | 'comment';
  reportId: string;
  title: string;
  flagCount: number;
  reasons: string[];
  isHidden: boolean;
  commentsLocked: boolean;
  createdAt: string;
}

interface FlagWithReport {
  id: string;
  reason: string;
  created_at: string;
  report_id: string | null;
  report: { id: string; title: string; is_hidden: boolean; comments_locked: boolean } | null;
}

interface FlagWithComment {
  id: string;
  reason: string;
  created_at: string;
  comment_id: string | null;
  comment: { id: string; content: string; report_id: string } | null;
}

export async function getFlaggedItems(): Promise<FlaggedItem[]> {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) throw new Error(authError ?? 'Unauthorized');

  const { data: reportFlagsData } = await supabase
    .from('flags')
    .select(`
      id,
      reason,
      created_at,
      report_id,
      report:reports(id, title, is_hidden, comments_locked)
    `)
    .not('report_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: commentFlagsData } = await supabase
    .from('flags')
    .select(`
      id,
      reason,
      created_at,
      comment_id,
      comment:comments(id, content, report_id)
    `)
    .not('comment_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50);

  const items: FlaggedItem[] = [];

  // Group and process report flags
  const reportFlags = new Map<string, { flags: FlagWithReport[]; report: { title: string; is_hidden: boolean; comments_locked: boolean } }>();
  for (const flag of reportFlagsData ?? []) {
    const f = flag as FlagWithReport;
    if (f.report_id && f.report) {
      const existing = reportFlags.get(f.report_id);
      if (existing) {
        existing.flags.push(f);
      } else {
        reportFlags.set(f.report_id, { flags: [f], report: f.report });
      }
    }
  }

  for (const [reportId, data] of reportFlags) {
    const first = data.flags[0];
    if (first) {
      items.push({
        id: first.id,
        type: 'report',
        reportId,
        title: data.report.title,
        flagCount: data.flags.length,
        reasons: data.flags.map((f) => f.reason),
        isHidden: data.report.is_hidden ?? false,
        commentsLocked: data.report.comments_locked ?? false,
        createdAt: first.created_at,
      });
    }
  }

  // Group and process comment flags
  const commentFlags = new Map<string, { flags: FlagWithComment[]; comment: { content: string; report_id: string } }>();
  for (const flag of commentFlagsData ?? []) {
    const f = flag as FlagWithComment;
    if (f.comment_id && f.comment) {
      const existing = commentFlags.get(f.comment_id);
      if (existing) {
        existing.flags.push(f);
      } else {
        commentFlags.set(f.comment_id, { flags: [f], comment: f.comment });
      }
    }
  }

  for (const [, data] of commentFlags) {
    const first = data.flags[0];
    if (first) {
      const excerpt = data.comment.content.length > 80 ? `${data.comment.content.slice(0, 80)}...` : data.comment.content;
      items.push({
        id: first.id,
        type: 'comment',
        reportId: data.comment.report_id,
        title: excerpt,
        flagCount: data.flags.length,
        reasons: data.flags.map((f) => f.reason),
        isHidden: false,
        commentsLocked: false,
        createdAt: first.created_at,
      });
    }
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
