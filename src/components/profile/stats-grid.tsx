interface StatsGridProps {
  points: number;
  reportsCount: number;
  commentsCount: number;
}

export function StatsGrid({ points, reportsCount, commentsCount }: StatsGridProps) {
  const stats = [
    { value: points, label: 'MATA' },
    { value: reportsCount, label: 'LAPORAN' },
    { value: commentsCount, label: 'KOMEN' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-mono text-xl font-bold text-primary">{stat.value}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
