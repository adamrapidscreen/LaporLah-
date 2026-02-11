import { cn, formatProfileRelativeTime } from '@/lib/utils'; // Import the new utility

const ACTION_LABELS: Record<string, { emoji: string; label: string }> = {
  create_report: { emoji: '📝', label: 'Mencipta laporan' },
  comment: { emoji: '💬', label: 'Memberi komen' },
  new_follower: { emoji: '👥', label: 'Pengikut baharu' },
  confirmation_vote: { emoji: '✅', label: 'Undi pengesahan' },
  report_closed: { emoji: '🎉', label: 'Laporan ditutup' },
  resolution_confirmed: { emoji: '🏆', label: 'Penyelesaian disahkan' },
};

interface Activity {
  id: string;
  action: string;
  points: number;
  created_at: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Belum ada aktiviti
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const config = ACTION_LABELS[activity.action] ?? { emoji: '•', label: activity.action };
        const timeAgo = formatProfileRelativeTime(activity.created_at); // Use the new function

        return (
          <div key={activity.id} className="flex items-center gap-3 text-sm">
            <span className="text-lg">{config.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="truncate">{config.label}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
            <span className="text-xs font-medium text-primary">+{activity.points}</span>
          </div>
        );
      })}
    </div>
  );
}
