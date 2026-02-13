import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, MapPin, Eye, MessageCircle } from 'lucide-react';

export const revalidate = 15; // Revalidate every 15 seconds (more dynamic)

import { CommentForm } from '@/components/comments/comment-form';
import { CommentList } from '@/components/comments/comment-list';
import { VotePanel } from '@/components/confirmation/vote-panel';
import { LocationDisplayWrapper } from '@/components/map/location-display-wrapper';
import { CategoryTag } from '@/components/reports/category-tag';
import { ReportActionsMenu } from '@/components/reports/report-actions-menu';
import { ReportViewers } from '@/components/reports/report-viewers';
import { ShareButton } from '@/components/reports/share-button';
import { StatusStepper } from '@/components/reports/status-stepper';
import { StatusUpdate } from '@/components/reports/status-update';
import { EmptyState } from '@/components/shared/empty-state';
import { FlagButton } from '@/components/shared/flag-button';
import { FollowButton } from '@/components/shared/follow-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CATEGORIES } from '@/lib/constants/categories';
import { STATUS_FLOW, statusConfig } from '@/lib/constants/statuses';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/types';

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Round 1: Parallel fetch of report, user, comments count, and follow count
  const [reportResult, userResult, commentsCountResult, followCountResult] = await Promise.all([
    supabase
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
      .single(),
    supabase.auth.getUser(),
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('report_id', id),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('report_id', id),
  ]);

  const report = reportResult.data;
  if (!report) {
    notFound();
  }

  const typedReport = report as Report;
  const user = userResult.data?.user;
  const isAuthenticated = !!user;
  const isCreatorOrAdmin = user?.id === typedReport.user_id; // TODO: add admin check
  const commentsCount = commentsCountResult.count;
  const followCount = followCountResult.count ?? 0;

  const currentStatusIndex = STATUS_FLOW.indexOf(typedReport.status);
  const nextStatusValue = STATUS_FLOW[currentStatusIndex + 1];
  const nextStatusLabel = nextStatusValue ? statusConfig[nextStatusValue].labelEn : null;

  // Round 2: Conditional parallel queries based on user and report status
  let isFollowed = false;
  let confirmedCount = 0;
  let notYetCount = 0;
  let userVote: 'confirmed' | 'not_yet' | null = null;

  // Build conditional queries for Round 2
  const round2Queries: Promise<unknown>[] = [];
  const round2Keys: string[] = [];

  if (user) {
    round2Keys.push('followCheck');
    round2Queries.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from('follows')
        .select('id')
        .eq('report_id', id)
        .eq('user_id', user.id)
        .maybeSingle()
    );
  }

  if (typedReport.status === 'resolved') {
    round2Keys.push('confirmations');
    round2Queries.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from('confirmations')
        .select('vote, user_id')
        .eq('report_id', id)
    );
  }

  if (round2Queries.length > 0) {
    const round2Results = await Promise.all(round2Queries);

    round2Keys.forEach((key, index) => {
      const result = round2Results[index] as { data: unknown };
      if (key === 'followCheck') {
        isFollowed = !!result.data;
      } else if (key === 'confirmations') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const confirmations = result.data as any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        confirmedCount = confirmations?.filter((c: any) => c.vote === 'confirmed').length ?? 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        notYetCount = confirmations?.filter((c: any) => c.vote === 'not_yet').length ?? 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userVote = confirmations?.find((c: any) => c.user_id === user?.id)?.vote ?? null;
      }
    });
  }

  // Check resolution timeout (must run after confirmations data is available)
  if (typedReport.status === 'resolved' && typedReport.resolved_at) {
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

  const categoryInfo = CATEGORIES.find((c) => c.value === typedReport.category);

  const timeAgo = formatDistanceToNow(new Date(typedReport.created_at), { addSuffix: true });

  return (
    <div className="mx-auto max-w-2xl">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
        <ReportActionsMenu
          reportId={typedReport.id}
          title={typedReport.title}
          description={typedReport.description}
        />
      </div>

      {/* Photo section */}
      {typedReport.photo_url ? (
        <div className="relative w-full aspect-video overflow-hidden max-h-[300px]">
          <Image
            src={typedReport.photo_url}
            alt={typedReport.title}
            fill
            className="object-cover w-full"
            priority
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-muted overflow-hidden max-h-[300px]">
          <span className="text-muted-foreground">No photo</span>
        </div>
      )}

      {/* Content section */}
      <div className="space-y-6 px-4 pb-24">
        {/* Category tag */}
        {categoryInfo && (
          <div className="pt-4">
            <CategoryTag category={categoryInfo.value} />
          </div>
        )}

        {/* Title */}
        <h1 className="text-xl font-bold text-foreground mt-3">{typedReport.title}</h1>

        <ReportViewers reportId={typedReport.id} />
        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{typedReport.description}</p>

        {/* Section divider: "Status Progress" */}
        <div className="flex items-center gap-3 mt-6 mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Status Progress
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Status Stepper */}
        <StatusStepper currentStatus={typedReport.status} />

        {/* Status action button */}
        {isCreatorOrAdmin && nextStatusLabel && (typedReport.status !== 'closed') && (
          <div className="flex justify-center mt-3">
            <StatusUpdate
              reportId={typedReport.id}
              currentStatus={typedReport.status}
              isCreatorOrAdmin={isCreatorOrAdmin}
              isAuthenticated={isAuthenticated}
            />
          </div>
        )}

        {/* Vote Panel - only for resolved reports */}
        {typedReport.status === 'resolved' && typedReport.resolved_at && (
          <VotePanel
            reportId={typedReport.id}
            resolvedAt={typedReport.resolved_at}
            initialVotes={{ confirmed: confirmedCount, notYet: notYetCount }}
            userVote={userVote}
          />
        )}

        {/* Section divider: "Location" */}
        <div className="flex items-center gap-3 mt-6 mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Location
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Location display */}
        <div className="pt-4">
          <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5" />
            {typedReport.area_name}
          </p>
          {typedReport.latitude && typedReport.longitude && (
            <div className="rounded-xl overflow-hidden h-[180px] relative z-0">
              <LocationDisplayWrapper lat={typedReport.latitude} lng={typedReport.longitude} />
            </div>
          )}
        </div>

        {/* Section divider: "Details" */}
        <div className="flex items-center gap-3 mt-6 mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Details
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Creator info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={typedReport.creator?.avatar_url || ''}
              alt={typedReport.creator?.full_name || 'User'}
            />
            <AvatarFallback>
              {typedReport.creator?.full_name?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{typedReport.creator?.full_name || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>

        {/* Engagement stats */}
        <div className="flex gap-4 mt-3">
          <span className="text-xs text-muted-foreground"><Eye className="inline h-3.5 w-3.5" /> {followCount} {followCount === 1 ? 'follower' : 'followers'}</span>
          <span className="text-xs text-muted-foreground"><MessageCircle className="inline h-3.5 w-3.5" /> {commentsCount ?? 0} {commentsCount === 1 ? 'comment' : 'comments'}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <ShareButton
            title={typedReport.title}
            description={typedReport.description}
            reportId={typedReport.id}
          />
          <div className="flex-1">
            <FollowButton
              reportId={typedReport.id}
              initialFollowed={isFollowed}
              initialCount={followCount}
            />
          </div>
          <FlagButton type="report" targetId={typedReport.id} />
        </div>

        {/* Section divider: "Comments" */}
        <div className="flex items-center gap-3 mt-6 mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Comments
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Comments section */}
        {(commentsCount ?? 0) === 0 ? (
          <EmptyState
          icon={<MessageCircle className="h-16 w-16" />}
            title="No comments yet"
            subtitle="Be the first to comment"
          />
        ) : (
          <CommentList reportId={typedReport.id} />
        )}

        {/* Comment input */}
        <div className="mt-4 mb-4">
          <CommentForm reportId={typedReport.id} commentsLocked={typedReport.comments_locked ?? false} />
        </div>
      </div>
    </div>
  );
}
