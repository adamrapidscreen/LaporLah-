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
