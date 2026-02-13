'use client';

import { Fragment } from 'react';

import { Check } from 'lucide-react';

import { STATUS_FLOW, statusConfig, getStatusIndex, type ReportStatus } from '@/lib/constants/statuses';
import { cn } from '@/lib/utils';

interface StatusStepperProps {
  currentStatus: ReportStatus;
}

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const currentIndex = getStatusIndex(currentStatus);

  const isCompleted = (index: number) => index < currentIndex;
  const isCurrent = (index: number) => index === currentIndex;
  const isUpcoming = (index: number) => index > currentIndex;

  const STEPS = STATUS_FLOW.map(status => ({
    value: status,
    label: statusConfig[status].labelEn,
  }));

  return (
    <div className="w-full">
      {/* Dots and connecting lines */}
      <div className="flex items-center w-full">
        {STEPS.map((step, index) => (
          <Fragment key={step.value}>
            {/* Dot */}
            <div className="flex flex-col items-center" style={{ width: '48px' }}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                isCompleted(index) && "bg-primary text-primary-foreground",
                isCurrent(index) && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                isUpcoming(index) && "bg-muted border-2 border-border"
              )}>
                {isCompleted(index) && <Check className="w-4 h-4" />}
                {isCurrent(index) && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
              </div>
            </div>

            {/* Connecting line (not after last dot) */}
            {index < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5",
                isCompleted(index) ? "bg-primary" : "bg-border"
              )} />
            )}
          </Fragment>
        ))}
      </div>

      {/* Labels row — must align with dots above */}
      <div className="flex items-start w-full mt-2">
        {STEPS.map((step, index) => (
          <Fragment key={step.value}>
            <div className="flex justify-center" style={{ width: '48px' }}>
              <span className={cn(
                "text-[10px] text-center leading-tight",
                isCurrent(index) ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>

            {/* Spacer matching the connecting line width */}
            {index < STEPS.length - 1 && (
              <div className="flex-1" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
