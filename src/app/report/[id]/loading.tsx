import { Skeleton } from '@/components/ui/skeleton';

export default function ReportDetailLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-3 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-20 w-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
}
