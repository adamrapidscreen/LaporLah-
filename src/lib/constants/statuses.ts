export const STATUSES = [
  { value: 'open', labelEN: 'Open', labelBM: 'Dibuka', color: 'blue' },
  { value: 'acknowledged', labelEN: 'Acknowledged', labelBM: 'Diakui', color: 'purple' },
  { value: 'in_progress', labelEN: 'In Progress', labelBM: 'Dalam Proses', color: 'amber' },
  { value: 'resolved', labelEN: 'Resolved', labelBM: 'Diselesaikan', color: 'emerald' },
  { value: 'closed', labelEN: 'Closed', labelBM: 'Ditutup', color: 'gray' },
] as const;

export type StatusValue = (typeof STATUSES)[number]['value'];
