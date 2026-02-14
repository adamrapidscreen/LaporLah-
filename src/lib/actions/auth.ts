'use server';

import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { user };
}

/** Syncs the current auth user to public.users after email sign-in (OAuth uses auth/callback). */
export async function syncUserAfterSignIn(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'Not authenticated' };

  const { data: existingUser } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle();

  const fullName =
    existingUser?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? user.email;

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('[syncUserAfterSignIn] users upsert failed:', error);
    return { error: 'Failed to sync profile' };
  }
  return { error: null };
}
