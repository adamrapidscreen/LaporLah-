import type { CategoryValue } from '@/lib/constants/categories';

interface CategoryTagProps {
  category: CategoryValue;
}

const categoryLabels: Record<CategoryValue, string> = {
  infrastructure: 'Infrastruktur',
  cleanliness: 'Kebersihan',
  safety: 'Keselamatan',
  facilities: 'Kemudahan',
  other: 'Lain-lain',
};

export function CategoryTag({ category }: CategoryTagProps) {
  return (
    <span className="rounded-md px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground">
      {categoryLabels[category]}
    </span>
  );
}
