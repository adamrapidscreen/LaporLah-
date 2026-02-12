'use client';

import { useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';

import type { RealtimePostgresInsertPayload, RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeOptions {
  table: string;
  filter?: string; // e.g., 'user_id=eq.xxx'
  onInsert?: (payload: RealtimePostgresInsertPayload<Record<string, unknown>>) => void;
}

export function useRealtime({
  table,
  filter,
  onInsert,
}: UseRealtimeOptions) {
  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let mounted = true;

    // Defer subscription to avoid React Strict Mode / HMR cleanup before connection
    const timeoutId = setTimeout(() => {
      if (!mounted) return;

      channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table,
            filter,
          },
          (payload) => {
            onInsert?.(payload);
          }
        )
        .subscribe();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter, onInsert]);
}
