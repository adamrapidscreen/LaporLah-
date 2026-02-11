import type { ReportStatus } from '@/lib/constants/statuses';
import { cn } from '@/lib/utils/cn';

interface StatusPillProps {
  status: ReportStatus;
}

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
  open: {
    label: 'Open',
    className: 'bg-[hsl(var(--status-open))]/15 text-[hsl(var(--status-open))]',
  },
  acknowledged: {
    label: 'Acknowledged',
    className: 'bg-[hsl(var(--status-acknowledged))]/15 text-[hsl(var(--status-acknowledged))]',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-[hsl(var(--status-in-progress))]/15 text-[hsl(var(--status-in-progress))]',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-[hsl(var(--status-resolved))]/15 text-[hsl(var(--status-resolved))]',
  },
  closed: {
    label: 'Closed',
    className: 'bg-[hsl(var(--status-closed))]/15 text-[hsl(var(--status-closed))]',
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
