'use client';

import { useState, useCallback } from 'react';

import Link from 'next/link';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRealtime } from '@/lib/hooks/use-realtime';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  userId: string;
  initialUnreadCount: number;
}

export function NotificationBell({ userId, initialUnreadCount }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [shake, setShake] = useState(false);

  const handleInsert = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  useRealtime({
    table: 'notifications',
    filter: `user_id=eq.${userId}`,
    onInsert: handleInsert,
  });

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/notifications">
        <Bell
          className={cn(
            'h-5 w-5',
            shake && 'animate-shake'
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
