'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  title: string;
  description: string;
  reportId: string;
}

export function ShareButton({ title, description, reportId }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/report/${reportId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `LaporLah: ${title}`,
          text: description.slice(0, 100),
          url,
        });
        toast.success('Shared successfully');
      } catch (err) {
        // User cancelled share — not an error
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex-1"
      onClick={handleShare}
    >
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
}
