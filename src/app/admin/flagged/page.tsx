import { FlaggedItemCard } from '@/components/admin/flagged-item-card';
import { getFlaggedItems } from '@/lib/actions/admin';

export default async function FlaggedItemsPage() {
  const items = await getFlaggedItems();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-6xl mb-4">🏳️</span>
        <h3 className="text-lg font-semibold">No flagged items</h3>
        <p className="text-sm text-muted-foreground">All clear! No reports or comments have been flagged.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Flagged Items ({items.length})</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <FlaggedItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
