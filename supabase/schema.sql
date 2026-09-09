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
    status TEXT NOT NULL DEFAULT 'Under Review',
    admin_notes TEXT,
    rating INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for maximum security (Service Role Key bypasses this)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled but allow public access, run these instead:
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public insert" ON applications FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public select" ON applications FOR SELECT USING (true);
-- CREATE POLICY "Allow public update" ON applications FOR UPDATE USING (true);

CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

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

-- Enable Row Level Security (RLS) for rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE TABLE event_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for event_postings
ALTER TABLE event_postings ENABLE ROW LEVEL SECURITY;
