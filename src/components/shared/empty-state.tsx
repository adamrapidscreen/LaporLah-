import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ emoji, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-[64px] leading-none mb-4" role="img">{emoji}</span>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
