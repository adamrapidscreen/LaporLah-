export const STATUS_FLOW = [
  'open',
  'acknowledged',
  'in_progress',
  'resolved',
  'closed',
] as const;

export type ReportStatus = (typeof STATUS_FLOW)[number];

export const statusConfig: Record<
  ReportStatus,
  { bg: string; text: string; label: string; labelMs: string }
> = {
  open: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Open', labelMs: 'Dibuka' },
  acknowledged: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Ack\'d', labelMs: 'Diakui' },
  in_progress: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'In Progress', labelMs: 'Dalam Proses' },
  resolved: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Resolved', labelMs: 'Diselesaikan' },
  closed: { bg: 'bg-gray-500/15', text: 'text-gray-400', label: 'Closed', labelMs: 'Ditutup ✓' },
};

export function getStatusIndex(status: ReportStatus): number {
  return STATUS_FLOW.indexOf(status);
}
