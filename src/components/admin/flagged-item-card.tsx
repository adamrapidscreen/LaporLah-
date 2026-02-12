'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

import { FlaggedItemActions } from '@/components/admin/flagged-item-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { FlaggedItem } from '@/lib/actions/admin';

interface FlaggedItemCardProps {
  item: FlaggedItem;
}

export function FlaggedItemCard({ item }: FlaggedItemCardProps) {
  const [showReasons, setShowReasons] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{item.type}</Badge>
              <Badge variant="destructive">{item.flagCount} flag{item.flagCount !== 1 ? 's' : ''}</Badge>
              {item.isHidden && <Badge variant="secondary">Hidden</Badge>}
              {item.commentsLocked && <Badge variant="secondary">Comments Locked</Badge>}
            </div>
            <h3 className="font-medium truncate">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/report/${item.reportId}`}>
              <Button size="sm" variant="ghost">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowReasons(!showReasons)}
            >
              {showReasons ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {showReasons && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Flag Reasons:</h4>
            <ul className="space-y-1">
              {item.reasons.map((reason, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 pt-4 border-t">
          <FlaggedItemActions
            reportId={item.reportId}
            isHidden={item.isHidden}
            commentsLocked={item.commentsLocked}
          />
        </div>
      </CardContent>
    </Card>
  );
}
