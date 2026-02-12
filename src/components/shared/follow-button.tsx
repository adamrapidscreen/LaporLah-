'use client';

import { useOptimistic, useTransition } from 'react';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { toggleFollow } from '@/lib/actions/follows';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  reportId: string;
  initialFollowed: boolean;
  initialCount: number;
}

export function FollowButton({
  reportId,
  initialFollowed,
  initialCount,
}: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { followed: initialFollowed, count: initialCount },
    (state, newFollowed: boolean) => ({
      followed: newFollowed,
      count: newFollowed ? state.count + 1 : state.count - 1,
    })
  );

  function handleToggle() {
    startTransition(async () => {
      const newFollowed = !optimistic.followed;
      setOptimistic(newFollowed);
      const result = await toggleFollow(reportId);
      if (result?.error) {
        toast.error('Sesuatu telah berlaku', {
          description: result.error,
        });
      } else {
        toast.success(newFollowed ? 'Anda kini mengikuti laporan ini' : 'Berhenti mengikuti');
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className="gap-1.5 min-h-[44px] min-w-[44px]"
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all duration-200',
          optimistic.followed
            ? 'fill-destructive text-destructive scale-110'
            : 'fill-none text-muted-foreground scale-100'
        )}
      />
      <span className="text-sm text-muted-foreground">{optimistic.count}</span>
    </Button>
  );
}
