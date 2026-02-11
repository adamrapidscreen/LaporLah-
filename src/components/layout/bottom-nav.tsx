'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, Bell, User, Plus } from 'lucide-react';

import { NotificationBell } from '@/components/notifications/notification-bell';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 text-xs transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

interface BottomNavProps {
  userId?: string;
  initialUnreadCount?: number;
}

export function BottomNav({ userId, initialUnreadCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 backdrop-blur-xl bg-card/80 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around px-4">
        <NavItem href="/" icon={Home} label="Home" isActive={pathname === '/'} />

        {/* Center FAB */}
        <Link
          href="/report/new"
          className="flex items-center justify-center bg-primary rounded-full w-12 h-12 -mt-4 shadow-lg shadow-primary/25 text-primary-foreground transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Link>

        {userId ? (
          <NotificationBell userId={userId} initialUnreadCount={initialUnreadCount} />
        ) : (
          <NavItem href="/notifications" icon={Bell} label="Alerts" isActive={pathname === '/notifications'} />
        )}
        <NavItem href="/profile" icon={User} label="Profile" isActive={pathname === '/profile'} />
      </div>
    </nav>
  );
}
