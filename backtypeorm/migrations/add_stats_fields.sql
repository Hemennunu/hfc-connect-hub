-- Migration to add new fields to stats table
-- Run this script to update your existing database schema

-- Add new columns to stats table
ALTER TABLE stats ADD COLUMN IF NOT EXISTS secondaryNumber VARCHAR(255);
ALTER TABLE stats ADD COLUMN IF NOT EXISTS secondaryLabel VARCHAR(255);
ALTER TABLE stats ADD COLUMN IF NOT EXISTS additionalNumbers JSON;
ALTER TABLE stats ADD COLUMN IF NOT EXISTS additionalLabel VARCHAR(255);

-- Update projects table budget field type
ALTER TABLE projects MODIFY COLUMN budget DECIMAL(15,2) DEFAULT 0;

-- Update any existing NULL budget values
UPDATE projects SET budget = 0 WHERE budget IS NULL;
