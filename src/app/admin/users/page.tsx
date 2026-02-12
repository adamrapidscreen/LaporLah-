import { UserRow } from '@/components/admin/user-row';
import { createClient } from '@/lib/supabase/server';

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
  const supabase = await createClient();

  // Query users with report and flag counts
  const { data: users } = await supabase
    .from('users')
    .select(`
      id, email, full_name, avatar_url, role, is_banned,
      reports:reports(count),
      flags:flags(count)
    `)
    .order('is_banned', { ascending: false })
    .order('full_name');

  const formattedUsers: UserWithCounts[] = ((users ?? []) as UserQueryResult[]).map((u) => ({
    id: u.id,
    email: u.email,
    full_name: u.full_name,
    avatar_url: u.avatar_url,
    role: u.role,
    is_banned: u.is_banned,
    report_count: u.reports?.[0]?.count ?? 0,
    flag_count: u.flags?.[0]?.count ?? 0,
  }));

  return (
    <div className="space-y-4 px-4 pb-24">
      <h2 className="text-lg font-semibold">Users ({formattedUsers.length})</h2>
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            <span>User</span>
            <span>Reports</span>
            <span>Flags</span>
            <span>Actions</span>
          </div>
          {formattedUsers.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
