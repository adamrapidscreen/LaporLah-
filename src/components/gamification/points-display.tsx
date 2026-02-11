import { cn } from '@/lib/utils';

interface PointsDisplayProps {
  points: number;
  className?: string;
}

export function PointsDisplay({ points, className }: PointsDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-lg">⭐</span>
      <span className="font-mono text-xl font-bold text-primary">{points.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">mata</span>
    </div>
  );
}
