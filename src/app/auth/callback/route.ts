import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createServerClient } from '@supabase/ssr';

import type { Database } from '@/lib/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = any;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/feed';

  if (!code) {
    console.error('[auth/callback] missing code in callback URL');
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Create the success redirect response first so we can set session cookies on it
  const successRedirect = NextResponse.redirect(`${origin}${next}`);
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            successRedirect.cookies.set(name, value, options ?? {})
          );
        },
      },
    }
  ) as Supabase;

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  if (!data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

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

  if (upsertError) {
    console.error('[auth/callback] users upsert failed:', upsertError);
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  return successRedirect;
}
