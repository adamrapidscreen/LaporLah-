interface StatsGridProps {
  points: number;
  reportsCount: number;
  commentsCount: number;
}

export function StatsGrid({ points, reportsCount, commentsCount }: StatsGridProps) {
  const stats = [
    { value: points, label: 'POINTS' },
    { value: reportsCount, label: 'REPORTS' },
    { value: commentsCount, label: 'COMMENTS' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 w-full bg-secondary/30 rounded-xl p-3">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-4">
          {i > 0 && <div className="h-8 w-px bg-border/50" />}
          <div className="text-center">
            <span className="block text-2xl font-bold font-mono text-primary stat-number">{stat.value}</span>
            <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
