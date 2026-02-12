import { Skeleton } from '@/components/ui/skeleton';
import { ReportCardSkeleton } from '@/components/shared/loading-skeleton';

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-lg">
      {/* Greeting Header Skeleton */}
      <div className="px-4 pt-6 pb-4">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Community Pulse Skeleton */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-[85px] h-[90px] rounded-xl flex-shrink-0" />
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-border">
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