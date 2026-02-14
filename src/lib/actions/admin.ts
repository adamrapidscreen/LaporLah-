'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';
import { uuidLike } from '@/lib/validations/ids';

const idSchema = uuidLike;

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
    inProgressResult,
    resolvedResult,
    closedResult,
    flaggedCountResult,
  ] = await Promise.all([
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
    supabase.from('flags').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalReports: totalReportsResult.count ?? 0,
    open: openResult.count ?? 0,
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

// --- Dashboard analytics (non-hidden reports only) ---

export interface DashboardStats {
  totalReports: number;
  openCount: number;
  resolvedCount: number;
  usersCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) throw new Error(authError ?? 'Unauthorized');

  const [
    totalResult,
    openResult,
    resolvedResult,
    usersResult,
  ] = await Promise.all([
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('is_hidden', false),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'open').eq('is_hidden', false),
    supabase.from('reports').select('id', { count: 'exact', head: true }).in('status', ['resolved', 'closed']).eq('is_hidden', false),
    supabase.from('users').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalReports: totalResult.count ?? 0,
    openCount: openResult.count ?? 0,
    resolvedCount: resolvedResult.count ?? 0,
    usersCount: usersResult.count ?? 0,
  };
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) throw new Error(authError ?? 'Unauthorized');

  const { data } = await supabase
    .from('reports')
    .select('category')
    .eq('is_hidden', false);

  const rows = (data ?? []) as { category: string }[];
  const categoryCounts = rows.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return categoryCounts;
}

export async function getStatusBreakdown(): Promise<Record<string, number>> {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) throw new Error(authError ?? 'Unauthorized');

  const { data } = await supabase
    .from('reports')
    .select('status')
    .eq('is_hidden', false);

  const rows = (data ?? []) as { status: string }[];
  const statusCounts = rows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return statusCounts;
}

export interface TopContributor {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_points: number;
  role: string;
  reportCount: number;
}

export async function getTopContributors(): Promise<TopContributor[]> {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) throw new Error(authError ?? 'Unauthorized');

  const { data: topUsers } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, total_points, role')
    .order('total_points', { ascending: false })
    .limit(5);

  const { data: reportRows } = await supabase
    .from('reports')
    .select('user_id')
    .eq('is_hidden', false);

  const reportCountByUser = (reportRows ?? []).reduce((acc, r) => {
    const uid = (r as { user_id: string }).user_id;
    acc[uid] = (acc[uid] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (topUsers ?? []).map((u) => ({
    id: (u as { id: string; full_name: string | null; avatar_url: string | null; total_points: number; role: string }).id,
    full_name: (u as { full_name: string | null }).full_name,
    avatar_url: (u as { avatar_url: string | null }).avatar_url,
    total_points: (u as { total_points: number }).total_points,
    role: (u as { role: string }).role,
    reportCount: reportCountByUser[(u as { id: string }).id] ?? 0,
  }));
}

export interface ActivityItem {
  type: 'report' | 'comment' | 'follow' | 'flag' | 'confirmation';
  icon: string;
  description: string;
  timestamp: string;
}

export async function getActivityFeed(): Promise<ActivityItem[]> {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) throw new Error(authError ?? 'Unauthorized');

  const [
    { data: recentReports },
    { data: recentComments },
    { data: recentFollows },
    { data: recentFlags },
    { data: recentConfirmations },
  ] = await Promise.all([
    supabase.from('reports')
      .select('id, title, status, created_at, creator:users!user_id(full_name)')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('comments')
      .select('id, created_at, user:users(full_name), report:reports(title)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('follows')
      .select('id, created_at, user:users(full_name), report:reports(title)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('flags')
      .select('id, created_at, user:users(full_name), report_id, report:reports(title)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('confirmations')
      .select('id, vote, created_at, user:users(full_name), report:reports(title)')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const items: { timestamp: string; item: ActivityItem }[] = [];

  for (const r of recentReports ?? []) {
    const row = r as { id: string; title: string; created_at: string; creator: { full_name: string | null } | null };
    const name = row.creator?.full_name ?? 'Someone';
    items.push({
      timestamp: row.created_at,
      item: {
        type: 'report',
        icon: '🔵',
        description: `${name} created "${row.title}"`,
        timestamp: row.created_at,
      },
    });
  }

  for (const c of recentComments ?? []) {
    const row = c as { id: string; created_at: string; user: { full_name: string | null } | null; report: { title: string } | null };
    const name = row.user?.full_name ?? 'Someone';
    const title = row.report?.title ?? 'a report';
    items.push({
      timestamp: row.created_at,
      item: {
        type: 'comment',
        icon: '💬',
        description: `${name} commented on "${title}"`,
        timestamp: row.created_at,
      },
    });
  }

  for (const f of recentFollows ?? []) {
    const row = f as { id: string; created_at: string; user: { full_name: string | null } | null; report: { title: string } | null };
    const name = row.user?.full_name ?? 'Someone';
    const title = row.report?.title ?? 'a report';
    items.push({
      timestamp: row.created_at,
      item: {
        type: 'follow',
        icon: '👁',
        description: `${name} followed "${title}"`,
        timestamp: row.created_at,
      },
    });
  }

  for (const fl of recentFlags ?? []) {
    const row = fl as { id: string; created_at: string; user: { full_name: string | null } | null; report_id: string | null; report: { title: string } | null };
    const name = row.user?.full_name ?? 'Someone';
    const title = row.report?.title ?? (row.report_id ? 'a report' : 'an item');
    items.push({
      timestamp: row.created_at,
      item: {
        type: 'flag',
        icon: '🚩',
        description: `${name} flagged "${title}"`,
        timestamp: row.created_at,
      },
    });
  }

  for (const co of recentConfirmations ?? []) {
    const row = co as { id: string; vote: string; created_at: string; user: { full_name: string | null } | null; report: { title: string } | null };
    const name = row.user?.full_name ?? 'Someone';
    const title = row.report?.title ?? 'a report';
    const voteText = row.vote === 'confirmed' ? 'confirmed' : 'not yet';
    items.push({
      timestamp: row.created_at,
      item: {
        type: 'confirmation',
        icon: '🗳️',
        description: `${name} voted ${voteText} on "${title}"`,
        timestamp: row.created_at,
      },
    });
  }

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items.slice(0, 15).map((x) => x.item);
}
