'use client';

import { STATUS_FLOW, statusConfig, getStatusIndex, type ReportStatus } from '@/lib/constants/statuses';
import { cn } from '@/lib/utils';

interface StatusStepperProps {
  currentStatus: ReportStatus;
}

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="flex items-center gap-1">
      {STATUS_FLOW.map((status, index) => {
        const config = statusConfig[status];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={status} className="flex items-center">
            {/* Dot */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'h-3 w-3 rounded-full border-2 transition-all',
                  isCompleted && 'border-primary bg-primary',
                  isCurrent && 'border-primary bg-primary animate-pulse',
                  isUpcoming && 'border-muted bg-transparent'
                )}
              />
              <span className={cn(
                'text-[10px] leading-tight text-center',
                isCurrent ? config.text : 'text-muted-foreground'
              )}>
                {config.labelMs}
              </span>
            </div>
            {/* Connecting line */}
            {index < STATUS_FLOW.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-0.5 w-6',
                  index < currentIndex ? 'bg-primary' : 'border-t border-dashed border-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
