'use client';

import { useState, useEffect } from 'react';

import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface CountdownProps {
  resolvedAt: string;
  className?: string;
}

export function Countdown({ resolvedAt, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const deadline = new Date(resolvedAt).getTime() + 72 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('Pengundian tamat');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}j ${minutes}m lagi`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60_000);

    return () => clearInterval(interval);
  }, [resolvedAt]);

  return (
    <span
      className={cn(
        'text-xs font-medium',
        isExpired ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-400',
        className
      )}
    >
      <Clock className="inline h-3.5 w-3.5 mr-1" /> {timeLeft}
    </span>
  );
}
