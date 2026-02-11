import type { CategoryValue } from '@/lib/constants/categories';
import type { ReportStatus } from '@/lib/constants/statuses';

export interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: CategoryValue;
  status: ReportStatus;
  photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  area_name: string | null;
  follower_count: number;
  is_hidden: boolean;
  comments_locked: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface ActionState {
  error: string | null;
}
