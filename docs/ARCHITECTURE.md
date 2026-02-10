
# LaporLah — Architecture Document

## Document Context
This architecture document serves as the technical blueprint for LaporLah,
a mobile-first PWA for community issue reporting. It is derived from the
Project Brief and Design System Specification documents and should be
treated as the single source of truth for all implementation decisions.

App Name: LaporLah
Tagline: "Komuniti Pantau, Komuniti Baiki"
Timeline: 3-day MVP sprint

---

## 1. System Architecture Overview

### Architecture Pattern
- **Monolithic Next.js application** (App Router) deployed to Vercel
- **No separate backend service** — all API logic lives in Next.js 
  Server Actions and Route Handlers
- **Supabase as Backend-as-a-Service** — handles database, auth, 
  file storage, and realtime subscriptions
- **Edge-first rendering** — use React Server Components (RSC) by 
  default, client components only when interactivity is required

### High-Level Data Flow

┌─────────────────────────────────────────────────────────┐
│ Client (Browser/PWA) │
│ ┌──────────┐ ┌──────────┐ ┌────────────────────────┐ │
│ │ RSC Pages│ │ Client │ │ Serwist Service Worker │ │
│ │ (Feed, │ │Components│ │ (Cache, Offline Shell) │ │
│ │ Detail, │ │(Forms, │ │ │ │
│ │ Profile) │ │Votes,Map)│ │ │ │
│ └────┬─────┘ └────┬─────┘ └────────────────────────┘ │
│ │ │ │
└───────┼──────────────┼────────────────────────────────────┘
│ │
│ Server Actions / Route Handlers
▼ ▼
┌─────────────────────────────────────────────────────────┐
│ Next.js Server (Vercel) │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Server Actions Layer │ │
│ │ - createReport() - addComment() │ │
│ │ - updateStatus() - toggleFollow() │ │
│ │ - castVote() - flagContent() │ │
│ │ - checkBadges() - adminActions() │ │
│ └──────────────────────┬───────────────────────────┘ │
│ │ │
└──────────────────────────┼───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ Supabase Platform │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │
│ │ Postgres │ │ Auth │ │ Storage │ │ Realtime │ │
│ │ Database │ │ (Google │ │ (Photos) │ │(Notif sub)│ │
│ │ + RLS │ │ OAuth) │ │ │ │ │ │
│ └──────────┘ └──────────┘ └──────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────┘
│
▼ (reverse geocode only)
┌─────────────────────────────────────────────────────────┐
│ External: Nominatim API (OSM) │
│ + OpenStreetMap Tile Server │
└─────────────────────────────────────────────────────────┘

text

---

## 2. Project Structure

laporlah/
├── public/
│ ├── manifest.json # PWA manifest
│ ├── icons/ # PWA icons (192, 512)
│ └── images/ # Static assets (empty states, logo)
│
├── src/
│ ├── app/
│ │ ├── layout.tsx # Root layout (fonts, themes, nav)
│ │ ├── page.tsx # Home feed (RSC)
│ │ ├── sw.ts # Serwist service worker entry
│ │ ├── manifest.ts # Dynamic manifest (next/metadata)
│ │ │
│ │ ├── auth/
│ │ │ └── callback/
│ │ │ └── route.ts # Supabase OAuth callback handler
│ │ │
│ │ ├── login/
│ │ │ └── page.tsx # Login page (Google sign-in)
│ │ │
│ │ ├── report/
│ │ │ ├── new/
│ │ │ │ └── page.tsx # Create report form (Client)
│ │ │ └── [id]/
│ │ │ └── page.tsx # Report detail (RSC + Client islands)
│ │ │
│ │ ├── profile/
│ │ │ ├── page.tsx # Own profile (RSC)
│ │ │ └── [id]/
│ │ │ └── page.tsx # Public profile view (RSC)
│ │ │
│ │ ├── notifications/
│ │ │ └── page.tsx # Notifications list (RSC)
│ │ │
│ │ ├── followed/
│ │ │ └── page.tsx # Followed reports feed (RSC)
│ │ │
│ │ ├── admin/
│ │ │ ├── page.tsx # Admin dashboard (RSC)
│ │ │ ├── layout.tsx # Admin layout with role guard
│ │ │ ├── flagged/
│ │ │ │ └── page.tsx # Flagged items view
│ │ │ └── users/
│ │ │ └── page.tsx # User management
│ │ │
│ │ └── api/ # Route Handlers (if needed beyond server actions)
│ │ └── cron/
│ │ └── route.ts # Optional: Vercel cron for confirmation timeout
│ │
│ ├── components/
│ │ ├── ui/ # shadcn/ui primitives (button, card, etc.)
│ │ ├── layout/
│ │ │ ├── bottom-nav.tsx # Mobile bottom navigation
│ │ │ ├── top-nav.tsx # Desktop top navigation
│ │ │ ├── nav-wrapper.tsx # Responsive nav switcher
│ │ │ └── theme-toggle.tsx # Dark/light mode toggle
│ │ ├── reports/
│ │ │ ├── report-card.tsx # Feed card component
│ │ │ ├── report-feed.tsx # Feed list with filters
│ │ │ ├── report-form.tsx # Create/edit report form
│ │ │ ├── status-stepper.tsx # Visual status progress bar
│ │ │ ├── status-pill.tsx # Status badge pill
│ │ │ ├── category-tag.tsx # Category badge tag
│ │ │ └── photo-upload.tsx # Photo capture + compression
│ │ ├── comments/
│ │ │ ├── comment-list.tsx # Comment thread
│ │ │ ├── comment-bubble.tsx # Single comment
│ │ │ └── comment-form.tsx # New comment input
│ │ ├── confirmation/
│ │ │ ├── vote-panel.tsx # Confirmation voting UI
│ │ │ └── countdown.tsx # 72h countdown timer
│ │ ├── gamification/
│ │ │ ├── badge-card.tsx # Badge display with tier + progress
│ │ │ ├── badge-unlock.tsx # Badge unlock animation/toast
│ │ │ ├── points-display.tsx # Points counter (mono font)
│ │ │ └── streak-display.tsx # Weekly streak indicator
│ │ ├── profile/
│ │ │ ├── civic-card.tsx # Profile header card
│ │ │ ├── activity-feed.tsx # Recent activity list
│ │ │ └── stats-grid.tsx # Points/reports/comments grid
│ │ ├── map/
│ │ │ ├── location-picker.tsx # Map for report creation (Client)
│ │ │ └── location-display.tsx# Static map pin for detail view
│ │ ├── notifications/
│ │ │ ├── notification-bell.tsx # Bell icon with badge counter
│ │ │ └── notification-item.tsx # Single notification row
│ │ └── shared/
│ │ ├── empty-state.tsx # Reusable empty state component
│ │ ├── loading-skeleton.tsx # Shimmer skeleton variants
│ │ ├── flag-button.tsx # Flag/report content button
│ │ └── follow-button.tsx # Follow/unfollow toggle
│ │
│ ├── lib/
│ │ ├── supabase/
│ │ │ ├── client.ts # Browser Supabase client
│ │ │ ├── server.ts # Server-side Supabase client (cookies)
│ │ │ ├── admin.ts # Service role client (admin ops)
│ │ │ └── middleware.ts # Auth session refresh middleware
│ │ ├── actions/
│ │ │ ├── reports.ts # Server Actions: CRUD reports
│ │ │ ├── comments.ts # Server Actions: CRUD comments
│ │ │ ├── follows.ts # Server Actions: follow/unfollow
│ │ │ ├── votes.ts # Server Actions: confirmation votes
│ │ │ ├── notifications.ts # Server Actions: mark read, fetch
│ │ │ ├── gamification.ts # Server Actions: points + badges
│ │ │ ├── flags.ts # Server Actions: flag content
│ │ │ └── admin.ts # Server Actions: admin operations
│ │ ├── utils/
│ │ │ ├── image-compression.ts # browser-image-compression wrapper
│ │ │ ├── geocoding.ts # Nominatim reverse geocode helper
│ │ │ ├── date.ts # Relative time formatting
│ │ │ ├── points.ts # Points calculation constants
│ │ │ └── cn.ts # clsx + twMerge utility
│ │ ├── hooks/
│ │ │ ├── use-geolocation.ts # Browser geolocation hook
│ │ │ ├── use-realtime.ts # Supabase realtime subscription hook
│ │ │ └── use-auth.ts # Auth state hook
│ │ ├── constants/
│ │ │ ├── categories.ts # Category definitions (EN/BM labels)
│ │ │ ├── statuses.ts # Status definitions + config
│ │ │ ├── badges.ts # Badge definitions + thresholds
│ │ │ └── points.ts # Points-per-action mapping
│ │ └── types/
│ │ ├── database.ts # Supabase generated types
│ │ └── index.ts # App-level type definitions
│ │
│ ├── middleware.ts # Next.js middleware (auth refresh)
│ └── styles/
│ └── globals.css # Tailwind directives + CSS tokens
│
├── scripts/
│ └── seed.ts # Database seed script (demo data)
│
├── supabase/
│ └── migrations/ # SQL migration files
│ ├── 001_create_tables.sql
│ ├── 002_create_rls_policies.sql
│ ├── 003_create_functions.sql # check_badges, award_points
│ └── 004_seed_data.sql
│
├── next.config.ts # Next.js config + Serwist wrapper
├── tailwind.config.ts # Tailwind config (if needed beyond CSS)
├── tsconfig.json # TypeScript config
├── .env.local.example # Environment variables template
├── package.json
└── README.md

text

---

## 3. Database Architecture

### Entity Relationship Diagram

┌──────────┐ ┌──────────────┐ ┌───────────┐
│ users │────<│ reports │────<│ comments │
│ │ │ │ │ │
│ id (PK) │ │ id (PK) │ │ id (PK) │
│ google_id│ │ user_id (FK) │ │ report_id │
│ email │ │ title │ │ user_id │
│ name │ │ description │ │ content │
│ avatar │ │ category │ │ created_at│
│ points │ │ photo_url │ └───────────┘
│ role │ │ lat, lng │
│ streak │ │ area_name │ ┌───────────┐
│ last_wk │ │ status │────<│ follows │
│ is_banned│ │ is_hidden │ │ │
│ created │ │ cmts_locked │ │ id (PK) │
└──────────┘ │ resolved_at │ │ user_id │
│ │ created_at │ │ report_id │
│ │ updated_at │ │ created_at│
│ └──────────────┘ └───────────┘
│ │
│ │ ┌──────────────┐
│ └─────────────<│confirmations │
│ │ │
│ │ id (PK) │
│ │ report_id │
│ │ user_id │
│ │ vote (enum) │
│ │ created_at │
│ └──────────────┘
│
├────<┌──────────────┐
│ │ badges │
│ │ id (PK) │
│ │ user_id (FK) │
│ │ badge_type │
│ │ tier │
│ │ awarded_at │
│ └──────────────┘
│
├────<┌──────────────┐
│ │notifications │
│ │ id (PK) │
│ │ user_id (FK) │
│ │ report_id │
│ │ type (enum) │
│ │ message │
│ │ is_read │
│ │ created_at │
│ └──────────────┘
│
├────<┌──────────────┐
│ │ flags │
│ │ id (PK) │
│ │ report_id │
│ │ comment_id │
│ │ user_id (FK) │
│ │ reason │
│ │ created_at │
│ └──────────────┘
│
└────<┌──────────────┐
│ point_events │
│ id (PK) │
│ user_id (FK) │
│ action │
│ points │
│ report_id │
│ created_at │
└──────────────┘

text

### Enum Definitions

```sql
CREATE TYPE report_category AS ENUM (
  'infrastructure', 'cleanliness', 'safety', 'facilities', 'other'
);

CREATE TYPE report_status AS ENUM (
  'open', 'acknowledged', 'in_progress', 'resolved', 'closed'
);

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE badge_type AS ENUM ('spotter', 'kampung_hero', 'closer');

CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold');

CREATE TYPE vote_type AS ENUM ('confirmed', 'not_yet');

CREATE TYPE notification_type AS ENUM (
  'status_change', 'new_comment', 'confirmation_request',
  'badge_earned', 'report_followed'
);
Table Definitions
sql
-- Users (synced from Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  google_id TEXT UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  role user_role DEFAULT 'user' NOT NULL,
  streak_count INTEGER DEFAULT 0 NOT NULL,
  last_active_week DATE,
  is_banned BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 2000),
  category report_category NOT NULL,
  photo_url TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  area_name TEXT,
  status report_status DEFAULT 'open' NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
  comments_locked BOOLEAN DEFAULT FALSE NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, report_id)
);

-- Confirmations (closure votes)
CREATE TABLE confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote vote_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, report_id)
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  tier badge_tier NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, badge_type)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Flags
CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (char_length(reason) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (report_id IS NOT NULL OR comment_id IS NOT NULL)
);

-- Point Events (audit trail)
CREATE TABLE point_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  points INTEGER NOT NULL,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
Indexes
sql
-- Performance indexes
CREATE INDEX idx_reports_status ON reports(status) WHERE is_hidden = FALSE;
CREATE INDEX idx_reports_category ON reports(category) WHERE is_hidden = FALSE;
CREATE INDEX idx_reports_created ON reports(created_at DESC) WHERE is_hidden = FALSE;
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_location ON reports(lat, lng);
CREATE INDEX idx_comments_report ON comments(report_id, created_at);
CREATE INDEX idx_follows_user ON follows(user_id);
CREATE INDEX idx_follows_report ON follows(report_id);
CREATE INDEX idx_confirmations_report ON confirmations(report_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read)
  WHERE is_read = FALSE;
CREATE INDEX idx_flags_report ON flags(report_id);
CREATE INDEX idx_point_events_user ON point_events(user_id);
CREATE INDEX idx_badges_user ON badges(user_id);
Row Level Security Policies
sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_events ENABLE ROW LEVEL SECURITY;

-- USERS
CREATE POLICY "Users: public read" ON users
  FOR SELECT USING (TRUE);
CREATE POLICY "Users: update own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- REPORTS
CREATE POLICY "Reports: public read non-hidden" ON reports
  FOR SELECT USING (is_hidden = FALSE);
CREATE POLICY "Reports: admin read all" ON reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Reports: auth insert" ON reports
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_banned = TRUE)
  );
CREATE POLICY "Reports: creator or admin update" ON reports
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- COMMENTS
CREATE POLICY "Comments: public read" ON comments
  FOR SELECT USING (TRUE);
CREATE POLICY "Comments: auth insert if not locked" ON comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_banned = TRUE)
    AND NOT EXISTS (
      SELECT 1 FROM reports WHERE id = report_id AND comments_locked = TRUE
    )
  );

-- FOLLOWS
CREATE POLICY "Follows: public read" ON follows
  FOR SELECT USING (TRUE);
CREATE POLICY "Follows: auth manage own" ON follows
  FOR ALL USING (auth.uid() = user_id);

-- CONFIRMATIONS
CREATE POLICY "Confirmations: public read" ON confirmations
  FOR SELECT USING (TRUE);
CREATE POLICY "Confirmations: auth insert own" ON confirmations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- BADGES
CREATE POLICY "Badges: public read" ON badges
  FOR SELECT USING (TRUE);

-- NOTIFICATIONS
CREATE POLICY "Notifications: read own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications: update own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- FLAGS
CREATE POLICY "Flags: auth insert" ON flags
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Flags: admin read" ON flags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- POINT_EVENTS
CREATE POLICY "Point events: read own" ON point_events
  FOR SELECT USING (auth.uid() = user_id);
Database Functions
sql
-- Award points and update user total
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_action TEXT,
  p_points INTEGER,
  p_report_id UUID DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO point_events (user_id, action, points, report_id)
  VALUES (p_user_id, p_action, p_points, p_report_id);

  UPDATE users
  SET points = points + p_points
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check and award/upgrade badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(new_badge_type badge_type, new_tier badge_tier) AS $$
DECLARE
  v_report_count INTEGER;
  v_comment_count INTEGER;
  v_confirmed_count INTEGER;
  v_current_tier badge_tier;
  v_earned_tier badge_tier;
BEGIN
  -- Count reports
  SELECT count(*) INTO v_report_count
  FROM reports WHERE user_id = p_user_id AND is_hidden = FALSE;

  -- Count comments on OTHER people's reports
  SELECT count(*) INTO v_comment_count
  FROM comments c
  JOIN reports r ON r.id = c.report_id
  WHERE c.user_id = p_user_id AND r.user_id != p_user_id;

  -- Count confirmed resolutions (user proposed resolved, then confirmed)
  SELECT count(*) INTO v_confirmed_count
  FROM reports r
  WHERE r.status = 'closed'
  AND EXISTS (
    SELECT 1 FROM confirmations
    WHERE report_id = r.id AND vote = 'confirmed'
    GROUP BY report_id HAVING count(*) >= 3
  )
  AND EXISTS (
    SELECT 1 FROM comments c
    WHERE c.report_id = r.id AND c.user_id = p_user_id
  );

  -- SPOTTER badge
  v_earned_tier := CASE
    WHEN v_report_count >= 15 THEN 'gold'
    WHEN v_report_count >= 5  THEN 'silver'
    WHEN v_report_count >= 1  THEN 'bronze'
    ELSE NULL
  END;

  IF v_earned_tier IS NOT NULL THEN
    SELECT tier INTO v_current_tier FROM badges
    WHERE user_id = p_user_id AND badge_type = 'spotter';

    IF v_current_tier IS NULL THEN
      INSERT INTO badges (user_id, badge_type, tier)
      VALUES (p_user_id, 'spotter', v_earned_tier);
      new_badge_type := 'spotter'; new_tier := v_earned_tier;
      RETURN NEXT;
    ELSIF v_earned_tier > v_current_tier THEN
      UPDATE badges SET tier = v_earned_tier, awarded_at = NOW()
      WHERE user_id = p_user_id AND badge_type = 'spotter';
      new_badge_type := 'spotter'; new_tier := v_earned_tier;
      RETURN NEXT;
    END IF;
  END IF;

  -- KAMPUNG_HERO badge
  v_earned_tier := CASE
    WHEN v_comment_count >= 50 THEN 'gold'
    WHEN v_comment_count >= 15 THEN 'silver'
    WHEN v_comment_count >= 5  THEN 'bronze'
    ELSE NULL
  END;

  IF v_earned_tier IS NOT NULL THEN
    SELECT tier INTO v_current_tier FROM badges
    WHERE user_id = p_user_id AND badge_type = 'kampung_hero';

    IF v_current_tier IS NULL THEN
      INSERT INTO badges (user_id, badge_type, tier)
      VALUES (p_user_id, 'kampung_hero', v_earned_tier);
      new_badge_type := 'kampung_hero'; new_tier := v_earned_tier;
      RETURN NEXT;
    ELSIF v_earned_tier > v_current_tier THEN
      UPDATE badges SET tier = v_earned_tier, awarded_at = NOW()
      WHERE user_id = p_user_id AND badge_type = 'kampung_hero';
      new_badge_type := 'kampung_hero'; new_tier := v_earned_tier;
      RETURN NEXT;
    END IF;
  END IF;

  -- CLOSER badge
  v_earned_tier := CASE
    WHEN v_confirmed_count >= 15 THEN 'gold'
    WHEN v_confirmed_count >= 5  THEN 'silver'
    WHEN v_confirmed_count >= 2  THEN 'bronze'
    ELSE NULL
  END;

  IF v_earned_tier IS NOT NULL THEN
    SELECT tier INTO v_current_tier FROM badges
    WHERE user_id = p_user_id AND badge_type = 'closer';

    IF v_current_tier IS NULL THEN
      INSERT INTO badges (user_id, badge_type, tier)
      VALUES (p_user_id, 'closer', v_earned_tier);
      new_badge_type := 'closer'; new_tier := v_earned_tier;
      RETURN NEXT;
    ELSIF v_earned_tier > v_current_tier THEN
      UPDATE badges SET tier = v_earned_tier, awarded_at = NOW()
      WHERE user_id = p_user_id AND badge_type = 'closer';
      new_badge_type := 'closer'; new_tier := v_earned_tier;
      RETURN NEXT;
    END IF;
  END IF;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update streak on activity
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_current_week DATE;
  v_last_week DATE;
BEGIN
  v_current_week := date_trunc('week', NOW())::DATE;

  SELECT last_active_week INTO v_last_week
  FROM users WHERE id = p_user_id;

  IF v_last_week IS NULL OR v_last_week < v_current_week - INTERVAL '7 days' THEN
    -- Streak broken or first activity
    UPDATE users SET streak_count = 1, last_active_week = v_current_week
    WHERE id = p_user_id;
  ELSIF v_last_week < v_current_week THEN
    -- New week, streak continues
    UPDATE users SET streak_count = streak_count + 1,
      last_active_week = v_current_week
    WHERE id = p_user_id;
  END IF;
  -- Same week: no change needed
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notify followers of a report
CREATE OR REPLACE FUNCTION notify_followers(
  p_report_id UUID,
  p_type notification_type,
  p_message TEXT,
  p_exclude_user UUID DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, report_id, type, message)
  SELECT f.user_id, p_report_id, p_type, p_message
  FROM follows f
  WHERE f.report_id = p_report_id
  AND (p_exclude_user IS NULL OR f.user_id != p_exclude_user);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
4. Authentication Flow
text
User clicks "Sign in with Google"
         │
         ▼
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: '/auth/callback' }
})
         │
         ▼
Google OAuth consent screen
         │
         ▼
Redirect to /auth/callback?code=xxx
         │
         ▼
/auth/callback/route.ts:
  - Exchange code for session via supabase.auth.exchangeCodeForSession()
  - Check if user exists in public.users table
  - If new user: INSERT into users (id, google_id, email, name, avatar_url)
  - If existing: UPDATE name, avatar_url (in case Google profile changed)
  - Redirect to / (home feed)
         │
         ▼
Middleware (middleware.ts):
  - Runs on every request
  - Calls supabase.auth.getUser() to refresh session
  - Passes session to server components via cookies
Supabase Client Strategy
Context	Client	Auth Method
Server Components	createServerClient (cookies)	Reads session cookies
Server Actions	createServerClient (cookies)	Reads session cookies
Route Handlers	createServerClient (cookies)	Reads session cookies
Client Components	createBrowserClient (singleton)	Auto-manages session
Admin operations	createClient (service_role)	Bypasses RLS
Middleware	createServerClient (cookies)	Refreshes session
5. Core Feature Architecture
Report Creation Flow
text
User fills form (Client Component)
         │
         ├── Photo selected?
         │   ├── Yes: Validate ≤5MB → compress via browser-image-compression
         │   │   (maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true)
         │   │   → Upload to Supabase Storage bucket "report-photos"
         │   │   → Get public URL
         │   └── No: skip
         │
         ├── Geolocation: navigator.geolocation.getCurrentPosition()
         │   → Store lat/lng
         │   → Reverse geocode via Nominatim:
         │     GET https://nominatim.openstreetmap.org/reverse?lat=X&lon=Y&format=json
         │     → Extract display_name → store as area_name
         │
         ▼
Server Action: createReport()
  - Validate inputs (zod schema)
  - Check user not banned
  - INSERT into reports table
  - INSERT into follows (auto-follow creator)
  - Call award_points(user_id, 'report_created', 10, report_id)
  - Call update_streak(user_id)
  - Call check_and_award_badges(user_id)
  - revalidatePath('/') to refresh feed
  - Return report ID → redirect to /report/[id]
Status Update Flow
text
Status change requested
         │
         ├── Forward progression (Open → Ack'd → In Progress):
         │   - Only creator or admin
         │   - UPDATE reports SET status = new_status
         │   - Call notify_followers(report_id, 'status_change', message)
         │
         ├── Propose "Resolved":
         │   - Any authenticated user
         │   - UPDATE reports SET status = 'resolved', resolved_at = NOW()
         │   - Call notify_followers(report_id, 'confirmation_request', message)
         │   - 72-hour confirmation window begins (based on resolved_at)
         │
         └── Confirmation voting:
             - Users vote: confirmed / not_yet
             - INSERT into confirmations
             - Call award_points(voter_id, 'confirmation_vote', 8)
             - Check resolution logic (on every vote AND on page load):
               │
               ├── ≥3 "confirmed" votes → status = 'closed'
               │   - Award 25 pts to report creator
               │   - Award 15 pts to user who proposed resolution
               │   - Call check_and_award_badges for both
               │   - Call notify_followers('status_change', 'Report verified!')
               │
               ├── Majority "not_yet" → revert to 'in_progress'
               │   - Clear resolved_at
               │   - Call notify_followers('status_change', 'Community disputed')
               │
               └── 72h expired (check on page load):
                   ├── ≥1 confirmed, 0 not_yet → auto-close
                   └── 0 votes → revert to 'in_progress'
Notification Delivery
text
Trigger event (status change, new comment, confirmation request)
         │
         ▼
Server Action calls notify_followers() (DB function)
  - Bulk INSERT into notifications table for all followers
  - Exclude the user who triggered the event
         │
         ▼
Client: notification-bell.tsx
  - Supabase Realtime subscription on notifications table
    filtered by user_id
  - On INSERT event: increment badge counter, show toast
  - On bell click: navigate to /notifications
  - On notification click: mark as read, navigate to report
6. PWA Configuration
Serwist Setup
typescript
// next.config.ts
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist({
  // Next.js config
});
typescript
// src/app/sw.ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
Caching Strategy
Precache: App shell (HTML, CSS, JS bundles, fonts, icons)

Runtime cache (via defaultCache):

Pages: NetworkFirst (serve fresh, fallback to cache)

Images: CacheFirst with 30-day expiration

API/Server Actions: NetworkOnly (no caching of mutations)

Static assets: CacheFirst

Offline fallback: Cached app shell renders; data sections show
"You're offline" empty state

Manifest
json
{
  "name": "LaporLah",
  "short_name": "LaporLah",
  "description": "Komuniti Pantau, Komuniti Baiki",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0C0D12",
  "theme_color": "#10B981",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512",
      "type": "image/png", "purpose": "maskable" }
  ]
}
7. API Design — Server Actions
All mutations are implemented as Next.js Server Actions (not REST endpoints).
Server Actions provide type safety, automatic revalidation, and work with
progressive enhancement.

Reports
typescript
// lib/actions/reports.ts
'use server'

createReport(formData: FormData): Promise<{ id: string } | { error: string }>
updateReportStatus(reportId: string, newStatus: ReportStatus): Promise<void>
hideReport(reportId: string): Promise<void>        // admin only
unhideReport(reportId: string): Promise<void>      // admin only
lockComments(reportId: string): Promise<void>       // admin only
unlockComments(reportId: string): Promise<void>     // admin only
Comments
typescript
// lib/actions/comments.ts
'use server'

addComment(reportId: string, content: string): Promise<{ id: string } | { error: string }>
Follows
typescript
// lib/actions/follows.ts
'use server'

toggleFollow(reportId: string): Promise<{ followed: boolean }>
Votes
typescript
// lib/actions/votes.ts
'use server'

castVote(reportId: string, vote: 'confirmed' | 'not_yet'): Promise<void>
checkResolution(reportId: string): Promise<void>  // called on page load
Gamification
typescript
// lib/actions/gamification.ts
'use server'

// Called internally by other actions, not directly from client
awardPointsAction(userId: string, action: string, points: number, reportId?: string): Promise<void>
checkBadgesAction(userId: string): Promise<NewBadge[] | null>
updateStreakAction(userId: string): Promise<void>
Flags
typescript
// lib/actions/flags.ts
'use server'

flagReport(reportId: string, reason: string): Promise<void>
flagComment(commentId: string, reason: string): Promise<void>
Admin
typescript
// lib/actions/admin.ts
'use server'

banUser(userId: string): Promise<void>
unbanUser(userId: string): Promise<void>
getAdminStats(): Promise<AdminStats>
getFlaggedItems(): Promise<FlaggedItem[]>
8. Validation Schemas (Zod)
typescript
// lib/types/schemas.ts
import { z } from 'zod';

export const createReportSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  category: z.enum(['infrastructure', 'cleanliness', 'safety', 'facilities', 'other']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  area_name: z.string().optional(),
  photo_url: z.string().url().optional(),
});

export const addCommentSchema = z.object({
  report_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
});

export const flagSchema = z.object({
  reason: z.string().min(5).max(500),
});
9. Key Technical Decisions & Patterns
Server vs Client Component Split
Component	Server	Client	Why
Feed page	✅		Data fetch, SEO, fast initial load
Report card	✅		Pure display
Filter dropdowns		✅	User interaction, URL params
Report detail	✅		Data fetch + client islands below
Status stepper		✅	Animation, pulse effect
Comment form		✅	Form state, optimistic updates
Comment list	✅		Data fetch
Follow button		✅	Toggle state, optimistic update
Vote panel		✅	Interactive voting
Photo upload		✅	File handling, compression
Map (location picker)		✅	Leaflet requires window (ssr: false)
Map (display)		✅	Leaflet requires window (ssr: false)
Notification bell		✅	Realtime subscription
Profile page	✅		Data fetch
Badge cards	✅		Pure display
Admin dashboard	✅		Data fetch + client action buttons
Leaflet SSR Handling
typescript
// components/map/location-display.tsx
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./map-inner'), {
  ssr: false,
  loading: () => <div className="skeleton h-[180px] w-full rounded-lg" />,
});
Image Compression Utility
typescript
// lib/utils/image-compression.ts
import imageCompression from 'browser-image-compression';

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

export async function compressImage(file: File): Promise<File> {
  if (file.size > MAX_INPUT_SIZE) {
    throw new Error('Image must be under 5MB');
  }

  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  });
}
Nominatim Rate Limiting
typescript
// lib/utils/geocoding.ts
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16`,
    {
      headers: { 'User-Agent': 'LaporLah/1.0' }, // Required by Nominatim ToS
    }
  );
  const data = await res.json();
  // Extract suburb/city level, not full address
  return data.address?.suburb
    || data.address?.city_district
    || data.address?.city
    || data.display_name?.split(',').slice(0, 2).join(',')
    || 'Unknown location';
}
Confirmation Timeout Check (No Cron Needed)
typescript
// Called in report detail page server component
export async function checkResolutionTimeout(report: Report) {
  if (report.status !== 'resolved' || !report.resolved_at) return;

  const elapsed = Date.now() - new Date(report.resolved_at).getTime();
  const TIMEOUT = 72 * 60 * 60 * 1000; // 72 hours

  if (elapsed < TIMEOUT) return; // Still within window

  const { data: votes } = await supabase
    .from('confirmations')
    .select('vote')
    .eq('report_id', report.id);

  const confirmed = votes?.filter(v => v.vote === 'confirmed').length || 0;
  const notYet = votes?.filter(v => v.vote === 'not_yet').length || 0;

  if (confirmed >= 1 && notYet === 0) {
    // Auto-close
    await supabase.from('reports')
      .update({ status: 'closed' })
      .eq('id', report.id);
  } else {
    // Revert
    await supabase.from('reports')
      .update({ status: 'in_progress', resolved_at: null })
      .eq('id', report.id);
  }
}
10. Environment Variables
bash
# .env.local.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx

# App
NEXT_PUBLIC_APP_URL=https://laporlah.vercel.app
NEXT_PUBLIC_APP_NAME=LaporLah

# Admin (your Google UID from Supabase Auth dashboard)
ADMIN_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
11. Deployment Configuration
Vercel Settings
Framework: Next.js (auto-detected)

Build command: next build

Output directory: .next

Node.js version: 20.x

Environment variables: set via Vercel dashboard

Supabase Setup
Region: Southeast Asia (Singapore) for lowest latency

Enable Google OAuth provider

Create Storage bucket "report-photos" (public read)

Run migration files in order via Supabase SQL editor

Set admin user role via SQL:
UPDATE users SET role = 'admin' WHERE id = 'your-uid';

Storage Bucket Policy
sql
-- Allow public read for report photos
CREATE POLICY "Public read report photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-photos');

-- Allow authenticated users to upload
CREATE POLICY "Auth users upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report-photos'
  AND auth.role() = 'authenticated'
);
12. Performance Targets
Metric	Target	Strategy
Lighthouse Performance	> 90	RSC, image compression, caching
Lighthouse PWA	100	Serwist + manifest + HTTPS
First Contentful Paint	< 1.5s	RSC streaming, no client waterfalls
Largest Contentful Paint	< 2.5s	Optimized images, edge CDN
Time to Interactive	< 3s	Minimal client JS, code splitting
Bundle size (JS)	< 150KB	Tree shaking, dynamic imports
13. Testing Strategy (MVP-Appropriate)
Given the 3-day timeline, focus on:

Manual smoke testing of the full judge flow (sign in → create →
feed → detail → comment → follow → resolve → confirm → badge)

Zod validation catches input errors at the server action boundary

RLS policies act as a security test layer

TypeScript strict mode prevents type-related bugs

No unit tests or E2E tests for MVP — time is better spent on features

14. Constraints & Boundaries
In Scope
All must-have features from the Project Brief

Flag button (from nice-to-haves — minimal effort, high admin value)

Rate limit: 5 reports/user/day (simple count check in server action)

Dark/light mode toggle

Out of Scope (MVP)
Push notifications (VAPID/FCM)

Email notifications

Offline report creation (IndexedDB sync)

Full i18n framework

Unit/E2E tests

Search by keyword

Nearby filter

Duplicate report handling

Real-time collaborative editing

Image gallery (multiple photos per report)

Report editing after creation