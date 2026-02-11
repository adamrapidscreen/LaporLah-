import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatRelativeTime, formatProfileRelativeTime } from './date';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { formatRelativeTime, formatProfileRelativeTime };
