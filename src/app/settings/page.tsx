import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Calendar, ShieldCheck } from 'lucide-react';

import { DisplayNameEditor } from '@/components/settings/display-name-editor';
import { SignOutButton } from '@/components/settings/sign-out-button';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { UpdateChecker } from '@/components/settings/update-checker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database';

export const revalidate = 0; // Always fresh — user-specific settings

export const metadata = {
  title: 'Settings · LaporLah',
  description: 'Manage your account and app settings',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect('/login');

  // Fetch user data from users table
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!user) redirect('/login');

  const typedUser = user as Database['public']['Tables']['users']['Row'];

  // Format join date
  const joinDate = new Date(typedUser.created_at).toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-12 pb-24">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Account Section */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Account</h2>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={typedUser.avatar_url ?? undefined} />
            <AvatarFallback className="text-xl">
              {typedUser.full_name?.[0]?.toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{typedUser.full_name}</h3>
            <p className="text-sm text-muted-foreground">{typedUser.email}</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Display Name Editor */}
      <section className="space-y-3">
        <DisplayNameEditor initialName={typedUser.full_name} />
      </section>

      {/* Appearance Section */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Appearance</h2>
        <div className="rounded-lg border border-border bg-card p-4">
          <ThemeSelector />
        </div>
      </section>

      {/* PWA Updates */}
      <section className="space-y-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <UpdateChecker />
        </div>
      </section>

      {/* Admin (admin users only) */}
      {typedUser.role === 'admin' && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Admin</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <Button asChild variant="secondary" className="w-full min-h-[44px] gap-2">
              <Link href="/admin">
                <ShieldCheck className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Sign Out */}
      <section className="pt-4">
        <SignOutButton />
      </section>

      {/* Footer */}
      <footer className="pt-4 text-center text-xs text-muted-foreground">
        v1.0.0 · LaporLah
      </footer>
    </div>
  );
}
