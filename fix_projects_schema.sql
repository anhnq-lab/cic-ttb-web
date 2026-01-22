-- =============================================
-- CIC BIM Hub - Projects Schema Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- Add missing columns if they don't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS scope_of_work TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS result TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion_date DATE;

-- Migrate existing data from old column names to new
UPDATE projects SET title = name WHERE title IS NULL AND name IS NOT NULL;
UPDATE projects SET client = investor WHERE client IS NULL AND investor IS NOT NULL;
UPDATE projects SET service_type = type WHERE service_type IS NULL AND type IS NOT NULL;
UPDATE projects SET completion_date = "endDate" WHERE completion_date IS NULL AND "endDate" IS NOT NULL;
UPDATE projects SET images = "imageUrl" WHERE images IS NULL AND "imageUrl" IS NOT NULL;

-- Verify schema
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects' ORDER BY ordinal_position;
