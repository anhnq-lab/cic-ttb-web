-- Migration: Add extended fields to news table
-- Run this in Supabase SQL Editor

-- Add video_url column
ALTER TABLE news ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add audio_url column  
ALTER TABLE news ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Add attachments column (JSON stored as text)
ALTER TABLE news ADD COLUMN IF NOT EXISTS attachments TEXT;

-- Add meta_title column
ALTER TABLE news ADD COLUMN IF NOT EXISTS meta_title TEXT;

-- Add meta_description column
ALTER TABLE news ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add keywords column
ALTER TABLE news ADD COLUMN IF NOT EXISTS keywords TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position;
