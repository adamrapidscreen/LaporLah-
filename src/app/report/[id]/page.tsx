import Image from 'next/image';
import { notFound } from 'next/navigation';

import { CommentForm } from '@/components/comments/comment-form';
import { CommentList } from '@/components/comments/comment-list';
import { VotePanel } from '@/components/confirmation/vote-panel';
import { LocationDisplayWrapper } from '@/components/map/location-display-wrapper';
import { CategoryTag } from '@/components/reports/category-tag';
import { StatusStepper } from '@/components/reports/status-stepper';
import { StatusUpdate } from '@/components/reports/status-update';
import { FollowButton } from '@/components/shared/follow-button';
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

  // Fetch follow state for current user
  let isFollowed = false;
  let followCount = 0;

  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: follow } = await (supabase as any)
      .from('follows')
      .select('id')
      .eq('report_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    isFollowed = !!follow;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (supabase as any)
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('report_id', id);

  followCount = count ?? 0;

  // Fetch confirmations for vote panel
  let confirmedCount = 0;
  let notYetCount = 0;
  let userVote: 'confirmed' | 'not_yet' | null = null;

  if (typedReport.status === 'resolved') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: confirmations } = await (supabase as any)
      .from('confirmations')
      .select('vote, user_id')
      .eq('report_id', id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    confirmedCount = confirmations?.filter((c: any) => c.vote === 'confirmed').length ?? 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notYetCount = confirmations?.filter((c: any) => c.vote === 'not_yet').length ?? 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userVote = confirmations?.find((c: any) => c.user_id === user?.id)?.vote ?? null;

    // Check timeout on page load
    if (typedReport.resolved_at) {
      const hoursElapsed = (Date.now() - new Date(typedReport.resolved_at).getTime()) / (1000 * 60 * 60);
      if (hoursElapsed >= 72) {
        const { checkResolution } = await import('@/lib/actions/votes');
        await checkResolution(typedReport.id);
        // Re-fetch report after potential state change
        const { data: updatedReport } = await supabase
          .from('reports')
          .select('*')
          .eq('id', id)
          .single();
        if (updatedReport) {
          Object.assign(typedReport, updatedReport);
        }
      }
    }
  }

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

          {/* Vote Panel - only for resolved reports */}
          {typedReport.status === 'resolved' && typedReport.resolved_at && (
            <VotePanel
              reportId={typedReport.id}
              resolvedAt={typedReport.resolved_at}
              initialVotes={{ confirmed: confirmedCount, notYet: notYetCount }}
              userVote={userVote}
            />
          )}

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

            <FollowButton
              reportId={typedReport.id}
              initialFollowed={isFollowed}
              initialCount={followCount}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
