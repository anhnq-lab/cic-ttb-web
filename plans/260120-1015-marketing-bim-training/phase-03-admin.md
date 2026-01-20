# Phase 03: Admin Dashboard
Status: ⬜ Pending
Dependencies: phase-02-frontend.md

## Objective
Cung cấp công cụ cho Admin quản lý nội dung khóa học và xem danh sách người đăng ký (Leads).

## Requirements
### Functional
- [ ] Admin xem được danh sách Leads.
- [ ] Admin lọc/tìm kiếm Leads và đổi trạng thái (Mới -> Đã xử lý).
- [ ] Admin có thể Thêm/Sửa/Xóa khóa học.
- [ ] Tích hợp Rich Text Editor cho phần mô tả khóa học.

## Implementation Steps
1. [ ] Cập nhật `AdminLayout` thêm menu "Leads" và "Courses".
2. [ ] Tạo `src/components/admin/LeadManager.tsx` (Table view).
3. [ ] Tạo `src/components/admin/TrainingManager.tsx` (CRUD Courses).
4. [ ] (Optional) Tích hợp `react-quill` cho editor nếu cần thiết, hoặc dùng `textarea` đơn giản trước.

## Files to Create/Modify
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/LeadManager.tsx`
- `src/components/admin/TrainingManager.tsx`

## Test Criteria
- [ ] Đăng nhập Admin, vào phần Leads thấy dữ liệu test ở Phase 2.
- [ ] Đổi trạng thái Lead thành công.
- [ ] Sửa thử tiêu đề khóa học -> Ra trang chủ kiểm tra thấy cập nhật.

---
Next Phase: [Phase 04](phase-04-testing.md)
