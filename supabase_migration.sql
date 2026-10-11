-- ==============================================================================
-- AMPRIORA SUPABASE PRODUCTION DATABASE MIGRATION
-- Project: AMPRIORA Career & Student Ecosystem
-- Description: Creates profiles, resumes, posts, and messages tables with Row Level Security (RLS)
-- Execution: Run this entire script in your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. Enable UUID Extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (Single Source of Truth for User & Resume Data)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  onboarding JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- RLS: Authenticated users can view profiles (needed for Feed, Networking, Mentorship)
CREATE POLICY "Authenticated users can view profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- RLS: Users can insert only their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- RLS: Users can update only their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- RLS: Users can delete only their own profile
CREATE POLICY "Users can delete own profile" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = id);

-- Index for fast lookup by user ID
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Trigger to automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, onboarding)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    '{}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Automatically backfill existing auth.users who do not yet have a profile row
INSERT INTO public.profiles (id, full_name, onboarding)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  '{}'::jsonb
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- ==============================================================================
-- 3. RESUMES TABLE (Dedicated Version Control Table)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL DEFAULT 'Default Resume',
  resume_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on resumes
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can insert own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;

-- RLS: Strict private isolation - users can only view their own resumes
CREATE POLICY "Users can view own resumes" 
  ON public.resumes 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS: Users can insert only their own resumes
CREATE POLICY "Users can insert own resumes" 
  ON public.resumes 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- RLS: Users can update only their own resumes
CREATE POLICY "Users can update own resumes" 
  ON public.resumes 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- RLS: Users can delete only their own resumes
CREATE POLICY "Users can delete own resumes" 
  ON public.resumes 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Index for fast user resumes lookup
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

-- ==============================================================================
-- 4. POSTS TABLE (Social Feed)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  "authorId" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "authorAvatar" TEXT DEFAULT '',
  "authorRole" TEXT DEFAULT '',
  "authorCompanyOrSchool" TEXT DEFAULT '',
  content TEXT NOT NULL,
  likes JSONB NOT NULL DEFAULT '[]'::jsonb,
  comments JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON public.posts;

CREATE POLICY "Authenticated users can view posts" 
  ON public.posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = "authorId");

CREATE POLICY "Authors can update own posts" 
  ON public.posts FOR UPDATE TO authenticated USING (auth.uid()::text = "authorId");

CREATE POLICY "Authors can delete own posts" 
  ON public.posts FOR DELETE TO authenticated USING (auth.uid()::text = "authorId");

-- ==============================================================================
-- 5. MESSAGES TABLE (Chat & Networking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attachment TEXT
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

CREATE POLICY "Authenticated users can read messages" 
  ON public.messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = "senderId");

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages("conversationId");
