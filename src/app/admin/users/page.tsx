import { UserRow } from '@/components/admin/user-row';
import { createAdminClient } from '@/lib/supabase/admin';

export const revalidate = 30; // Revalidate every 30 seconds

interface UserWithCounts {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  is_banned: boolean;
  report_count: number;
  flag_count: number;
}

interface UserQueryResult {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  is_banned: boolean;
  reports?: { count: number }[];
  flags?: { count: number }[];
}

export default async function UsersPage() {
  const supabase = createAdminClient();

  // Query users with report and flag counts
  // Note: We use a workaround for counts since nested count queries can be unreliable
  // Instead, we fetch all users first, then calculate counts in a separate query
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url, role, is_banned')
    .order('is_banned', { ascending: false })
    .order('full_name')
    .limit(50);

  // If users loaded successfully, fetch counts in parallel
  const reportCounts: Record<string, number> = {};
  const flagCounts: Record<string, number> = {};

  if (users && !error) {
    const userIds = users.map((u) => u.id);

    // Parallel fetch report and flag counts
    const [reportDataResult, flagDataResult] = await Promise.all([
      supabase.from('reports').select('user_id', { count: 'exact' }).in('user_id', userIds),
      supabase.from('flags').select('user_id', { count: 'exact' }).in('user_id', userIds),
    ]);

    if (reportDataResult.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reportDataResult.data.forEach((report: any) => {
        reportCounts[report.user_id] = (reportCounts[report.user_id] || 0) + 1;
      });
    }

    if (flagDataResult.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flagDataResult.data.forEach((flag: any) => {
        flagCounts[flag.user_id] = (flagCounts[flag.user_id] || 0) + 1;
      });
    }
  }

  // If the full query fails, try without nested counts to diagnose the issue
  if (error && !users) {
    console.error('[admin/users] Failed to load users:', error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedUsers: UserWithCounts[] = ((users ?? []) as any[]).map((u) => ({
    id: u.id,
    email: u.email,
    full_name: u.full_name,
    avatar_url: u.avatar_url,
    role: u.role,
    is_banned: u.is_banned,
    report_count: reportCounts[u.id] ?? 0,
    flag_count: flagCounts[u.id] ?? 0,
  }));

  return (
    <div className="space-y-4 px-4 pb-24">
      <h2 className="text-lg font-semibold">Users ({formattedUsers.length})</h2>
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-semibold">Failed to load users</p>
          <p className="mt-1 text-xs opacity-90">{error.message}</p>
        </div>
      )}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            <span>User</span>
            <span>Reports</span>
            <span>Flags</span>
            <span>Actions</span>
          </div>
          {formattedUsers.length === 0 && !error && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No users found
            </div>
          )}
          {formattedUsers.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
