import { redirect } from 'next/navigation';

import { NotificationItem } from '@/components/notifications/notification-item';
import { Button } from '@/components/ui/button';
import { markAllAsRead } from '@/lib/actions/notifications';
import { createClient } from '@/lib/supabase/server';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: notifications } = await (supabase as any)
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const hasUnread = notifications?.some((n: { is_read: boolean }) => !n.is_read);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Notifikasi / Notifications</h1>
        {hasUnread && (
          <form action={markAllAsRead}>
            <Button variant="ghost" size="sm" type="submit">
              Tandai semua dibaca / Mark all read
            </Button>
          </form>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Tiada notifikasi / No notifications
        </p>
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
