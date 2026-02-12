// src/components/layout/greeting-header.tsx
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/actions/auth';
import { ClientGreeting } from './client-greeting';

export async function GreetingHeader() {
  const { user } = await getCurrentUser();

  return (
    <div className="px-4 pt-6 pb-4">
      <ClientGreeting userName={user?.user_metadata.full_name || null} />
      <p className="text-sm text-muted-foreground mt-1">Komuniti Pantau, Komuniti Baiki</p>
    </div>
  );
}
