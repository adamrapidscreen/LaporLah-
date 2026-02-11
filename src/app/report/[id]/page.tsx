import Image from 'next/image';
import { notFound } from 'next/navigation';

import { CommentForm } from '@/components/comments/comment-form';
import { CommentList } from '@/components/comments/comment-list';
import { LocationDisplayWrapper } from '@/components/map/location-display-wrapper';
import { CategoryTag } from '@/components/reports/category-tag';
import { StatusStepper } from '@/components/reports/status-stepper';
import { StatusUpdate } from '@/components/reports/status-update';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants/categories';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/types';

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: report } = await supabase
    .from('reports')
    .select(`
      *,
      creator:users!user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .eq('is_hidden', false)
    .single();

  if (!report) {
    notFound();
  }

  const typedReport = report as Report;

  // Get current user for auth checks
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  const isCreatorOrAdmin = user?.id === typedReport.user_id; // TODO: add admin check

  const categoryInfo = CATEGORIES.find((c) => c.value === typedReport.category);

  const formattedDate = new Date(typedReport.created_at).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Card className="overflow-hidden">
        {/* Photo */}
        {typedReport.photo_url ? (
          <div className="relative aspect-video w-full">
            <Image
              src={typedReport.photo_url}
              alt={typedReport.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No photo</span>
          </div>
        )}

        <div className="space-y-6 p-4">
          {/* Status Stepper */}
          <div className="flex items-center justify-between">
            <StatusStepper currentStatus={typedReport.status} />
            <StatusUpdate
              reportId={typedReport.id}
              currentStatus={typedReport.status}
              isCreatorOrAdmin={isCreatorOrAdmin}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* Title and Category */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{typedReport.title}</h1>
            {categoryInfo && <CategoryTag category={categoryInfo.value} />}
          </div>

          {/* Map */}
          {typedReport.latitude && typedReport.longitude && (
            <LocationDisplayWrapper lat={typedReport.latitude} lng={typedReport.longitude} />
          )}

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{typedReport.description}</p>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Comments</h2>
            <CommentList reportId={typedReport.id} />
            <CommentForm reportId={typedReport.id} commentsLocked={typedReport.comments_locked ?? false} />
          </div>

          {/* Creator Info */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={typedReport.creator?.avatar_url || ''}
                  alt={typedReport.creator?.full_name || 'User'}
                />
                <AvatarFallback>
                  {typedReport.creator?.full_name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{typedReport.creator?.full_name || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            {/* Follow Button Placeholder */}
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Follow
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
