-- Insert BIM Tool Training Courses
-- Author: CIC Training Team
-- Date: 2026-01-22
-- Purpose: Add comprehensive BIM software training courses (Core tools only)

INSERT INTO public.training_courses (
    title, 
    slug, 
    description, 
    content, 
    image_url, 
    level, 
    duration, 
    price, 
    is_active
) VALUES
-- Revit Architecture
(
    'Revit Architecture - Kiến trúc BIM từ cơ bản đến chuyên nghiệp',
    'revit-architecture-co-ban-chuyen-nghiep',
    'Làm chủ Revit Architecture từ mô hình cơ bản đến dự án thực tế. Học cách tạo bản vẽ thi công, chi tiết kiến trúc, và xuất hồ sơ hoàn chỉnh theo tiêu chuẩn Việt Nam.',
    '<h2>Mô tả khóa học</h2><p>Khóa học Revit Architecture giúp bạn nắm vững công cụ thiết kế kiến trúc BIM hàng đầu thế giới. Từ các thao tác cơ bản đến kỹ thuật nâng cao, bạn sẽ học cách:</p><ul><li>Tạo mô hình kiến trúc 3D chi tiết</li><li>Thiết lập Family và Template chuẩn</li><li>Xuất bản vẽ thi công 2D từ mô hình 3D</li><li>Phối hợp với kết cấu và MEP qua Collaboration</li></ul><h3>Nội dung chi tiết</h3><p><strong>Module 1: Cơ bản (16h)</strong><br/>- Giao diện và Project Setup<br/>- Walls, Floors, Roofs, Stairs<br/>- Doors & Windows Placement<br/>- View Management & Sheets</p><p><strong>Module 2: Nâng cao (16h)</strong><br/>- Family Creation & Customization<br/>- Phasing & Design Options<br/>- Formula & Parameters<br/>- Rendering với Enscape</p><p><strong>Module 3: Thực chiến (8h)</strong><br/>- Dự án thực tế: Nhà ở 3 tầng<br/>- Export hồ sơ thi công đầy đủ<br/>- BIM Execution Plan</p>',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    'Cơ bản - Nâng cao',
    '40 giờ (5 tuần)',
    15900000,
    true
),

-- Revit Structure
(
    'Revit Structure - Kết cấu BIM chuyên sâu',
    'revit-structure-ket-cau-bim',
    'Thiết kế kết cấu bê tông, thép với Revit Structure. Tích hợp phân tích Robot Structural, xuất bản vẽ kết cấu và bảng thép chuẩn TCVN.',
    '<h2>Giới thiệu</h2><p>Khóa học dành riêng cho Kỹ sư Kết cấu muốn chuyển đổi sang quy trình BIM. Bạn sẽ học cách mô hình hóa kết cấu bê tông, thép và tích hợp với phần mềm phân tích.</p><h3>Nội dung học</h3><p><strong>Phần 1: Foundation (12h)</strong><br/>- Structural Grid & Levels<br/>- Columns, Beams, Foundations<br/>- Floors & Slabs<br/>- Rebar Modeling</p><p><strong>Phần 2: Advanced (16h)</strong><br/>- Steel Framing & Connections<br/>- Analytical Model<br/>- Link to Robot Structural Analysis<br/>- Foundation Design</p><p><strong>Phần 3: Documentation (12h)</strong><br/>- Shop Drawings<br/>- Rebar Schedules<br/>- Structural Plans & Sections<br/>- BBS (Bar Bending Schedule)</p>',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    'Trung cấp',
    '40 giờ (5 tuần)',
    17900000,
    true
),

-- Revit MEP
(
    'Revit MEP - Hệ thống M&E toàn diện',
    'revit-mep-he-thong-me',
    'Thiết kế hệ thống Mechanical, Electrical, Plumbing trong Revit. Phát hiện va chạm, tính toán tải, và xuất bản vẽ thi công M&E.',
    '<h2>Tổng quan</h2><p>Revit MEP là giải pháp BIM cho các kỹ sư M&E. Khóa học bao gồm cả 3 hệ thống: Mechanical (HVAC), Electrical (Điện), và Plumbing (Cấp thoát nước).</p><h3>Chương trình</h3><p><strong>A. Mechanical - HVAC (16h)</strong><br/>- Duct System Design<br/>- Air Terminals & Diffusers<br/>- HVAC Equipment<br/>- Load Calculations</p><p><strong>B. Electrical (12h)</strong><br/>- Lighting & Power Layout<br/>- Panels & Circuits<br/>- Cable Tray & Conduit<br/>- Lighting Analysis</p><p><strong>C. Plumbing (12h)</strong><br/>- Water Supply System<br/>- Drainage & Sewage<br/>- Fire Protection (Sprinkler)<br/>- Pipe Sizing</p><p><strong>D. Coordination (8h)</strong><br/>- Clash Detection with Navisworks<br/>- Room Finish Schedules<br/>- MEP Fabrication</p>',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
    'Trung cấp - Nâng cao',
    '48 giờ (6 tuần)',
    19900000,
    true
),

-- Navisworks
(
    'Navisworks - Quản lý va chạm & Mô phỏng thi công 4D',
    'navisworks-quan-ly-va-cham-4d',
    'Làm chủ Navisworks Manage để phát hiện va chạm (Clash Detection), lập tiến độ 4D, và mô phỏng thi công. Tích hợp với MS Project và Primavera P6.',
    '<h2>Về khóa học</h2><p>Navisworks là công cụ không thể thiếu trong quy trình BIM Coordination. Bạn sẽ học cách kiểm tra mô hình tổng hợp, phát hiện lỗi thiết kế sớm, và lập kế hoạch thi công 4D.</p><h3>Nội dung</h3><p><strong>Module 1: Navigation & Review (8h)</strong><br/>- Interface & Viewpoints<br/>- Clash Detection Setup<br/>- Markup & Redlining<br/>- Model Coordination</p><p><strong>Module 2: Clash Detection (12h)</strong><br/>- Hard Clash vs Soft Clash<br/>- Clash Matrix Setup<br/>- Clash Reports<br/>- Coordination Workflow</p><p><strong>Module 3: 4D Simulation (12h)</strong><br/>- TimeLiner Setup<br/>- Import MS Project / P6<br/>- Task Linking & Animation<br/>- Progress Monitoring</p><p><strong>Module 4: Quantification (8h)</strong><br/>- Quantity Takeoff<br/>- Cost Estimation<br/>- Export to Excel</p>',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
    'Nâng cao',
    '40 giờ (5 tuần)',
    16900000,
    true
),

-- BIM 360
(
    'BIM 360 / ACC - Quản lý dự án Cloud & CDE',
    'bim-360-acc-cloud-cde',
    'Triển khai Common Data Environment (CDE) với Autodesk Construction Cloud. Quản lý RFI, Submittals, Issues, và Model Coordination trên nền tảng đám mây.',
    '<h2>Giới thiệu BIM 360 / ACC</h2><p>Autodesk Construction Cloud (ACC) - trước đây là BIM 360 - là nền tảng CDE hàng đầu cho ngành xây dựng. Khóa học giúp bạn triển khai đúng quy trình ISO 19650.</p><h3>Nội dung chi tiết</h3><p><strong>Phần 1: Setup & Administration (8h)</strong><br/>- Project Setup & Roles<br/>- User Management<br/>- Folder Structure theo ISO 19650<br/>- Permissions & Access Control</p><p><strong>Phần 2: Document Management (8h)</strong><br/>- File Upload & Versioning<br/>- Markup & Review<br/>- Approval Workflows<br/>- Document Control Matrix</p><p><strong>Phần 3: Model Coordination (12h)</strong><br/>- Model Upload & Processing<br/>- Clash Detection (Cloud-based)<br/>- Issues Management<br/>- Design Review Sessions</p><p><strong>Phần 4: Field Management (12h)</strong><br/>- Mobile App Usage<br/>- RFI Workflow<br/>- Submittal Management<br/>- Quality & Safety Checklists</p>',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'Trung cấp',
    '40 giờ (5 tuần)',
    14900000,
    true
),

-- Dynamo
(
    'Dynamo for Revit - Lập trình trực quan & Tự động hóa BIM',
    'dynamo-revit-lap-trinh-tu-dong-hoa',
    'Tự động hóa quy trình Revit với Dynamo Visual Programming. Từ script đơn giản đến giải pháp phức tạp cho dự án thực tế.',
    '<h2>Mô tả</h2><p>Dynamo biến bạn thành "BIM Developer" mà không cần học lập trình truyền thống. Tạo các script tự động hóa để tăng năng suất gấp 10 lần.</p><h3>Chương trình học</h3><p><strong>Level 1: Fundamentals (12h)</strong><br/>- Dynamo Interface<br/>- Nodes & Packages<br/>- Data Types & List Management<br/>- Simple Automation Scripts</p><p><strong>Level 2: Intermediate (16h)</strong><br/>- Revit API Basics<br/>- Element Selection & Filtering<br/>- Parameter Management<br/>- Family Creation Automation</p><p><strong>Level 3: Advanced (12h)</strong><br/>- Custom Nodes<br/>- Python Scripting in Dynamo<br/>- Excel Integration<br/>- Generative Design Basics</p><p><strong>Projects (8h)</strong><br/>- Structural Grid Generator<br/>- Room Renumbering Tool<br/>- Adaptive Facade System<br/>- Custom Export Scripts</p>',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'Nâng cao',
    '48 giờ (6 tuần)',
    18900000,
    true
),

-- BIM Fundamentals
(
    'BIM Fundamentals - Nền tảng BIM và ISO 19650',
    'bim-fundamentals-iso-19650',
    'Khóa học tổng quan về BIM: Lý thuyết, quy trình, tiêu chuẩn ISO 19650, vai trò BIM Manager/Coordinator. Không yêu cầu kiến thức phần mềm trước.',
    '<h2>Dành cho ai?</h2><p>Khóa học dành cho Ban Giám đốc, Quản lý dự án, chủ đầu tư muốn hiểu BIM để ra quyết định đúng đắn. Không cần biết sử dụng phần mềm.</p><h3>Nội dung</h3><p><strong>Week 1: BIM Introduction (8h)</strong><br/>- What is BIM?<br/>- BIM Levels 0-3<br/>- BIM Dimensions (3D-7D)<br/>- ROI of BIM</p><p><strong>Week 2: ISO 19650 (8h)</strong><br/>- Information Management Framework<br/>- Appointment & Mobilization<br/>- Information Container & Models<br/>- Common Data Environment (CDE)</p><p><strong>Week 3: BIM Execution (8h)</strong><br/>- BIM Execution Plan (BEP)<br/>- Exchange Information Requirements (EIR)<br/>- Level of Information Need (LOIN)<br/>- Task Information Delivery Plan (TIDP)</p><p><strong>Week 4: Roles & Implementation (8h)</strong><br/>- BIM Manager vs BIM Coordinator<br/>- Procurement Strategies<br/>- Change Management<br/>- Case Studies Vietnam</p>',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'Cơ bản',
    '32 giờ (4 tuần)',
    9900000,
    true
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Successfully inserted 7 BIM training courses';
    RAISE NOTICE 'Total investment value: 114,400,000 VND across all courses';
    RAISE NOTICE 'Courses: Revit Arch/Structure/MEP, Navisworks, BIM 360, Dynamo, BIM Fundamentals';
END $$;
