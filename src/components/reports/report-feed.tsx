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

export function ReportFeed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category') ?? 'all';
  const currentStatus = searchParams.get('status') ?? 'all';

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
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />

      {/* Category Filter */}
      <Select value={currentCategory} onValueChange={(v) => updateFilter('category', v)}>
        <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
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
        <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUS_FLOW.map((status) => (
            <SelectItem key={status} value={status}>
              {statusConfig[status].label}
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
          className="h-8 text-xs text-muted-foreground"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
