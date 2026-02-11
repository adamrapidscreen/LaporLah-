-- E1-S2: Set Up Supabase Database Schema
-- Migration: Create all enums and tables

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE report_category AS ENUM ('infrastructure', 'cleanliness', 'safety', 'facilities', 'other');

CREATE TYPE report_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'closed');

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE badge_type AS ENUM ('spotter', 'kampung_hero', 'closer');

CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold');

CREATE TYPE vote_type AS ENUM ('confirmed', 'not_yet');

CREATE TYPE notification_type AS ENUM ('status_change', 'new_comment', 'confirmation_request', 'badge_earned', 'report_followed');

-- ============================================
-- TABLES
-- ============================================

-- users: synced from Supabase Auth
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  is_banned BOOLEAN DEFAULT FALSE,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 2000),
  category report_category NOT NULL,
  status report_status DEFAULT 'open',
  photo_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  area_name TEXT,
  follower_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  comments_locked BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- confirmations
CREATE TABLE confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote vote_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type badge_type NOT NULL,
  tier badge_tier NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, type, tier)
);

-- notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- flags
CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (char_length(reason) <= 500),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- point_events
CREATE TABLE point_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- Indexes for reports table
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_is_hidden ON reports(is_hidden);

-- Indexes for comments table
CREATE INDEX idx_comments_report_id ON comments(report_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Indexes for follows table
CREATE INDEX idx_follows_report_id ON follows(report_id);
CREATE INDEX idx_follows_user_id ON follows(user_id);

-- Indexes for confirmations table
CREATE INDEX idx_confirmations_report_id ON confirmations(report_id);
CREATE INDEX idx_confirmations_user_id ON confirmations(user_id);
CREATE INDEX idx_confirmations_vote ON confirmations(vote);

-- Indexes for badges table
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_badges_type ON badges(type);
CREATE INDEX idx_badges_tier ON badges(tier);

-- Indexes for notifications table
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Indexes for flags table
CREATE INDEX idx_flags_report_id ON flags(report_id);
CREATE INDEX idx_flags_user_id ON flags(user_id);

-- Indexes for point_events table
CREATE INDEX idx_point_events_user_id ON point_events(user_id);
CREATE INDEX idx_point_events_report_id ON point_events(report_id);
CREATE INDEX idx_point_events_created_at ON point_events(created_at DESC);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_total_points ON users(total_points DESC);
CREATE INDEX idx_users_is_banned ON users(is_banned);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
