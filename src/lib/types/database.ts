// Auto-generated Supabase database types
// Generate with: supabase gen types typescript --project-id <project-id> > src/lib/types/database.ts

import type { BadgeType, BadgeTier } from '@/lib/constants/badges';

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'user' | 'admin';
          is_banned: boolean;
          total_points: number;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          is_banned?: boolean;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          is_banned?: boolean;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: 'infrastructure' | 'cleanliness' | 'safety' | 'facilities' | 'other';
          status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: 'infrastructure' | 'cleanliness' | 'safety' | 'facilities' | 'other';
          status?: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
          photo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          area_name?: string | null;
          follower_count?: number;
          is_hidden?: boolean;
          comments_locked?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: 'infrastructure' | 'cleanliness' | 'safety' | 'facilities' | 'other';
          status?: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
          photo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          area_name?: string | null;
          follower_count?: number;
          is_hidden?: boolean;
          comments_locked?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          report_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          report_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      confirmations: {
        Row: {
          id: string;
          report_id: string;
          user_id: string;
          vote: 'confirmed' | 'not_yet';
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id: string;
          vote: 'confirmed' | 'not_yet';
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string;
          vote?: 'confirmed' | 'not_yet';
          created_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          type: 'spotter' | 'kampung_hero' | 'closer';
          tier: 'bronze' | 'silver' | 'gold';
          awarded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'spotter' | 'kampung_hero' | 'closer';
          tier: 'bronze' | 'silver' | 'gold';
          awarded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'spotter' | 'kampung_hero' | 'closer';
          tier?: 'bronze' | 'silver' | 'gold';
          awarded_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          report_id: string | null;
          type:
            | 'status_change'
            | 'new_comment'
            | 'confirmation_request'
            | 'badge_earned'
            | 'report_followed';
          actor_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_id?: string | null;
          type:
            | 'status_change'
            | 'new_comment'
            | 'confirmation_request'
            | 'badge_earned'
            | 'report_followed';
          actor_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          report_id?: string | null;
          type?:
            | 'status_change'
            | 'new_comment'
            | 'confirmation_request'
            | 'badge_earned'
            | 'report_followed';
          actor_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      flags: {
        Row: {
          id: string;
          report_id: string | null;
          comment_id: string | null;
          user_id: string;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id?: string | null;
          comment_id?: string | null;
          user_id: string;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string | null;
          comment_id?: string | null;
          user_id?: string;
          reason?: string;
          created_at?: string;
        };
      };
      point_events: {
        Row: {
          id: string;
          user_id: string;
          report_id: string | null;
          action: string;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_id?: string | null;
          action: string;
          points: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          report_id?: string | null;
          action?: string;
          points?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      award_points: {
        Args: {
          p_user_id: string;
          p_action: string;
          p_points: number;
          p_report_id?: string | null;
        };
        Returns: void;
      };
      check_and_award_badges: {
        Args: {
          p_user_id: string;
        };
        Returns: { new_badge_type: BadgeType, new_tier: BadgeTier }[];
      };
      update_streak: {
        Args: {
          p_user_id: string;
        };
        Returns: void;
      };
      notify_followers: {
        Args: {
          p_report_id: string;
          p_type: string; // notification_type enum in DB
          p_message: string;
          p_exclude_user?: string | null;
        };
        Returns: void;
      };
    };
    Enums: {
      badge_tier: 'bronze' | 'silver' | 'gold';
      badge_type: 'spotter' | 'kampung_hero' | 'closer';
      notification_type:
        | 'status_change'
        | 'new_comment'
        | 'confirmation_request'
        | 'badge_earned'
        | 'report_followed';
      report_category: 'infrastructure' | 'cleanliness' | 'safety' | 'facilities' | 'other';
      report_status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
      user_role: 'user' | 'admin';
      vote_type: 'confirmed' | 'not_yet';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
