# Phase 01: Database Schema
Status: ✅ Complete
Dependencies: None

## Objective
Thiết lập cơ sở dữ liệu trên Supabase để lưu trữ thông tin về Khóa học (Training Courses) và Học viên tiềm năng (Leads).

## Requirements
### Functional
- [ ] Bảng `training_courses` để lưu thông tin khóa học.
- [ ] Bảng `leads` để lưu thông tin người đăng ký.
- [ ] Seed data cho 4 khóa học nòng cốt từ CIC Profile.
- [ ] RLS policies để bảo mật (Public đọc khóa học, Anon ghi leads, Admin toàn quyền).

## Implementation Steps
1. [ ] Tạo file migration SQL `supabase/migrations/[timestamp]_marketing_schema.sql` (hoặc chạy trực tiếp trên SQL Editor nếu không dùng local CLI).
2. [ ] Viết script SQL tạo bảng `training_courses`.
3. [ ] Viết script SQL tạo bảng `leads`.
4. [ ] Viết script INSERT dữ liệu mẫu cho 4 khóa học:
    - BIM Overview
    - CDE Setup
    - BIM Management & Coordination
    - ISO 19650 Specialist
5. [ ] Thiết lập RLS Policies.

## Files to Create/Modify
- `supabase_schema.sql` (hoặc file migration mới) - Cập nhật schema.

## Test Criteria
- [ ] Admin có thể SELECT từ `training_courses`.
- [ ] User (anon) có thể SELECT từ `training_courses`.
- [ ] User (anon) có thể INSERT vào `leads`.
- [ ] Admin có thể SELECT từ `leads`.
- [ ] User (anon) KHÔNG THỂ SELECT từ `leads`.

## Notes
- Dùng ảnh placeholder cho khóa học nếu chưa có ảnh thật.
- `curriculum` lưu dạng JSONB để linh hoạt cấu trúc chương học.

---
Next Phase: [Phase 02](phase-02-frontend.md)
