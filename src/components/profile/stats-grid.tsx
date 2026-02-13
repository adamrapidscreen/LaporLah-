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
    <div className="grid grid-cols-3 gap-4 w-full bg-secondary/30 rounded-xl p-3">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-mono text-2xl font-bold text-primary">{stat.value}</p>
          <p className="text-sm text-muted-foreground uppercase">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
