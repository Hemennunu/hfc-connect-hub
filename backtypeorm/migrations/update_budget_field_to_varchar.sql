-- Migration to change budget field from decimal to varchar
-- This allows storing both numeric values and text values like "USAID", "World Bank", etc.

ALTER TABLE projects MODIFY COLUMN budget VARCHAR(255) NOT NULL;

-- Update any existing NULL or 0 values to empty string if needed
UPDATE projects SET budget = '' WHERE budget IS NULL OR budget = '0.00';
