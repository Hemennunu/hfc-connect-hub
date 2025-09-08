-- Fix mediaType values before schema migration
-- This script updates any invalid mediaType values to match the new enum

-- First, let's see what values currently exist
SELECT DISTINCT mediaType, COUNT(*) as count 
FROM case_stories 
GROUP BY mediaType;

-- Update any invalid values to 'text' (the default)
-- Common invalid values might be: 'image', 'picture', 'document', etc.
UPDATE case_stories 
SET mediaType = 'text' 
WHERE mediaType NOT IN ('text', 'photo', 'video', 'audio', 'photo_essay');

-- Verify the update
SELECT DISTINCT mediaType, COUNT(*) as count 
FROM case_stories 
GROUP BY mediaType;
