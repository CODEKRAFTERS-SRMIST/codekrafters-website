-- ==========================================================
-- CODEKRAFTERS PRODUCTION SCHEMA & SAFE POLICIES
-- NON-DESTRUCTIVE: Safe to run on live databases with existing data
-- ==========================================================

-- 1. Enable pgcrypto for database-level bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create clean users table (if not already existing)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'APPLICANT',
    domain_id TEXT,
    token_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure token_version column exists on existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 1;

-- 3. Create applications table (if not already existing)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    primary_domain TEXT NOT NULL,
    domains TEXT[] NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    why_join TEXT NOT NULL,
    past_experience TEXT,
    status TEXT NOT NULL DEFAULT 'Applied',
    task_submission_url TEXT,
    task_submitted_at TIMESTAMPTZ,
    admin_notes TEXT,
    rating INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create rate_limits table (if not already existing)
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    action TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    first_request_at TIMESTAMPTZ DEFAULT NOW(),
    last_request_at TIMESTAMPTZ DEFAULT NOW(),
    locked_until TIMESTAMPTZ,
    UNIQUE (identifier, action)
);

-- 5. Create event_postings table (if not already existing)
CREATE TABLE IF NOT EXISTS event_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_by_id UUID,
    approved_by_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create recruitment_settings table (if not already existing)
CREATE TABLE IF NOT EXISTS recruitment_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_cycle',
    current_phase INTEGER NOT NULL DEFAULT 1,
    tasks_visible BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO recruitment_settings (id, current_phase, tasks_visible)
VALUES ('current_cycle', 1, false)
ON CONFLICT (id) DO NOTHING;

-- 7. Enable Row Level Security (RLS) on all tables (Safe: modifies security rules, preserves all data)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_settings ENABLE ROW LEVEL SECURITY;

-- 7.1 Users Policies: Deny direct anon/public access. Only service role (backend) can manage credentials.
DROP POLICY IF EXISTS "Deny direct public access to users" ON users;
CREATE POLICY "Deny direct public access to users" ON users
    FOR ALL
    TO anon
    USING (false);

-- 7.2 Applications Policies: Deny direct anon/public access. All operations go via server API routes.
DROP POLICY IF EXISTS "Deny direct public access to applications" ON applications;
CREATE POLICY "Deny direct public access to applications" ON applications
    FOR ALL
    TO anon
    USING (false);

-- 7.3 Rate Limits Policies: Deny direct anon access to prevent tampering with security counters.
DROP POLICY IF EXISTS "Deny direct public access to rate_limits" ON rate_limits;
CREATE POLICY "Deny direct public access to rate_limits" ON rate_limits
    FOR ALL
    TO anon
    USING (false);

-- 7.4 Event Postings Policies: Allow public read of approved events only. Deny direct write/modify.
DROP POLICY IF EXISTS "Allow public read of approved events" ON event_postings;
CREATE POLICY "Allow public read of approved events" ON event_postings
    FOR SELECT
    TO anon, authenticated
    USING (status = 'APPROVED');

DROP POLICY IF EXISTS "Deny direct anon writes to event_postings" ON event_postings;
CREATE POLICY "Deny direct anon writes to event_postings" ON event_postings
    FOR INSERT
    TO anon
    WITH CHECK (false);

DROP POLICY IF EXISTS "Deny direct anon updates to event_postings" ON event_postings;
CREATE POLICY "Deny direct anon updates to event_postings" ON event_postings
    FOR UPDATE
    TO anon
    USING (false);

DROP POLICY IF EXISTS "Deny direct anon deletes to event_postings" ON event_postings;
CREATE POLICY "Deny direct anon deletes to event_postings" ON event_postings
    FOR DELETE
    TO anon
    USING (false);

-- 7.5 Recruitment Settings Policies: Allow public read of timeline phase, deny direct anon edits.
DROP POLICY IF EXISTS "Allow public read of recruitment_settings" ON recruitment_settings;
CREATE POLICY "Allow public read of recruitment_settings" ON recruitment_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Deny direct anon modification of recruitment_settings" ON recruitment_settings;
CREATE POLICY "Deny direct anon modification of recruitment_settings" ON recruitment_settings
    FOR ALL
    TO anon
    USING (false);

