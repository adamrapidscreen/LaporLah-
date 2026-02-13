import { ReportCardSkeleton } from '@/components/shared/loading-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-lg pb-24">
      {/* Greeting Header Skeleton */}
      <div className="px-4 pt-6 pb-2">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Presence Counter Skeleton */}
      <div className="flex items-center gap-2 px-4 mt-1 mb-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-40" />
      </div>

      {/* Community Pulse Skeleton */}
      <div className="grid grid-cols-4 gap-2 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[80px] rounded-xl" />
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex justify-between items-center px-4 py-3 mt-2 border-b border-border">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[120px] rounded-md" />
          <Skeleton className="h-9 w-[100px] rounded-md" />
        </div>
      </div>

      {/* Report List Skeleton */}
      <div className="mt-3 space-y-3 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}