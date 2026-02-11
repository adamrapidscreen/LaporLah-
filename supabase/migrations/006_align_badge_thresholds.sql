-- Migration: Align badge thresholds with frontend and fix metrics
-- Updates check_and_award_badges to:
-- 1. Use correct thresholds from BADGE_DEFINITIONS
-- 2. Use correct metrics (Kampung Hero = comments on others' reports, Closer = confirmed votes)
-- 3. Return newly awarded badges for frontend toast notifications

-- Drop existing function
DROP FUNCTION IF EXISTS check_and_award_badges(UUID);

-- Recreate with correct logic and return type
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(new_badge_type TEXT, new_tier TEXT) AS $$
DECLARE
  v_reports_created INTEGER;
  v_comments_on_others INTEGER;
  v_confirmed_votes INTEGER;
  v_user_report_ids UUID[];
BEGIN
  -- Get user's reports for filtering comments
  SELECT ARRAY_AGG(id) INTO v_user_report_ids
  FROM reports
  WHERE user_id = p_user_id;

  -- Count reports created by user
  SELECT COUNT(*) INTO v_reports_created
  FROM reports
  WHERE user_id = p_user_id;

  -- Count comments on OTHER users' reports (not their own)
  SELECT COUNT(*) INTO v_comments_on_others
  FROM comments c
  WHERE c.user_id = p_user_id
    AND (v_user_report_ids IS NULL OR c.report_id != ALL(v_user_report_ids));

  -- Count confirmed votes (confirmations with vote = 'confirmed')
  SELECT COUNT(*) INTO v_confirmed_votes
  FROM confirmations
  WHERE user_id = p_user_id
    AND vote = 'confirmed';

  -- SPOTTER BADGES (based on reports created)
  -- Thresholds: bronze=1, silver=3, gold=8
  IF v_reports_created >= 1 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'spotter', 'bronze')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'spotter';
      new_tier := 'bronze';
      RETURN NEXT;
    END IF;
  END IF;

  IF v_reports_created >= 3 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'spotter', 'silver')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'spotter';
      new_tier := 'silver';
      RETURN NEXT;
    END IF;
  END IF;

  IF v_reports_created >= 8 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'spotter', 'gold')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'spotter';
      new_tier := 'gold';
      RETURN NEXT;
    END IF;
  END IF;

  -- KAMPUNG HERO BADGES (based on comments on others' reports)
  -- Thresholds: bronze=3, silver=10, gold=25
  IF v_comments_on_others >= 3 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'kampung_hero', 'bronze')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'kampung_hero';
      new_tier := 'bronze';
      RETURN NEXT;
    END IF;
  END IF;

  IF v_comments_on_others >= 10 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'kampung_hero', 'silver')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'kampung_hero';
      new_tier := 'silver';
      RETURN NEXT;
    END IF;
  END IF;

  IF v_comments_on_others >= 25 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'kampung_hero', 'gold')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'kampung_hero';
      new_tier := 'gold';
      RETURN NEXT;
    END IF;
  END IF;

  -- CLOSER BADGES (based on confirmed votes)
  -- Thresholds: bronze=1, silver=3, gold=10
  IF v_confirmed_votes >= 1 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'closer', 'bronze')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'closer';
      new_tier := 'bronze';
      RETURN NEXT;
    END IF;
  END IF;

  IF v_confirmed_votes >= 3 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'closer', 'silver')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'closer';
      new_tier := 'silver';
      RETURN NEXT;
    END IF;
  END IF;

  IF v_confirmed_votes >= 10 THEN
    INSERT INTO badges (user_id, type, tier)
    VALUES (p_user_id, 'closer', 'gold')
    ON CONFLICT (user_id, type, tier) DO NOTHING;
    IF FOUND THEN
      new_badge_type := 'closer';
      new_tier := 'gold';
      RETURN NEXT;
    END IF;
  END IF;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update award_points to not call check_and_award_badges automatically
-- (The app now calls it explicitly to get the return value)
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

  -- Note: check_and_award_badges is now called explicitly by the app
  -- to capture the returned new badges for toast notifications
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
