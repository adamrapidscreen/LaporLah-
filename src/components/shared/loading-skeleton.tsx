import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ReportCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Photo placeholder */}
      <Skeleton className="aspect-video w-full" />

      <div className="space-y-3 p-4">
        {/* Status + Category */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ReportCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReportDetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl pb-24">
      {/* Top bar skeleton */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* Photo skeleton */}
      <Skeleton className="h-[300px] w-full" />

      {/* Content skeleton */}
      <div className="px-4 pt-4 space-y-3">
        {/* Category tag */}
        <Skeleton className="h-6 w-24 rounded-full" />

        {/* Title */}
        <Skeleton className="h-7 w-3/4" />

        {/* Viewers */}
        <Skeleton className="h-4 w-32" />

        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Stepper skeleton */}
        <div className="flex items-center gap-2 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              {i < 4 && <Skeleton className="h-0.5 flex-1" />}
            </div>
          ))}
        </div>

        {/* Map skeleton */}
        <Skeleton className="h-[180px] rounded-xl mt-6" />

        {/* Creator info skeleton */}
        <div className="flex items-center gap-3 mt-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>

        {/* Comments skeleton */}
        <div className="space-y-3 mt-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminStatSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <Skeleton className="h-7 w-32" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
