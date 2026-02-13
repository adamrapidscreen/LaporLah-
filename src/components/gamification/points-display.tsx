import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface PointsDisplayProps {
  points: number;
  className?: string;
}

export function PointsDisplay({ points, className }: PointsDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Star className="h-5 w-5 text-primary" />
      <span className="font-mono text-xl font-bold text-primary">{points.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">mata</span>
    </div>
  );
}
