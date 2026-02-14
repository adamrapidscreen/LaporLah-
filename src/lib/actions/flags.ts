'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';
import { flagSchema } from '@/lib/validations/flags';
import { uuidLike } from '@/lib/validations/ids';

const uuidSchema = uuidLike;

export async function flagReport(reportId: string, reason: string) {
  const reasonParsed = flagSchema.safeParse({ reason });
  if (!reasonParsed.success) return { error: reasonParsed.error.issues[0].message };

  const idParsed = uuidSchema.safeParse(reportId);
  if (!idParsed.success) return { error: 'Invalid report ID' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase insert() has typing issues
  const { error } = await (supabase as any)
    .from('flags')
    .insert({ report_id: idParsed.data, user_id: user.id, reason: reasonParsed.data.reason });

  if (error) return { error: 'Failed to submit flag' };

  revalidatePath('/admin/flagged');
  return { error: null };
}

export async function flagComment(commentId: string, reason: string) {
  const reasonParsed = flagSchema.safeParse({ reason });
  if (!reasonParsed.success) return { error: reasonParsed.error.issues[0].message };

  const idParsed = uuidSchema.safeParse(commentId);
  if (!idParsed.success) return { error: 'Invalid comment ID' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase insert() has typing issues
  const { error } = await (supabase as any)
    .from('flags')
    .insert({ comment_id: idParsed.data, user_id: user.id, reason: reasonParsed.data.reason });

  if (error) return { error: 'Failed to submit flag' };

  revalidatePath('/admin/flagged');
  return { error: null };
}
