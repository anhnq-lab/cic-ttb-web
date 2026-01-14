-- ⚠️ WARNING: THIS SCRIPT WILL RESET YOUR DATABASE TABLES
-- DROP existing tables to fix schema issues
DROP TABLE IF EXISTS pricing CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS library CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- 1. Users Table
create table users (
  id uuid default gen_random_uuid() primary key,
  username text,
  email text unique,
  password_hash text,
  full_name text,
  avatar_url text,
  role text default 'user', -- 'admin', 'user'
  provider text default 'local', -- 'local', 'google'
  auth_id uuid, -- Link to Supabase Auth User ID
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. News Table
create table news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  excerpt text,
  content text,
  image_url text,
  author text,
  date timestamp with time zone default timezone('utc'::text, now()),
  views integer default 0,
  "videoUrl" text,
  "audioUrl" text,
  "metaTitle" text,
  "metaDescription" text,
  keywords text,
  attachments text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Library Table
create table library (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text,
  description text,
  tag text,
  image_url text,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Tools Table
create table tools (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  icon text,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Contacts Table
create table contacts (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  phone text,
  company text,
  service text,
  note text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status text,
  "imageUrl" text,
  location text,
  investor text,
  "startDate" date,
  "endDate" date,
  progress integer default 0,
  type text,
  area text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Pricing Table
create table pricing (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price text,
  period text,
  description text,
  features text,
  "ctaText" text,
  "isPopular" boolean default false,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. Settings Table
create table settings (
  key text primary key,
  value text
);

-- Create Policy for Public Read Access
alter table news enable row level security;
create policy "Public News Request" on news for select using (true);
create policy "Admin News All" on news for all using (true);

alter table library enable row level security;
create policy "Public Library Request" on library for select using (true);

-- Insert Initial Pricing Data
insert into pricing (name, price, period, description, "ctaText", "isPopular", features, type) values 
('Gói Khởi Đầu', '5.900.000đ', '/tháng', 'Phù hợp cho doanh nghiệp nhỏ', 'Bắt đầu dùng thử', false, '["Quản lý 3 dự án","50GB Cloud"]', 'software'),
('Gói Chuyên Nghiệp', '12.900.000đ', '/tháng', 'Dành cho PMU và tư vấn', 'Liên hệ tư vấn', true, '["Không giới hạn dự án","500GB Cloud","BIM Viewer"]', 'software');
