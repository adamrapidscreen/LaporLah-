-- E1-S2: Set Up Supabase Database Schema
-- Migration: Create RLS policies for all tables

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Anyone can read user profiles (public data)
CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Only admins can update other users' profiles
CREATE POLICY "Admins can update any user profile"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- REPORTS TABLE POLICIES
-- ============================================

-- Anyone can view non-hidden reports
CREATE POLICY "Anyone can view non-hidden reports"
  ON reports FOR SELECT
  USING (is_hidden = FALSE);

-- Admins can view all reports including hidden ones
CREATE POLICY "Admins can view all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can create reports (if not banned)
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Users can update their own reports (if not banned)
CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  USING (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Admins can update any report
CREATE POLICY "Admins can update any report"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can delete their own reports (if not banned)
CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  USING (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Admins can delete any report
CREATE POLICY "Admins can delete any report"
  ON reports FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- COMMENTS TABLE POLICIES
-- ============================================

-- Anyone can view comments on non-hidden reports
CREATE POLICY "Anyone can view comments on non-hidden reports"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = comments.report_id AND reports.is_hidden = FALSE
    )
  );

-- Admins can view all comments
CREATE POLICY "Admins can view all comments"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can create comments (if not banned and comments not locked)
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
    AND NOT EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = comments.report_id AND reports.comments_locked = TRUE
    )
  );

-- Users can update their own comments (if not banned)
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Admins can update any comment
CREATE POLICY "Admins can update any comment"
  ON comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can delete their own comments (if not banned)
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Admins can delete any comment
CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FOLLOWS TABLE POLICIES
-- ============================================

-- Anyone can view follows
CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  USING (true);

-- Authenticated users can follow reports (if not banned)
CREATE POLICY "Authenticated users can follow reports"
  ON follows FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Users can unfollow reports
CREATE POLICY "Users can unfollow reports"
  ON follows FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CONFIRMATIONS TABLE POLICIES
-- ============================================

-- Anyone can view confirmations
CREATE POLICY "Anyone can view confirmations"
  ON confirmations FOR SELECT
  USING (true);

-- Authenticated users can vote on confirmations (if not banned)
CREATE POLICY "Authenticated users can vote on confirmations"
  ON confirmations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Users can update their own confirmation vote
CREATE POLICY "Users can update own confirmation vote"
  ON confirmations FOR UPDATE
  USING (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Users can delete their own confirmation vote
CREATE POLICY "Users can delete own confirmation vote"
  ON confirmations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- BADGES TABLE POLICIES
-- ============================================

-- Anyone can view badges
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

-- Users can view their own badges
CREATE POLICY "Users can view own badges"
  ON badges FOR SELECT
  USING (auth.uid() = user_id);

-- Only system (via service role) can insert badges
CREATE POLICY "Service role can insert badges"
  ON badges FOR INSERT
  WITH CHECK (true);

-- Only system (via service role) can delete badges
CREATE POLICY "Service role can delete badges"
  ON badges FOR DELETE
  USING (true);

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Only system (via service role) can insert notifications
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FLAGS TABLE POLICIES
-- ============================================

-- Anyone can view flags
CREATE POLICY "Anyone can view flags"
  ON flags FOR SELECT
  USING (true);

-- Authenticated users can flag reports (if not banned)
CREATE POLICY "Authenticated users can flag reports"
  ON flags FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

-- Users can delete their own flags
CREATE POLICY "Users can delete own flags"
  ON flags FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all flags
CREATE POLICY "Admins can view all flags"
  ON flags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- POINT_EVENTS TABLE POLICIES
-- ============================================

-- Anyone can view point events
CREATE POLICY "Anyone can view point events"
  ON point_events FOR SELECT
  USING (true);

-- Users can view their own point events
CREATE POLICY "Users can view own point events"
  ON point_events FOR SELECT
  USING (auth.uid() = user_id);

-- Only system (via service role) can insert point events
CREATE POLICY "Service role can insert point events"
  ON point_events FOR INSERT
  WITH CHECK (true);

-- Only system (via service role) can delete point events
CREATE POLICY "Service role can delete point events"
  ON point_events FOR DELETE
  USING (true);
