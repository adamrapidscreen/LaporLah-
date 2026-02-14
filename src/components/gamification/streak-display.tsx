import { Flame } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export function StreakDisplay({ streak, className }: StreakDisplayProps) {
  if (streak === 0) return null;

  // Format streak label: days for < 7, weeks for >= 7
  const label = streak < 7
    ? `${streak}-day streak`
    : `${Math.floor(streak / 7)}-week streak`;

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-sm text-orange-400 backdrop-blur-sm', className)}>
      <Flame className="h-4 w-4" /> {label}
    </span>
  );
}
