import { ReportCardSkeleton } from '@/components/shared/loading-skeleton';

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <ReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
