-- Migration: Remove 'acknowledged' status from report_status enum
-- This simplifies the status flow from 5 to 4 statuses:
-- open → in_progress → resolved → closed

-- Step 1: Update existing acknowledged reports to open
UPDATE reports SET status = 'open' WHERE status = 'acknowledged';

-- Step 2: Create new enum without acknowledged
CREATE TYPE report_status_new AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Step 3: Drop default so the column type can be changed (default cannot be auto-cast)
ALTER TABLE reports ALTER COLUMN status DROP DEFAULT;

-- Step 4: Drop trigger that depends on status column (cannot alter type while trigger exists)
DROP TRIGGER IF EXISTS trigger_notify_on_status_change ON reports;

-- Step 5: Alter column to use new enum
ALTER TABLE reports ALTER COLUMN status TYPE report_status_new USING status::text::report_status_new;

-- Step 6: Drop old enum
DROP TYPE report_status;

-- Step 7: Rename new enum
ALTER TYPE report_status_new RENAME TO report_status;

-- Step 8: Restore default
ALTER TABLE reports ALTER COLUMN status SET DEFAULT 'open'::report_status;

-- Step 9: Recreate trigger (function notify_on_status_change already exists)
CREATE TRIGGER trigger_notify_on_status_change
  AFTER UPDATE OF status ON reports
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_status_change();
