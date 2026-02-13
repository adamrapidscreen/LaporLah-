'use client';

import { useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export function PresenceCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel('community:online', {
      config: { presence: { key: crypto.randomUUID() } },
    });

    const updateCount = () => {
      const state = channel.presenceState();
      setCount(Object.keys(state).length);
    };

    channel
      .on('presence', { event: 'sync' }, updateCount)
      .on('presence', { event: 'join' }, updateCount)
      .on('presence', { event: 'leave' }, updateCount)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (count <= 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 mt-1 mb-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-xs text-muted-foreground">
        {count} active {count === 1 ? 'citizen' : 'citizens'} right now
      </span>
    </div>
  );
}
