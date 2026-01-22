-- =====================================================
-- FIX ROW-LEVEL SECURITY (RLS) POLICIES
-- Enable Admin CRUD operations for all tables
-- =====================================================
-- Date: 2026-01-22
-- Purpose: Allow authenticated admin users to perform CRUD operations
-- =====================================================

-- ===== PROJECTS =====

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Admin full access to projects" ON projects;
DROP POLICY IF EXISTS "Public can view projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;

-- Policy 1: Public users can READ projects
CREATE POLICY "Public can view projects"
ON projects
FOR SELECT
USING (true);

-- Policy 2: Authenticated users can do EVERYTHING (INSERT, UPDATE, DELETE)
CREATE POLICY "Authenticated users can manage projects"
ON projects
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- ===== NEWS =====

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to news" ON news;
DROP POLICY IF EXISTS "Public can view news" ON news;
DROP POLICY IF EXISTS "Authenticated users can manage news" ON news;

CREATE POLICY "Public can view news"
ON news
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage news"
ON news
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- ===== TRAINING COURSES =====

ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to training_courses" ON training_courses;
DROP POLICY IF EXISTS "Public can view active courses" ON training_courses;
DROP POLICY IF EXISTS "Authenticated users can manage courses" ON training_courses;

-- Public can only view active courses
CREATE POLICY "Public can view active courses"
ON training_courses
FOR SELECT
USING (is_active = true);

CREATE POLICY "Authenticated users can manage courses"
ON training_courses
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- ===== LIBRARY =====

ALTER TABLE library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to library" ON library;
DROP POLICY IF EXISTS "Public can view library" ON library;
DROP POLICY IF EXISTS "Authenticated users can manage library" ON library;

CREATE POLICY "Public can view library"
ON library
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage library"
ON library
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- ===== TOOLS =====

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to tools" ON tools;
DROP POLICY IF EXISTS "Public can view tools" ON tools;
DROP POLICY IF EXISTS "Authenticated users can manage tools" ON tools;

CREATE POLICY "Public can view tools"
ON tools
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage tools"
ON tools
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- ===== CONTACTS =====

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can view contacts" ON contacts;
DROP POLICY IF EXISTS "Public can submit contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can view contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON contacts;

-- Public can INSERT (submit contact form)
CREATE POLICY "Public can submit contacts"
ON contacts
FOR INSERT
WITH CHECK (true);

-- Authenticated users can READ
CREATE POLICY "Authenticated users can view contacts"
ON contacts
FOR SELECT
USING (auth.role() = 'authenticated');

-- Authenticated users can DELETE
CREATE POLICY "Authenticated users can delete contacts"
ON contacts
FOR DELETE
USING (auth.role() = 'authenticated');


-- ===== PRICING =====

ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to pricing" ON pricing;
DROP POLICY IF EXISTS "Public can view pricing" ON pricing;
DROP POLICY IF EXISTS "Authenticated users can manage pricing" ON pricing;

CREATE POLICY "Public can view pricing"
ON pricing
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage pricing"
ON pricing
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- ===== LEADS (if exists) =====

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leads') THEN
        ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Public can submit leads" ON leads;
        DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
        DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
        DROP POLICY IF EXISTS "Authenticated users can delete leads" ON leads;
        
        -- Public can submit leads (training course registration)
        CREATE POLICY "Public can submit leads"
        ON leads
        FOR INSERT
        WITH CHECK (true);
        
        -- Authenticated users can view leads
        CREATE POLICY "Authenticated users can view leads"
        ON leads
        FOR SELECT
        USING (auth.role() = 'authenticated');
        
        -- Authenticated users can update leads
        CREATE POLICY "Authenticated users can update leads"
        ON leads
        FOR UPDATE
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');
        
        -- Authenticated users can delete leads
        CREATE POLICY "Authenticated users can delete leads"
        ON leads
        FOR DELETE
        USING (auth.role() = 'authenticated');
    END IF;
END $$;


-- ===== ANALYTICS (if exists) =====

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'analytics') THEN
        ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Public can log analytics" ON analytics;
        DROP POLICY IF EXISTS "Authenticated users can view analytics" ON analytics;
        
        CREATE POLICY "Public can log analytics"
        ON analytics
        FOR INSERT
        WITH CHECK (true);
        
        CREATE POLICY "Authenticated users can view analytics"
        ON analytics
        FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;
END $$;


-- =====================================================
-- VERIFICATION QUERIES
-- Run these to check if policies are created correctly
-- =====================================================

-- List all policies for each table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('projects', 'news', 'training_courses', 'library', 'tools', 'contacts', 'pricing', 'leads')
ORDER BY tablename, policyname;

-- Check RLS status for all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('projects', 'news', 'training_courses', 'library', 'tools', 'contacts', 'pricing', 'leads')
ORDER BY tablename;
