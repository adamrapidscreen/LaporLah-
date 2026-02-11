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
    <span className={cn('text-sm font-medium text-accent', className)}>
      🔥 {label}
    </span>
  );
}
