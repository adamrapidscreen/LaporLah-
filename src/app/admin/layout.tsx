import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== 'admin') redirect('/');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="container mx-auto px-4">
          <div className="flex gap-4 border-b">
            <Link href="/admin/flagged" className="px-3 py-2 text-sm font-medium hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">
              Flagged
            </Link>
            <Link href="/admin" className="px-3 py-2 text-sm font-medium hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">
              Reports
            </Link>
            <Link href="/admin/users" className="px-3 py-2 text-sm font-medium hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">
              Users
            </Link>
          </div>
        </nav>
      </div>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
