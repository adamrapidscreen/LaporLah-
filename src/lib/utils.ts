import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

import { type ReportStatus } from './constants/statuses';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function getStatusColor(status: ReportStatus): string {
  switch (status) {
    case 'open':
      return 'blue-500';
    case 'in_progress':
      return 'amber-500';
    case 'resolved':
      return 'purple-500';
    case 'closed':
      return 'emerald-500';
    default:
      return 'gray-500';
  }
}
