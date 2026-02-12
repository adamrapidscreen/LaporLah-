import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-12">
      <Skeleton className="h-8 w-32" />

      {/* Account Section */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Display Name Editor */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-24" />
        </div>
      </div>

      {/* Appearance Section */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="rounded-lg border border-border bg-card p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 flex-1" />
          </div>
        </div>
      </div>

      {/* Updates Section */}
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>

      {/* Sign Out Button */}
      <Skeleton className="h-11 w-full" />

      {/* Footer */}
      <div className="pt-4 text-center">
        <Skeleton className="h-3 w-32 mx-auto" />
      </div>
    </div>
  );
}
