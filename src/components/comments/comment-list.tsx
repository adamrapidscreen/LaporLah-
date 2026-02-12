import { CommentBubble, type Comment } from '@/components/comments/comment-bubble';
import { EmptyState } from '@/components/shared/empty-state';
import { createClient } from '@/lib/supabase/server';

export interface CommentListProps {
  reportId: string;
}

export async function CommentList({ reportId }: CommentListProps) {
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from('comments')
    .select('*, user:users(id, full_name, avatar_url)')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true });

  if (!comments || comments.length === 0) {
    return (
      <EmptyState
        emoji="💬"
        title="No comments yet"
        subtitle="Start the conversation"
      />
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentBubble key={(comment as Comment).id} comment={comment as Comment} />
      ))}
    </div>
  );
}
