-- Migration 001: Add Database Indexes
-- Safe to run without downtime
-- Improves query performance for common operations

BEGIN;

-- ============================================
-- NEWS TABLE INDEXES
-- ============================================

-- Speed up news listing (most common query)
CREATE INDEX IF NOT EXISTS idx_news_created_at 
ON news(created_at DESC);

-- Filter by category
CREATE INDEX IF NOT EXISTS idx_news_category 
ON news(category) 
WHERE category IS NOT NULL;

-- Filter active news (partial index for better performance)
CREATE INDEX IF NOT EXISTS idx_news_is_active 
ON news(is_active) 
WHERE is_active = true;

-- Composite index for category + date filtering
CREATE INDEX IF NOT EXISTS idx_news_category_date 
ON news(category, created_at DESC) 
WHERE is_active = true;

-- ============================================
-- LIBRARY TABLE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_library_created_at 
ON library(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_library_type 
ON library(type);

CREATE INDEX IF NOT EXISTS idx_library_active 
ON library(is_active) 
WHERE is_active = true;

-- ============================================
-- TRAINING COURSES INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_training_active 
ON training_courses(is_active) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_training_level 
ON training_courses(level);

CREATE INDEX IF NOT EXISTS idx_training_created 
ON training_courses(created_at DESC);

-- ============================================
-- PROJECTS TABLE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_created 
ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_category 
ON projects(category) 
WHERE category IS NOT NULL;

-- ============================================
-- CONTACTS TABLE INDEXES (Admin Dashboard)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_contacts_created 
ON contacts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contacts_status 
ON contacts(status);

-- ============================================
-- LEADS TABLE INDEXES (Marketing)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_created 
ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_source 
ON leads(source) 
WHERE source IS NOT NULL;

-- ============================================
-- TOOLS TABLE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_tools_category 
ON tools(category);

CREATE INDEX IF NOT EXISTS idx_tools_created 
ON tools(created_at DESC);

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check created indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Analyze tables to update statistics
ANALYZE news;
ANALYZE library;
ANALYZE training_courses;
ANALYZE projects;
ANALYZE contacts;
ANALYZE leads;
ANALYZE tools;
