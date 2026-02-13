import { FileEdit, MessageCircle, Users, CheckCircle, PartyPopper, Trophy, Circle } from 'lucide-react';

import { formatRelativeTime } from '@/lib/utils'; // Import the utility

const ACTION_LABELS: Record<string, { icon: React.ElementType; label: string }> = {
  create_report: { icon: FileEdit, label: 'Mencipta laporan' },
  comment: { icon: MessageCircle, label: 'Memberi komen' },
  new_follower: { icon: Users, label: 'Pengikut baharu' },
  confirmation_vote: { icon: CheckCircle, label: 'Undi pengesahan' },
  report_closed: { icon: PartyPopper, label: 'Laporan ditutup' },
  resolution_confirmed: { icon: Trophy, label: 'Penyelesaian disahkan' },
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
        const config = ACTION_LABELS[activity.action] ?? { icon: Circle, label: activity.action };
        const timeAgo = formatRelativeTime(activity.created_at); // Use the function

        const IconComponent = config.icon;

        return (
          <div key={activity.id} className="flex items-center gap-3 text-sm">
            <IconComponent className="h-5 w-5 text-muted-foreground" />
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
