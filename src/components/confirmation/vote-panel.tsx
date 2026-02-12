'use client';

import { useTransition, useState } from 'react';

import { Countdown } from '@/components/confirmation/countdown';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { castVote } from '@/lib/actions/votes';

interface VotePanelProps {
  reportId: string;
  resolvedAt: string;
  initialVotes: { confirmed: number; notYet: number };
  userVote: 'confirmed' | 'not_yet' | null;
}

export function VotePanel({
  reportId,
  resolvedAt,
  initialVotes,
  userVote,
}: VotePanelProps) {
  const [isPending, startTransition] = useTransition();
  const [votes, setVotes] = useState(initialVotes);
  const [currentVote, setCurrentVote] = useState(userVote);

  const handleVote = (vote: 'confirmed' | 'not_yet') => {
    // Optimistic update
    setCurrentVote(vote);
    setVotes((prev) => ({
      ...prev,
      [vote === 'confirmed' ? 'confirmed' : 'notYet']:
        prev[vote === 'confirmed' ? 'confirmed' : 'notYet'] + 1,
    }));

    startTransition(async () => {
      const result = await castVote(reportId, vote);
      if (result?.error) {
        // Revert optimistic update
        setCurrentVote(userVote);
        setVotes(initialVotes);
        toast.error('Sesuatu telah berlaku', {
          description: result.error,
        });
      } else {
        toast.success('Undian anda telah direkodkan');
      }
    });
  };

  const hasVoted = currentVote !== null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Pengesahan Komuniti</h3>
        <Countdown resolvedAt={resolvedAt} />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleVote('confirmed')}
          disabled={hasVoted || isPending}
          variant={currentVote === 'confirmed' ? 'default' : 'outline'}
          className="flex-1 min-h-[44px]"
        >
          ✅ Sahkan ({votes.confirmed})
        </Button>
        <Button
          onClick={() => handleVote('not_yet')}
          disabled={hasVoted || isPending}
          variant={currentVote === 'not_yet' ? 'destructive' : 'outline'}
          className="flex-1 min-h-[44px]"
        >
          ❌ Belum ({votes.notYet})
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Perlukan 3 pengesahan untuk tutup
      </p>
    </div>
  );
}
