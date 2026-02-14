'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { updateReportStatus } from '@/lib/actions/reports';
import { STATUS_FLOW, statusConfig, getStatusIndex, type ReportStatus } from '@/lib/constants/statuses';

interface StatusUpdateProps {
  reportId: string;
  currentStatus: ReportStatus;
  isCreatorOrAdmin: boolean;
  isAuthenticated: boolean;
}

export function StatusUpdate({
  reportId,
  currentStatus,
  isCreatorOrAdmin,
  isAuthenticated,
}: StatusUpdateProps) {
  const [isPending, startTransition] = useTransition();
  const currentIndex = getStatusIndex(currentStatus);

  function getNextStatus(): ReportStatus | null {
    // Creator/admin can advance forward (up to in_progress)
    if (isCreatorOrAdmin && currentIndex < 2) {
      return STATUS_FLOW[currentIndex + 1];
    }
    // Any auth user can propose resolved when in_progress
    if (isAuthenticated && currentStatus === 'in_progress') {
      return 'resolved';
    }
    return null;
  }

  const nextStatus = getNextStatus();
  if (!nextStatus) return null;

  const nextConfig = statusConfig[nextStatus];

  function handleUpdate(statusToUpdate: ReportStatus) {
    startTransition(async () => {
      const result = await updateReportStatus(reportId, statusToUpdate);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button onClick={() => handleUpdate(nextStatus)} disabled={isPending} variant="outline" size="sm">
      {isPending ? 'Updating...' : `Mark as ${nextConfig.labelEn} →`}
    </Button>
  );
}
