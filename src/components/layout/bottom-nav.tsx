'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, Bell, User, Plus, Settings2 } from 'lucide-react';

import { NotificationBell } from '@/components/notifications/notification-bell';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon?: React.ElementType;
  label?: string;
  isActive: boolean;
  children?: React.ReactNode;
}

function NavItem({ href, icon: Icon, label, isActive, children }: NavItemProps) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 text-xs transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {children || (
        <>
          {Icon && <Icon className="h-5 w-5" />}
          {label && <span>{label}</span>}
        </>
      )}
    </Link>
  );
}

interface BottomNavProps {
  userId?: string;
  initialUnreadCount?: number;
}

export function BottomNav({ userId = '', initialUnreadCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 backdrop-blur-xl bg-card/80 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center px-4">
        {/* Left group: equal flex so FAB stays visually centered */}
        <div className="flex flex-1 justify-around">
          <NavItem href="/feed" icon={Home} label="Home" isActive={pathname === '/feed'} />
          <NavItem href="/notifications" isActive={pathname === '/notifications'}>
            {userId ? (
              <NotificationBell userId={userId} initialUnreadCount={initialUnreadCount} />
            ) : (
              <Bell className="h-5 w-5" />
            )}
            <span>Notifications</span>
          </NavItem>
        </div>
        {/* Center FAB: fixed size, no flex growth */}
        <Link
          href="/report/new"
          prefetch={true}
          className="flex shrink-0 items-center justify-center bg-primary rounded-full w-12 h-12 -mt-4 shadow-lg shadow-primary/25 text-primary-foreground transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Link>
        {/* Right group: same flex as left so spacing is symmetric */}
        <div className="flex flex-1 justify-around">
          <NavItem href="/settings" icon={Settings2} label="Settings" isActive={pathname === '/settings'} />
          <NavItem href="/profile" icon={User} label="Profile" isActive={pathname === '/profile'} />
        </div>
      </div>
    </nav>
  );
}
