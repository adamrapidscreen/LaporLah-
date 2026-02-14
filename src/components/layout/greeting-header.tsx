// src/components/layout/greeting-header.tsx
import { Sparkles } from 'lucide-react';

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
      <div className="relative overflow-hidden rounded-2xl card-inner-glow card-lift border border-border/60 bg-gradient-to-r from-primary/15 via-primary/5 to-background/80">
        <div className="absolute inset-0 card-gradient-overlay pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <div>
            <ClientGreeting userName={displayName ?? null} />
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Komuniti Pantau, Komuniti Baiki
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] sm:text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Built for Malaysian communities</span>
          </div>
        </div>
      </div>
    </div>
  );
}
