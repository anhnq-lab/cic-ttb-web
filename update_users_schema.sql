-- Add columns for extended Auth (Register & Google Login)
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'local'; -- 'local' or 'google'
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id TEXT; -- Link to Supabase Auth User ID if needed

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
