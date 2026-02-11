'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

import { BottomNav } from './bottom-nav';
import { TopNav } from './top-nav';

const HIDE_NAV_ROUTES = ['/login'];

export function NavWrapper() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | undefined>();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        // Fetch unread count
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count } = await (supabase as any)
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
        setUnreadCount(count ?? 0);
      }
    };

    fetchUserData();
  }, []);

  // Hide navigation on certain routes (e.g., login page)
  if (HIDE_NAV_ROUTES.includes(pathname)) {
    return null;
  }

  return (
    <>
      {/* Desktop: Top Nav */}
      <div className="hidden md:block">
        <TopNav userId={userId} initialUnreadCount={unreadCount} />
      </div>

      {/* Mobile: Bottom Nav */}
      <div className="md:hidden">
        <BottomNav userId={userId} initialUnreadCount={unreadCount} />
      </div>
    </>
  );
}
