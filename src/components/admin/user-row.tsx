'use client';

import { useTransition } from 'react';

import { Ban, UserCheck } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { banUser, unbanUser } from '@/lib/actions/admin';


interface UserRowProps {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    is_banned: boolean;
    report_count: number;
    flag_count: number;
  };
}

export function UserRow({ user }: UserRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleBan = () => {
    startTransition(async () => {
      if (user.is_banned) {
        await unbanUser(user.id);
      } else {
        await banUser(user.id);
      }
    });
  };

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-3 border-b last:border-b-0 items-center">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url ?? undefined} />
          <AvatarFallback>{user.full_name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{user.full_name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        {user.is_banned && <Badge variant="destructive">Banned</Badge>}
      </div>
      <span className="text-sm font-mono">{user.report_count}</span>
      <span className="text-sm font-mono">{user.flag_count}</span>
      <Button
        size="sm"
        variant={user.is_banned ? 'outline' : 'destructive'}
        onClick={handleToggleBan}
        disabled={isPending}
      >
        {user.is_banned ? <><UserCheck className="h-4 w-4 mr-1" /> Unban</> : <><Ban className="h-4 w-4 mr-1" /> Ban</>}
      </Button>
    </div>
  );
}
