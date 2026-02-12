// src/components/reports/community-pulse.tsx

import Link from 'next/link';
import { getCommunityStats } from '@/lib/actions/reports';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  count: number;
  status: string;
  color: string;
}

function StatCard({ title, count, status, color }: StatCardProps) {
  return (
    <Link
      href={`/?status=${status}`}
      className="bg-card border border-border rounded-xl p-2 cursor-pointer hover:card-glow transition flex flex-col items-center justify-center"
      style={{ borderLeftColor: `rgba(var(--${color}), 0.3)` }}
    >
      <div className="flex items-center gap-1">
        <div className={cn("w-1.5 h-1.5 rounded-full", color)} />
        <span className="font-mono text-lg font-bold text-foreground">{count}</span>
      </div>
      <span className="text-[10px] text-muted-foreground leading-tight text-center whitespace-nowrap">{title}</span>
    </Link>
  );
}

export async function CommunityPulse() {
  const stats = await getCommunityStats();

  const statData = [
    { title: 'Open', count: stats.open, status: 'open', color: 'bg-blue-500' },
    { title: 'Dalam Proses', count: stats.in_progress, status: 'in_progress', color: 'bg-amber-500' },
    { title: 'Selesai', count: stats.closed, status: 'closed', color: 'bg-emerald-500' },
    { title: 'Perlu Sahkan', count: stats.resolved, status: 'resolved', color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-4">
      {statData.map((stat) => (
        <StatCard key={stat.status} {...stat} />
      ))}
    </div>
  );
}
