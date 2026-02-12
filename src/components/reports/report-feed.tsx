'use client';

import { useCallback } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/lib/constants/categories';
import { STATUS_FLOW, statusConfig } from '@/lib/constants/statuses';

interface ReportFeedProps {
  searchStatus?: string;
  searchCategory?: string;
}

export function ReportFeed({ searchStatus, searchCategory }: ReportFeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchCategory ?? searchParams.get('category') ?? 'all';
  const currentStatus = searchStatus ?? searchParams.get('status') ?? 'all';

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasFilters = currentCategory !== 'all' || currentStatus !== 'all';

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex flex-col gap-2 px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">Laporan Terkini</h2>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />

      {/* Category Filter */}
      <Select value={currentCategory} onValueChange={(v) => updateFilter('category', v)}>
        <SelectTrigger className="h-9 flex-1 text-xs">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.labelEN} / {cat.labelBM}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={currentStatus} onValueChange={(v) => updateFilter('status', v)}>
        <SelectTrigger className="h-9 flex-1 text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUS_FLOW.map((status) => (
            <SelectItem key={status} value={status}>
              {statusConfig[status].labelEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 min-h-[44px] text-xs text-muted-foreground"
        >
          Clear
        </Button>
      )}
        </div>
      </div>
    </div>
  );
}
