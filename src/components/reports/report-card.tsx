import Image from 'next/image';
import Link from 'next/link';

import { MapPin, Users } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { Report } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

import { CategoryTag } from './category-tag';
import { StatusPill } from './status-pill';

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link href={`/report/${report.id}`}>
      <Card className="overflow-hidden transition-colors hover:bg-accent/50">
        {/* Photo Thumbnail */}
        {report.photo_url && (
          <div className="relative aspect-video w-full">
            <Image
              src={report.photo_url}
              alt={report.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="space-y-3 p-4">
          {/* Status + Category Row */}
          <div className="flex items-center gap-2">
            <StatusPill status={report.status} />
            <CategoryTag category={report.category} />
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold leading-tight line-clamp-2">
            {report.title}
          </h2>

          {/* Description Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {report.description}
          </p>

          {/* Location */}
          {report.area_name && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {report.area_name}
            </p>
          )}

          {/* Footer: Creator + Meta */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={report.creator?.avatar_url ?? ''} />
                <AvatarFallback className="text-xs">
                  {report.creator?.full_name?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {report.creator?.full_name ?? 'Anonymous'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {report.follower_count}
              </span>
              <time>{formatRelativeTime(report.created_at)}</time>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
