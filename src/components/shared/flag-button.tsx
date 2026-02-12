'use client';

import { useState, useTransition } from 'react';

import { Flag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { flagReport, flagComment } from '@/lib/actions/flags';

interface FlagButtonProps {
  type: 'report' | 'comment';
  targetId: string;
}

export function FlagButton({ type, targetId }: FlagButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please provide a reason');
      return;
    }
    if (reason.length > 500) {
      setError('Reason must be 500 characters or less');
      return;
    }

    setError(null);
    startTransition(async () => {
      const action = type === 'report' ? flagReport : flagComment;
      const result = await action(targetId, reason.trim());
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        setReason('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
          <Flag className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this {type}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            placeholder="Why are you flagging this? (required)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={3}
          />
          <p className="text-xs text-muted-foreground text-right">{reason.length}/500</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Flag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
