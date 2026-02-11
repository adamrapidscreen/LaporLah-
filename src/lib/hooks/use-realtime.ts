'use client';

import { useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';

import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

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

    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, onInsert]);
}
