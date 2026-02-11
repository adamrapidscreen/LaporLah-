-- E1-S2: Set Up Supabase Database Schema
-- Migration: Create PostgreSQL functions for gamification system

-- ============================================
-- AWARD POINTS FUNCTION
-- ============================================

-- Function to award points to a user for various actions
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_action TEXT,
  p_points INTEGER,
  p_report_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert point event record
  INSERT INTO point_events (user_id, report_id, action, points)
  VALUES (p_user_id, p_report_id, p_action, p_points);

  -- Update user's total points
  UPDATE users
  SET total_points = total_points + p_points
  WHERE id = p_user_id;

  -- Check if user qualifies for any badges after earning points
  PERFORM check_and_award_badges(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CHECK AND AWARD BADGES FUNCTION
-- ============================================

-- Function to check and award badges based on user activity
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_points INTEGER;
  v_reports_created INTEGER;
  v_reports_resolved INTEGER;
  v_confirmations_given INTEGER;
BEGIN
  -- Get user's current stats
  SELECT
    total_points,
    (SELECT COUNT(*) FROM reports WHERE user_id = p_user_id),
    (SELECT COUNT(*) FROM reports WHERE resolved_by = p_user_id),
    (SELECT COUNT(*) FROM confirmations WHERE user_id = p_user_id)
  INTO v_total_points, v_reports_created, v_reports_resolved, v_confirmations_given
  FROM users
  WHERE id = p_user_id;

  -- SPOTTER BADGES (based on reports created)
  -- Bronze: 5 reports
  IF v_reports_created >= 5 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'spotter', 'bronze')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- Silver: 25 reports
  IF v_reports_created >= 25 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'spotter', 'silver')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- Gold: 100 reports
  IF v_reports_created >= 100 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'spotter', 'gold')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- KAMPUNG HERO BADGES (based on total points)
  -- Bronze: 100 points
  IF v_total_points >= 100 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'kampung_hero', 'bronze')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- Silver: 500 points
  IF v_total_points >= 500 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'kampung_hero', 'silver')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- Gold: 2000 points
  IF v_total_points >= 2000 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'kampung_hero', 'gold')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- CLOSER BADGES (based on reports resolved)
  -- Bronze: 5 reports resolved
  IF v_reports_resolved >= 5 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'closer', 'bronze')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- Silver: 25 reports resolved
  IF v_reports_resolved >= 25 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'closer', 'silver')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;

  -- Gold: 100 reports resolved
  IF v_reports_resolved >= 100 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'closer', 'gold')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UPDATE STREAK FUNCTION
-- ============================================

-- Function to update user's activity streak
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_last_active_date DATE;
  v_current_date DATE := CURRENT_DATE;
BEGIN
  -- Get user's last active date
  SELECT last_active_date INTO v_last_active_date
  FROM users
  WHERE id = p_user_id;

  -- If no previous activity, start streak at 1
  IF v_last_active_date IS NULL THEN
    UPDATE users
    SET
      current_streak = 1,
      longest_streak = GREATEST(longest_streak, 1),
      last_active_date = v_current_date
    WHERE id = p_user_id;
  -- If last active was yesterday, increment streak
  ELSIF v_last_active_date = v_current_date - INTERVAL '1 day' THEN
    UPDATE users
    SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_active_date = v_current_date
    WHERE id = p_user_id;
  -- If last active was today, do nothing (already active today)
  ELSIF v_last_active_date = v_current_date THEN
    -- No update needed
    NULL;
  -- Otherwise, reset streak to 1
  ELSE
    UPDATE users
    SET
      current_streak = 1,
      last_active_date = v_current_date
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTIFY FOLLOWERS FUNCTION
-- ============================================

-- Function to notify all followers of a report
CREATE OR REPLACE FUNCTION notify_followers(
  p_report_id UUID,
  p_notification_type notification_type,
  p_actor_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Create notifications for all followers of the report
  INSERT INTO notifications (user_id, report_id, type, actor_id)
  SELECT
    f.user_id,
    p_report_id,
    p_notification_type,
    p_actor_id
  FROM follows f
  WHERE f.report_id = p_report_id
    AND f.user_id != p_actor_id; -- Don't notify the actor themselves
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: GET REPORT CREATOR
-- ============================================

-- Helper function to get the creator of a report
CREATE OR REPLACE FUNCTION get_report_creator(p_report_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT user_id FROM reports WHERE id = p_report_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: INCREMENT FOLLOWER COUNT
-- ============================================

-- Helper function to increment a report's follower count
CREATE OR REPLACE FUNCTION increment_follower_count(p_report_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE reports
  SET follower_count = follower_count + 1
  WHERE id = p_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to decrement a report's follower count
CREATE OR REPLACE FUNCTION decrement_follower_count(p_report_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE reports
  SET follower_count = GREATEST(follower_count - 1, 0)
  WHERE id = p_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: AUTO-NOTIFY ON STATUS CHANGE
-- ============================================

-- Function to trigger notification when report status changes
CREATE OR REPLACE FUNCTION notify_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM notify_followers(NEW.id, 'status_change', NEW.resolved_by);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to reports table
CREATE TRIGGER trigger_notify_on_status_change
  AFTER UPDATE OF status ON reports
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_status_change();

-- ============================================
-- TRIGGER: AUTO-NOTIFY ON NEW COMMENT
-- ============================================

-- Function to trigger notification when new comment is added
CREATE OR REPLACE FUNCTION notify_on_new_comment()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify the report creator (if not the commenter)
  IF (SELECT user_id FROM reports WHERE id = NEW.report_id) != NEW.user_id THEN
    INSERT INTO notifications (user_id, report_id, type, actor_id)
    VALUES (
      (SELECT user_id FROM reports WHERE id = NEW.report_id),
      NEW.report_id,
      'new_comment',
      NEW.user_id
    );
  END IF;

  -- Notify all followers
  PERFORM notify_followers(NEW.report_id, 'new_comment', NEW.user_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to comments table
CREATE TRIGGER trigger_notify_on_new_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_new_comment();

-- ============================================
-- TRIGGER: AUTO-NOTIFY ON FOLLOW
-- ============================================

-- Function to trigger notification when someone follows a report
CREATE OR REPLACE FUNCTION notify_on_follow()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify the report creator (if not the follower)
  IF (SELECT user_id FROM reports WHERE id = NEW.report_id) != NEW.user_id THEN
    INSERT INTO notifications (user_id, report_id, type, actor_id)
    VALUES (
      (SELECT user_id FROM reports WHERE id = NEW.report_id),
      NEW.report_id,
      'report_followed',
      NEW.user_id
    );
  END IF;

  -- Increment follower count
  PERFORM increment_follower_count(NEW.report_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to follows table
CREATE TRIGGER trigger_notify_on_follow
  AFTER INSERT ON follows
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_follow();

-- Function to handle unfollow (decrement count)
CREATE OR REPLACE FUNCTION handle_unfollow()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement follower count
  PERFORM decrement_follower_count(OLD.report_id);

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to follows table for delete
CREATE TRIGGER trigger_handle_unfollow
  AFTER DELETE ON follows
  FOR EACH ROW
  EXECUTE FUNCTION handle_unfollow();
