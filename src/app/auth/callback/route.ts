import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = any;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/feed';

  if (code) {
    const supabase = (await createClient()) as Supabase;
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user already exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', data.user.id)
        .maybeSingle();

      // Preserve existing display name, only use metadata for new users or if name is empty
      const fullName = existingUser?.full_name
        ? existingUser.full_name
        : (data.user.user_metadata.full_name ?? data.user.email!);

      // Upsert user in public.users table
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            avatar_url: data.user.user_metadata.avatar_url ?? null,
          },
          { onConflict: 'id' }
        );

      if (!upsertError) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('[auth/callback] users upsert failed:', upsertError);
    } else if (error) {
      console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
    }
  } else {
    console.error('[auth/callback] missing code in callback URL');
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
