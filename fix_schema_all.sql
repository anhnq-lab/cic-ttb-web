-- Comprehensive Column Check & Fix

-- 1. NEWS Table
ALTER TABLE news ADD COLUMN IF NOT EXISTS "imageUrl" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "metaTitle" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "metaDescription" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "keywords" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "author" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "videoUrl" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "audioUrl" text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS "attachments" text;

-- 2. PROJECTS Table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "images" text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "completion_date" text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "service_type" text;

-- 3. PRICING Table
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS "features" text;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS "isPopular" boolean;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS "ctaText" text;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS "type" text;

-- 4. CONTACTS Table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "service" text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "company" text;

-- Reload schema to apply changes immediately
NOTIFY pgrst, 'reload schema';
