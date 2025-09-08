-- Fix invalid dates in projects table
-- This will set all '0000-00-00' dates to NULL

UPDATE projects SET startDate = NULL WHERE startDate = '0000-00-00';
UPDATE projects SET endDate = NULL WHERE endDate = '0000-00-00';
UPDATE projects SET completedDate = NULL WHERE completedDate = '0000-00-00';

-- Check for any remaining invalid dates
SELECT id, title, startDate, endDate, completedDate 
FROM projects 
WHERE startDate = '0000-00-00' OR endDate = '0000-00-00' OR completedDate = '0000-00-00';

-- Optional: If you want to see all projects with NULL dates after cleanup
SELECT id, title, startDate, endDate, completedDate 
FROM projects 
WHERE startDate IS NULL OR endDate IS NULL OR completedDate IS NULL;
