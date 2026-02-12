'use client';

import { useRef, useState, useTransition } from 'react';

import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addComment } from '@/lib/actions/comments';

export interface CommentFormProps {
  reportId: string;
  commentsLocked: boolean;
}

export function CommentForm({ reportId, commentsLocked }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (commentsLocked) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        Komen dikunci / Comments are locked
      </p>
    );
  }

  async function handleSubmit(formData: FormData) {
    const content = formData.get('content') as string;
    if (!content || content.trim().length === 0) {
      setError('Komen tidak boleh kosong / Comment cannot be empty');
      return;
    }
    if (content.length > 1000) {
      setError('Komen terlalu panjang (max 1000) / Comment too long');
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await addComment(reportId, content.trim());
      if (result?.error) {
        setError(result.error);
        toast.error('Sesuatu telah berlaku', {
          description: result.error,
        });
      } else {
        formRef.current?.reset();
        toast.success('Komen berjaya dihantar');
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="comment-content" className="sr-only">Comment content</label>
        <Textarea
          id="comment-content"
          name="content"
          placeholder="Tulis komen... / Write a comment..."
          className="min-h-[44px] resize-none"
          rows={1}
          maxLength={1000}
          disabled={isPending}
        />
        <Button type="submit" size="icon" disabled={isPending} className="shrink-0 min-h-[44px] min-w-[44px]">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
