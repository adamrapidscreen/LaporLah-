'use client';

import { useActionState, useState, useEffect } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'; // Import useRouter


import { BadgeUnlock } from '@/components/gamification/badge-unlock'; // Import the component
import { PhotoUpload } from '@/components/reports/photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createReport } from '@/lib/actions/reports';
import { CATEGORIES } from '@/lib/constants/categories';
import { useBadgeUnlock } from '@/lib/hooks/use-badge-unlock'; // Import the hook
import type { ActionState } from '@/lib/types';

const LocationPicker = dynamic(
  () => import('@/components/map/location-picker').then((mod) => mod.LocationPicker),
  { ssr: false, loading: () => <div className="h-48 rounded-lg bg-muted animate-pulse" /> }
);

type ReportFormProps = Record<string, never>;

interface SelectedLocation {
  latitude: number;
  longitude: number;
  area_name: string;
}

export function ReportForm({}: ReportFormProps) {
  const router = useRouter(); // Initialize useRouter
  const { badge, showBadgeUnlock, dismissBadgeUnlock } = useBadgeUnlock(); // Initialize useBadgeUnlock

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(createReport, {
    error: null,
    newBadges: [],
    reportId: undefined,
  });
  const [category, setCategory] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [location, setLocation] = useState<SelectedLocation | null>(null);

  useEffect(() => {
    if (state.newBadges && state.newBadges.length > 0) {
      // For simplicity, show only the first new badge. Can be extended to show all in sequence.
      const firstNewBadge = state.newBadges[0];
      showBadgeUnlock({
        badgeType: firstNewBadge.new_badge_type,
        tier: firstNewBadge.new_tier,
      });
    } else if (state.reportId && !state.error) {
      // If no new badges, or after badges are dismissed, redirect
      router.push(`/report/${state.reportId}`);
    }
  }, [state, showBadgeUnlock, router]);

  // Handle redirect after badge dismissal
  useEffect(() => {
    if (!badge && state.reportId && !state.error) {
      router.push(`/report/${state.reportId}`);
    }
  }, [badge, state.reportId, state.error, router]);

  return (
    <>
      <form action={formAction} className="space-y-4 px-4">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Brief description of issue"
            maxLength={100}
            required
            className="bg-input"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide more details about issue..."
            maxLength={2000}
            required
            rows={5}
            className="bg-input resize-none"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.labelEN} / {cat.labelBM}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="category" value={category} />
        </div>

        {/* Photo Upload */}
        <PhotoUpload
          onUpload={setPhotoUrl}
          onRemove={() => setPhotoUrl('')}
        />
        <input type="hidden" name="photo_url" value={photoUrl} />

        {/* Location Picker */}
        <LocationPicker onLocationSelect={setLocation} />
        {location && (
          <>
            <input type="hidden" name="latitude" value={location.latitude} />
            <input type="hidden" name="longitude" value={location.longitude} />
            <input type="hidden" name="area_name" value={location.area_name} />
          </>
        )}

        {/* Error Display */}
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        {/* Submit */}
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? 'Menghantar...' : 'Hantar Laporan'}
        </Button>
      </form>

      {badge && (
        <BadgeUnlock
          badgeType={badge.badgeType}
          tier={badge.tier}
          onDismiss={dismissBadgeUnlock}
        />
      )}
    </>
  );
}
