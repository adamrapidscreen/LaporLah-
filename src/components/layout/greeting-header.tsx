// src/components/layout/greeting-header.tsx
import { getCurrentUser } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';

import { ClientGreeting } from './client-greeting';

interface GreetingHeaderProps {
  displayName?: string | null;
}

export async function GreetingHeader({ displayName: propDisplayName }: GreetingHeaderProps = {}) {
  // If displayName is provided as prop, use it directly (avoids duplicate fetch)
  let displayName = propDisplayName;

  if (displayName === undefined) {
    // Fallback: fetch displayName if not provided
    const { user } = await getCurrentUser();

    if (user?.id) {
      const supabase = await createClient();
      const { data: profiles } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .limit(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profile = profiles?.[0] as any;
      displayName = profile?.full_name ?? user.user_metadata?.full_name ?? null;
    } else {
      displayName = null;
    }
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <ClientGreeting userName={displayName ?? null} />
      <p className="text-sm text-muted-foreground mt-1">Komuniti Pantau, Komuniti Baiki</p>
    </div>
  );
}
