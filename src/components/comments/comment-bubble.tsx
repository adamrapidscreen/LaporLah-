import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/lib/utils';

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface CommentBubbleProps {
  comment: Comment;
}

export function CommentBubble({ comment }: CommentBubbleProps) {
  return (
    <div className="flex gap-2.5">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={comment.user.avatar_url ?? undefined} alt={comment.user.full_name} />
        <AvatarFallback className="text-xs">
          {comment.user.full_name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="rounded-lg bg-secondary px-3 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{comment.user.full_name}</span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground">{comment.content}</p>
      </div>
    </div>
  );
}
