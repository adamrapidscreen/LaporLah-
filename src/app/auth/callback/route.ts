import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Upsert user in public.users table
      const { error: upsertError } = await supabase.from("users").upsert(
        {
          id: data.user.id,
          google_id: data.user.user_metadata.provider_id,
          email: data.user.email!,
          name: data.user.user_metadata.full_name ?? data.user.email!,
          avatar_url: data.user.user_metadata.avatar_url,
        },
        { onConflict: "id" }
      );

      if (!upsertError) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
