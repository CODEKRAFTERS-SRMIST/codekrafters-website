-- ==========================================================
-- CODEKRAFTERS DATABASE RESET & SEED
-- ==========================================================

-- 1. Enable pgcrypto for database-level bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Drop all legacy tables cleanly
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS rate_limits CASCADE;
DROP TABLE IF EXISTS event_postings CASCADE;

-- 3. Create clean users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'APPLICANT',
    domain_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create applications table
CREATE TABLE applications (
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

-- 5. Create rate_limits table
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    action TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    first_request_at TIMESTAMPTZ DEFAULT NOW(),
    last_request_at TIMESTAMPTZ DEFAULT NOW(),
    locked_until TIMESTAMPTZ,
    UNIQUE (identifier, action)
);

-- 6. Create event_postings table
CREATE TABLE event_postings (
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

-- 7. Create recruitment_settings table
CREATE TABLE IF NOT EXISTS recruitment_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_cycle',
    current_phase INTEGER NOT NULL DEFAULT 1,
    tasks_visible BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO recruitment_settings (id, current_phase, tasks_visible)
VALUES ('current_cycle', 1, false)
ON CONFLICT (id) DO NOTHING;

-- 8. Disable RLS on all tables so backend queries are never blocked
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_postings DISABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_settings DISABLE ROW LEVEL SECURITY;

-- 8. Seed President account: Sanjay Ganesh
-- Password 'admin123' is automatically converted to a real bcrypt hash!
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
    'sgbarade@gmail.com',
    crypt('admin123', gen_salt('bf', 10)),
    'Sanjay Ganesh',
    'PRESIDENT'
);

-- 9. Check row output
SELECT id, email, full_name, role, password_hash FROM users WHERE email = 'sgbarade@gmail.com';
