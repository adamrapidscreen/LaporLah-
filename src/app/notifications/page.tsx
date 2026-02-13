import { redirect } from 'next/navigation';

import { Bell } from 'lucide-react';

import { NotificationItem } from '@/components/notifications/notification-item';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { markAllAsRead } from '@/lib/actions/notifications';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 10; // Revalidate every 10 seconds (near-realtime)

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: notifications } = await (supabase as any)
    .from('notifications')
    .select('id, type, message, report_id, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const hasUnread = notifications?.some((n: { is_read: boolean }) => !n.is_read);

  return (
    <div className="mx-auto max-w-2xl p-4 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Notifications</h1>
        {hasUnread && (
          <form action={markAllAsRead}>
            <Button variant="ghost" size="sm" type="submit">
              Mark all read
            </Button>
          </form>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-16 w-16" />}
          title="No notifications"
          subtitle="You're all caught up!"
        />
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((notification: unknown) => (
            <NotificationItem key={(notification as { id: string }).id} notification={notification as { id: string; type: string; message: string; report_id: string; is_read: boolean; created_at: string }} />
          ))}
        </div>
      )}
    </div>
  );
}
