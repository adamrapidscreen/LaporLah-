const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800; // Not used currently but kept for context

export function formatRelativeTime(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );

  if (seconds < MINUTE) return 'just now';
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  if (seconds < 7 * DAY) return `${Math.floor(seconds / DAY)}d ago`; // Display in days for up to a week

  return new Date(dateString).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatProfileRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru sahaja';
  if (diffMins < 60) return `${diffMins} minit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
}
