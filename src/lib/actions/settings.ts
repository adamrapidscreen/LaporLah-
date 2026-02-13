'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient();

  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // 2. Get and validate name
  const name = formData.get('name') as string;
  if (!name) {
    return { error: 'Nama tidak boleh kosong / Name is required' };
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { error: 'Nama mestilah sekurang-kurangnya 2 aksara / Name must be at least 2 characters' };
  }
  if (trimmedName.length > 50) {
    return { error: 'Nama tidak boleh melebihi 50 aksara / Name cannot exceed 50 characters' };
  }

  // 3. Update user name in database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('users')
    .update({ full_name: trimmedName })
    .eq('id', user.id);

  if (error) {
    return { error: 'Gagal mengemas kini nama / Failed to update name' };
  }

  // 3b. Also update auth user metadata so name persists across logins
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      full_name: trimmedName,
    },
  });

  if (authError) {
    // Log but don't surface to user; DB update already succeeded
    // eslint-disable-next-line no-console
    console.error('[settings] Failed to update auth metadata full_name', authError);
  }

  // 4. Revalidate paths so display name updates everywhere
  revalidatePath('/');
  revalidatePath('/settings');
  revalidatePath('/profile');

  // 5. Return success
  return { success: true };
}
