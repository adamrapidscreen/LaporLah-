'use client';

import Link from 'next/link';

import { Bell, MessageCircle, Heart, ArrowUpCircle } from 'lucide-react';

import { markAsRead } from '@/lib/actions/notifications';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  message: string;
  report_id: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationItemProps {
  notification: Notification;
}

const typeIcons: Record<string, React.ElementType> = {
  status_change: ArrowUpCircle,
  new_comment: MessageCircle,
  new_follower: Heart,
  default: Bell,
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const Icon = typeIcons[notification.type] || typeIcons.default;

  async function handleClick() {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  }

  return (
    <Link
      href={`/report/${notification.report_id}`}
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent',
        !notification.is_read && 'bg-primary/5'
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="flex-1 space-y-1">
        <p className={cn(
          'text-sm',
          !notification.is_read && 'font-medium'
        )}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
      {!notification.is_read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </Link>
  );
}
