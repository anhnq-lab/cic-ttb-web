-- Migration: 20260120_marketing_schema
-- Description: Create training_courses and leads tables for CIC BIM Training Marketing features.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create training_courses table
CREATE TABLE IF NOT EXISTS public.training_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT, -- HTML content for detailed description
    curriculum JSONB DEFAULT '[]'::JSONB, -- List of modules/lessons
    image_url TEXT,
    price DECIMAL(12, 2),
    duration TEXT,
    level TEXT, -- Cơ bản, Trung cấp, Nâng cao, Chuyên gia
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    position TEXT,
    course_id UUID REFERENCES public.training_courses(id),
    message TEXT,
    status TEXT DEFAULT 'new', -- new, contacted, converted, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Rol Level Security
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Training Courses: Public read access
CREATE POLICY "Public can view active courses" ON public.training_courses
    FOR SELECT USING (is_active = true);

-- Training Courses: Admin full access (using service_role or admin role check)
-- Assuming backend uses service_role, this is implicit.
-- But for Frontend Admin logic if using Supabase Auth:
CREATE POLICY "Admin can do everything on courses" ON public.training_courses
    FOR ALL USING (true); -- CAUTION: For production, change 'true' to auth.role() check or specific user ID check.
                          -- Given current custom auth, we'll keep it open for Service Role and restrict via API logic.

-- Leads: Public insert access (for registration forms)
CREATE POLICY "Public can insert leads" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Leads: Admin full access
CREATE POLICY "Admin can view leads" ON public.leads
    FOR SELECT USING (true); -- Similar caution as above.

-- 5. Seed Data (from CIC BIM Profile)
INSERT INTO public.training_courses (title, slug, description, content, image_url, level, duration, price)
VALUES
(
    'Tổng quan về BIM (BIM Overview)',
    'bim-overview',
    'Khóa học cung cấp kiến thức nền tảng về BIM, khái niệm, lợi ích và lộ trình áp dụng BIM cho doanh nghiệp theo xu hướng chuyển đổi số ngành xây dựng.',
    '<h3>Giới thiệu khóa học</h3><p>BIM (Building Information Modeling) đang trở thành xu hướng tất yếu. Khóa học này giúp Cấp lãnh đạo và Quản lý nắm bắt tư duy cốt lõi...</p><h3>Nội dung chính</h3><ul><li>Khái niệm và các chiều BIM (3D-7D)</li><li>Lợi ích và thách thức khi áp dụng</li><li>Lộ trình triển khai BIM cho doanh nghiệp</li></ul>',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    'Cơ bản',
    '1 ngày',
    2000000
),
(
    'Thiết lập môi trường dữ liệu chung (CDE)',
    'cde-setup',
    'Hướng dẫn kỹ thuật thiết lập, quản lý và vận hành Môi trường dữ liệu chung (CDE) để trao đổi thông tin hiệu quả trong dự án.',
    '<h3>Giới thiệu khóa học</h3><p>CDE là xương sống của mọi dự án BIM. Khóa học hướng dẫn thiết lập CDE trên các nền tảng như Autodesk Construction Cloud, BIM360, Google Drive...</p><h3>Nội dung chính</h3><ul><li>Khái niệm CDE theo ISO 19650</li><li>Cấu trúc thư mục và phân quyền</li><li>Quy trình phê duyệt tài liệu (Workflow)</li></ul>',
    'https://images.unsplash.com/photo-1558494949-efc02220ec8c?auto=format&fit=crop&w=800&q=80',
    'Nâng cao',
    '2 ngày',
    3500000
),
(
    'Quản lý và Phối hợp BIM (BIM Coordination)',
    'bim-coordination',
    'Đào tạo kỹ năng sử dụng phần mềm (Navisworks, Solibri) để kiểm tra xung đột (Clash Detection) và phối hợp đa bộ môn.',
    '<h3>Giới thiệu khóa học</h3><p>Giải quyết xung đột thiết kế trước khi ra công trường là lợi ích lớn nhất của BIM. Khóa học tập trung vào kỹ năng thực chiến.</p><h3>Nội dung chính</h3><ul><li>Nguyên tắc phối hợp 3D</li><li>Sử dụng Navisworks Manage</li><li>Quy trình xử lý Clash và báo cáo</li></ul>',
    'https://images.unsplash.com/photo-1581094794329-cd11965d1169?auto=format&fit=crop&w=800&q=80',
    'Trung cấp',
    '3 ngày',
    4000000
),
(
    'Chuyên gia BIM theo tiêu chuẩn ISO 19650',
    'iso-19650-master',
    'Chương trình đào tạo chuyên sâu về quản lý thông tin dự án theo tiêu chuẩn quốc tế ISO 19650-1 & 2.',
    '<h3>Giới thiệu khóa học</h3><p>Chuẩn hóa quy trình BIM theo ISO 19650 là yêu cầu của nhiều dự án quốc tế và vốn ngân sách.</p><h3>Nội dung chính</h3><ul><li>Nguyên tắc ISO 19650-1</li><li>Quy trình giao thầu và thực hiện (ISO 19650-2)</li><li>Hồ sơ EIR, BEP, MPDT</li></ul>',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    'Chuyên gia',
    '4 ngày',
    5000000
)
ON CONFLICT (slug) DO UPDATE 
SET 
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    price = EXCLUDED.price,
    updated_at = NOW();
