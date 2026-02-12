-- E9-S6: Add comment_id to flags table for comment flagging support
-- Migration: Extend flags to support both report and comment flags

-- Drop existing unique constraint (report_id, user_id)
ALTER TABLE flags DROP CONSTRAINT IF EXISTS flags_report_id_user_id_key;

-- Make report_id nullable (one of report_id or comment_id must be set)
ALTER TABLE flags ALTER COLUMN report_id DROP NOT NULL;

-- Add comment_id column
ALTER TABLE flags ADD COLUMN comment_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Add check: at least one of report_id or comment_id must be set
ALTER TABLE flags ADD CONSTRAINT flags_target_check
  CHECK (report_id IS NOT NULL OR comment_id IS NOT NULL);

-- Partial unique indexes: one flag per user per report, one per user per comment
CREATE UNIQUE INDEX idx_flags_report_user_unique
  ON flags (report_id, user_id) WHERE report_id IS NOT NULL;

CREATE UNIQUE INDEX idx_flags_comment_user_unique
  ON flags (comment_id, user_id) WHERE comment_id IS NOT NULL;

-- Index for comment_id lookups
CREATE INDEX idx_flags_comment_id ON flags(comment_id);
