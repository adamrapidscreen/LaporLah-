import Image from 'next/image';
import Link from 'next/link';

import { MapPin, Users, MessageCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { Report } from '@/lib/types';
import { cn, formatRelativeTime, getStatusColor } from '@/lib/utils';

import { CategoryTag } from './category-tag';
import { StatusPill } from './status-pill';

interface ReportCardProps {
  report: Report;
  priority?: boolean;
}

export function ReportCard({ report, priority = false }: ReportCardProps) {
  return (
    <Link href={`/report/${report.id}`}>
      <Card className={cn("overflow-hidden transition-all hover:card-glow", `border-l-[3px] border-${getStatusColor(report.status)}/70`)}>
        {/* Photo Thumbnail */}
        {report.photo_url ? (
          <div className="relative aspect-video w-full">
            <Image
              src={report.photo_url}
              alt={report.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priority}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <StatusPill status={report.status} />
              <CategoryTag category={report.category} />
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <StatusPill status={report.status} />
              <CategoryTag category={report.category} />
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Title */}
          <h2 className="text-base font-semibold text-foreground mt-3">
            {report.title}
          </h2>

          {/* Description Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {report.description}
          </p>

          {/* Location */}
          {report.area_name && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
              <MapPin className="h-3 w-3" />
              {report.area_name}
            </p>
          )}

          {/* Footer: Creator + Meta */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={report.creator?.avatar_url ?? ''} />
                <AvatarFallback className="text-xs">
                  {report.creator?.full_name?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {report.creator?.full_name ?? 'Anonymous'} · {formatRelativeTime(report.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {report.follower_count}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                0
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
