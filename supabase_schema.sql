-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Ensure profiles table exists and matches our schema
create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text,
  email text,
  phone text,
  current_degree text,
  major text,
  gpa numeric,
  education_board text,
  ielts numeric,
  toefl integer,
  gre integer,
  gmat integer,
  sat integer,
  budget_min integer,
  budget_max integer,
  funding_source text,
  target_countries text[],
  intake_year text,
  intake_season text,
  study_level text,
  has_passport boolean default false,
  has_transcript boolean default false,
  has_sop boolean default false,
  has_lor boolean default false,
  onboarding_complete boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Fix for existing profiles table missing user_id and other columns
do $$
begin
    -- Ensure user_id exists
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'user_id') then
        alter table public.profiles add column user_id uuid references auth.users on delete cascade;
    end if;

    -- Ensure other columns exist
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'name') then
        alter table public.profiles add column name text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email') then
        alter table public.profiles add column email text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
        alter table public.profiles add column phone text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'current_degree') then
        alter table public.profiles add column current_degree text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'major') then
        alter table public.profiles add column major text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'gpa') then
        alter table public.profiles add column gpa numeric;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'education_board') then
        alter table public.profiles add column education_board text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'ielts') then
        alter table public.profiles add column ielts numeric;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'toefl') then
        alter table public.profiles add column toefl integer;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'gre') then
        alter table public.profiles add column gre integer;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'gmat') then
        alter table public.profiles add column gmat integer;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'sat') then
        alter table public.profiles add column sat integer;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'budget_min') then
        alter table public.profiles add column budget_min integer;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'budget_max') then
        alter table public.profiles add column budget_max integer;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'funding_source') then
        alter table public.profiles add column funding_source text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'target_countries') then
        alter table public.profiles add column target_countries text[];
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'intake_year') then
        alter table public.profiles add column intake_year text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'intake_season') then
        alter table public.profiles add column intake_season text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'study_level') then
        alter table public.profiles add column study_level text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'has_passport') then
        alter table public.profiles add column has_passport boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'has_transcript') then
        alter table public.profiles add column has_transcript boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'has_sop') then
        alter table public.profiles add column has_sop boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'has_lor') then
        alter table public.profiles add column has_lor boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'onboarding_complete') then
        alter table public.profiles add column onboarding_complete boolean default false;
    end if;

    -- Ensure user_id has a unique constraint for upsert to work
    if not exists (select 1 from pg_constraint where conname = 'profiles_user_id_key') then
        alter table public.profiles add constraint profiles_user_id_key unique (user_id);
    end if;
end $$;

-- UNIVERSITIES TABLE
-- Stores universities fetched from the external API to allow foreign keys
create table if not exists public.universities (
  id text primary key, -- Text ID from base64 encoding
  name text not null,
  country text not null,
  city text,
  ranking integer,
  tuition_min integer,
  tuition_max integer,
  website text,
  logo_url text,
  acceptance_rate numeric,
  programs text[],
  requirements jsonb
);

-- SHORTLIST TABLE
-- Links users to universities
create table if not exists public.shortlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  university_id text references public.universities(id) on delete cascade not null,
  category text check (category in ('reach', 'target', 'safety')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.shortlist enable row level security;

-- Drop conflicting policies if they exist
drop policy if exists "Service role can create profiles" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- Profiles: Users can view and update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- Allow both authenticated users and service role to create profiles (unified policy)
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.role() = 'service_role' or auth.uid() = user_id);

-- Universities: Everyone can view, authenticated users can insert (via upsert)
create policy "Universities are viewable by everyone" on public.universities
  for select using (true);

create policy "Authenticated users can insert universities" on public.universities
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update universities" on public.universities
  for update using (auth.role() = 'authenticated');

-- Shortlist: Users can view, insert, delete their own shortlist
create policy "Users can view own shortlist" on public.shortlist
  for select using (auth.uid() = user_id);

create policy "Users can insert into own shortlist" on public.shortlist
  for insert with check (auth.uid() = user_id);

create policy "Users can delete from own shortlist" on public.shortlist
  for delete using (auth.uid() = user_id);

create policy "Users can update own shortlist" on public.shortlist
  for update using (auth.uid() = user_id);

-- CHAT MESSAGES TABLE
create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Chat Messages
alter table public.chat_messages enable row level security;

create policy "Users can view own messages" on public.chat_messages
  for select using (auth.uid() = user_id);

create policy "Users can insert own messages" on public.chat_messages
  for insert with check (auth.uid() = user_id);

-- UNIVERSITY LOCKING: Add columns to shortlist if not exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'shortlist' and column_name = 'is_locked') then
        alter table public.shortlist add column is_locked boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'shortlist' and column_name = 'locked_at') then
        alter table public.shortlist add column locked_at timestamp with time zone;
    end if;
end $$;

-- TASKS TABLE for AI To-Do List
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  category text check (category in ('exams', 'documents', 'applications', 'general')) default 'general',
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- RLS for Tasks
alter table public.tasks enable row level security;

create policy "Users can view own tasks" on public.tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update own tasks" on public.tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete own tasks" on public.tasks
  for delete using (auth.uid() = user_id);
