export const CATEGORIES = [
  { value: 'infrastructure', labelEN: 'Infrastructure', labelBM: 'Infrastruktur' },
  { value: 'cleanliness', labelEN: 'Cleanliness', labelBM: 'Kebersihan' },
  { value: 'safety', labelEN: 'Safety', labelBM: 'Keselamatan' },
  { value: 'facilities', labelEN: 'Facilities', labelBM: 'Kemudahan' },
  { value: 'other', labelEN: 'Other', labelBM: 'Lain-lain' },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]['value'];
