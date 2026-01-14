-- Add columns for Project Expansion (Content, Scope, Sync)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS scope_of_work TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published'; -- 'published' or 'pending'
ALTER TABLE projects ADD COLUMN IF NOT EXISTS source_id TEXT; -- ID from external system

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
