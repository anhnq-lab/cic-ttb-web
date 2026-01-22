-- Add missing columns to news table if they usually don't exist
ALTER TABLE news ADD COLUMN IF NOT EXISTS "author" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "videoUrl" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "audioUrl" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "attachments" text;

-- Add missing columns to pricing table if usually don't exist
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS "type" text;

-- Reload schema cache ensuring it catches these changes
NOTIFY pgrst, 'reload schema';
