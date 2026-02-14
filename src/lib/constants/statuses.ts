export const STATUS_FLOW = [
  'open',
  'in_progress',
  'resolved',
  'closed',
] as const;

export type ReportStatus = (typeof STATUS_FLOW)[number];

export const statusConfig: Record<
  ReportStatus,
  { labelEn: string; labelMs: string; color: string; text: string }
> = {
  open: { labelEn: 'Open', labelMs: 'Dibuka', color: 'status-open', text: 'text-status-open' },
  in_progress: { labelEn: 'In Progress', labelMs: 'Dalam Proses', color: 'status-in-progress', text: 'text-status-in-progress' },
  resolved: { labelEn: 'Resolved', labelMs: 'Diselesaikan', color: 'status-resolved', text: 'text-status-resolved' },
  closed: { labelEn: 'Closed', labelMs: 'Ditutup', color: 'status-closed', text: 'text-status-closed' },
};

export function getStatusIndex(status: ReportStatus): number {
  return STATUS_FLOW.indexOf(status);
}