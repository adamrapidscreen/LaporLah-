'use client';

import { useTransition } from 'react';

import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { hideReport, unhideReport, lockComments, unlockComments } from '@/lib/actions/admin';

interface FlaggedItemActionsProps {
  reportId: string;
  isHidden: boolean;
  commentsLocked: boolean;
}

export function FlaggedItemActions({ reportId, isHidden, commentsLocked }: FlaggedItemActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleHide = () => {
    startTransition(async () => {
      if (isHidden) {
        await unhideReport(reportId);
      } else {
        await hideReport(reportId);
      }
    });
  };

  const handleToggleLock = () => {
    startTransition(async () => {
      if (commentsLocked) {
        await unlockComments(reportId);
      } else {
        await lockComments(reportId);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleToggleHide}
        disabled={isPending}
      >
        {isHidden ? <><Eye className="h-4 w-4 mr-1" /> Unhide</> : <><EyeOff className="h-4 w-4 mr-1" /> Hide</>}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleToggleLock}
        disabled={isPending}
      >
        {commentsLocked ? <><Unlock className="h-4 w-4 mr-1" /> Unlock</> : <><Lock className="h-4 w-4 mr-1" /> Lock</>}
      </Button>
    </div>
  );
}
