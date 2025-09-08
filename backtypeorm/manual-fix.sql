-- Manual fix for mediaType enum issue
-- Run this SQL directly in your MySQL database

USE hfc_database;

-- First, check what values exist
SELECT DISTINCT mediaType, COUNT(*) as count 
FROM case_stories 
GROUP BY mediaType;

-- Update any invalid mediaType values to 'text'
UPDATE case_stories 
SET mediaType = 'text' 
WHERE mediaType NOT IN ('text', 'photo', 'video', 'audio', 'photo_essay');

-- Verify the fix
SELECT DISTINCT mediaType, COUNT(*) as count 
FROM case_stories 
GROUP BY mediaType;
