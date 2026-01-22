# Database Optimization Guide

## Current Issues

### 1. JSON Storage as TEXT
**Problem**: Using TEXT for JSON fields instead of JSONB
**Impact**: 
- Slower queries (no indexing on JSON fields)
- Cannot use PostgreSQL JSON operators
- More storage space

**Fields affected**:
- `news.content` (TEXT)
- `library.metadata` (TEXT)  
- `tools.config` (TEXT)

### 2. Missing Indexes
**Problem**: No indexes on frequently queried fields
**Impact**: Slow queries as data grows

**Recommended indexes**:
```sql
-- News table
CREATE INDEX idx_news_created_at ON news(created_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_is_active ON news(is_active);

-- Library table
CREATE INDEX idx_library_created_at ON library(created_at DESC);
CREATE INDEX idx_library_type ON library(type);

-- Training table
CREATE INDEX idx_training_is_active ON training_courses(is_active);
CREATE INDEX idx_training_level ON training_courses(level);

-- Projects table
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
```

### 3. No Migration Framework
**Problem**: Manual SQL execution, no version control
**Solution**: Implement migration framework

---

## Migration Plan

### Phase 1: Add Indexes (Safe, Immediate)

**File**: `migrations/001_add_indexes.sql`

```sql
-- Create indexes for better query performance
-- Safe to run without downtime

BEGIN;

-- News indexes
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active) WHERE is_active = true;

-- Library indexes  
CREATE INDEX IF NOT EXISTS idx_library_created_at ON library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_type ON library(type);

-- Training indexes
CREATE INDEX IF NOT EXISTS idx_training_active ON training_courses(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_training_level ON training_courses(level);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);

-- Contacts indexes (for admin dashboard)
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

COMMIT;
```

### Phase 2: Migrate TEXT to JSONB (Requires downtime)

**File**: `migrations/002_migrate_to_jsonb.sql`

```sql
-- Migrate TEXT columns to JSONB
-- WARNING: Requires brief downtime

BEGIN;

-- Backup existing data (optional but recommended)
CREATE TABLE news_backup AS SELECT * FROM news;

-- Add new JSONB columns
ALTER TABLE news ADD COLUMN content_jsonb JSONB;

-- Migrate data
UPDATE news 
SET content_jsonb = content::jsonb 
WHERE content IS NOT NULL AND content != '';

-- Drop old column and rename (after verification)
-- ALTER TABLE news DROP COLUMN content;
-- ALTER TABLE news RENAME COLUMN content_jsonb TO content;

-- Add GIN index on JSONB for fast queries
CREATE INDEX idx_news_content_gin ON news USING GIN (content_jsonb);

COMMIT;
```

### Phase 3: Optimize Queries

**Before**:
```sql
-- Slow: Full table scan
SELECT * FROM news ORDER BY created_at DESC LIMIT 10;
```

**After**:
```sql
-- Fast: Uses index
SELECT * FROM news 
WHERE is_active = true 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## Migration Framework Options

### Option 1: node-pg-migrate (Recommended)

**Install**:
```bash
npm install --save-dev node-pg-migrate
```

**Usage**:
```bash
# Create migration
npx node-pg-migrate create add-indexes

# Run migrations
npx node-pg-migrate up

# Rollback
npx node-pg-migrate down
```

### Option 2: Drizzle ORM

**Install**:
```bash
npm install drizzle-orm drizzle-kit
npm install --save-dev @types/pg
```

**Benefits**:
- Type-safe queries
- Auto-generate migrations
- Better DX

### Option 3: Manual Scripts (Current)

Keep using SQL files with versioning:
```
migrations/
  001_add_indexes.sql
  002_migrate_jsonb.sql
  003_optimize_rls.sql
```

---

## Performance Monitoring

### Check Index Usage

```sql
-- Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename;

-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Analyze Query Performance

```sql
-- Explain query plan
EXPLAIN ANALYZE
SELECT * FROM news 
WHERE is_active = true 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## Rollback Plan

For each migration, document rollback:

```sql
-- Rollback 001_add_indexes.sql
DROP INDEX IF EXISTS idx_news_created_at;
DROP INDEX IF EXISTS idx_news_category;
-- ... etc
```

---

## Deployment Checklist

- [ ] **Backup database** before migrations
- [ ] Test migrations on **staging** first
- [ ] Run during **low-traffic hours**
- [ ] Monitor **query performance** after
- [ ] Have **rollback plan** ready
- [ ] Update **application code** if schema changes

---

## Next Steps

1. **Immediate** (No downtime):
   - Run `001_add_indexes.sql`
   - Monitor query improvements
   
2. **Planned** (Requires downtime):
   - Schedule JSONB migration
   - Test on staging
   - Deploy during maintenance window

3. **Future**:
   - Implement migration framework (node-pg-migrate)
   - Add query monitoring (pg_stat_statements)
   - Setup automated backups
