import { createClient } from '@/lib/supabase/server';

export default async function DebugPage() {
  const supabase = await createClient();

  // Get raw user count
  const { count: userCount, error: countError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Get all users (without nested counts)
  const { data: allUsers, error: usersError } = await supabase
    .from('users')
    .select('id, email, full_name, role, is_banned')
    .order('created_at', { ascending: false });

  // Get all reports
  const { count: reportCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true });

  // Get all flags
  const { count: flagCount } = await supabase
    .from('flags')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-6 px-4 pb-24">
      <h2 className="text-lg font-semibold">Debug: Database Verification</h2>

      <div className="space-y-4 rounded-md border p-4 bg-muted/30">
        <div>
          <h3 className="font-semibold mb-2">Database Counts</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">Users:</span> {userCount ?? 'N/A'} {countError && `(Error: ${countError.message})`}
            </li>
            <li>
              <span className="font-medium">Reports:</span> {reportCount ?? 'N/A'}
            </li>
            <li>
              <span className="font-medium">Flags:</span> {flagCount ?? 'N/A'}
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-4 rounded-md border p-4 bg-muted/30">
        <h3 className="font-semibold">All Users in Database</h3>
        {usersError && (
          <div className="rounded text-sm p-2 bg-destructive/10 text-destructive">
            <p className="font-semibold">Error loading users:</p>
            <p>{usersError.message}</p>
          </div>
        )}
        {allUsers && allUsers.length === 0 && (
          <p className="text-sm text-muted-foreground">No users found in database</p>
        )}
        {allUsers && allUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Email</th>
                  <th className="text-left p-2 font-semibold">Full Name</th>
                  <th className="text-left p-2 font-semibold">Role</th>
                  <th className="text-left p-2 font-semibold">Banned</th>
                  <th className="text-left p-2 font-semibold">ID</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.full_name}</td>
                    <td className="p-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-900'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-2">{user.is_banned ? 'Yes' : 'No'}</td>
                    <td className="p-2 font-mono text-xs text-muted-foreground">{user.id.slice(0, 8)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground space-y-1 p-3 rounded bg-muted/20 border">
        <p>This debug page shows raw database verification.</p>
        <p>If users appear here but not on the Users page, the issue is with the nested reports/flags count query.</p>
        <p>Check browser console and server logs for error messages.</p>
      </div>
    </div>
  );
}
