# Phase 02: Frontend Marketing UI
Status: ✅ Complete
Dependencies: phase-01-database.md

## Objective
Xây dựng giao diện hiển thị danh sách khóa học và trang chi tiết khóa học, cho phép người dùng xem thông tin và đăng ký tư vấn.

## Requirements
### Functional
- [ ] Trang danh sách khóa học (`/dao-tao`) hiển thị đẹp mắt.
- [ ] Trang chi tiết khóa học (`/dao-tao/:slug`) hiển thị đầy đủ thông tin.
- [ ] Form đăng ký tư vấn (Lead Form) hoạt động tốt, gửi dữ liệu về Supabase.
- [ ] Responsive design trên Mobile/Tablet.

## Implementation Steps
1. [ ] Tạo `src/services/trainingService.ts` để gọi API Supabase (lấy khóa học, gửi lead).
2. [ ] Tạo component `CourseCard` và trang `TrainingList` tại `src/pages/training/TrainingList.tsx`.
3. [ ] Tạo component `LeadForm` tại `src/components/marketing/LeadForm.tsx`.
4. [ ] Tạo trang `TrainingDetail` tại `src/pages/training/TrainingDetail.tsx` (dùng `react-router-dom` dynamic route).
5. [ ] Cập nhật `App.tsx` để thêm routes mới.
6. [ ] Cập nhật `Navbar` để thêm link "Đào tạo".

## Files to Create/Modify
- `src/services/trainingService.ts`
- `src/pages/training/TrainingList.tsx`
- `src/pages/training/TrainingDetail.tsx`
- `src/components/marketing/LeadForm.tsx`
- `App.tsx`
- `components/Navbar.tsx`

## Test Criteria
- [ ] Truy cập `/dao-tao` thấy danh sách 4 khóa học.
- [ ] Click vào khóa học chuyển sang trang chi tiết đúng nội dung.
- [ ] Điền form và submit thành công, không lỗi console.
- [ ] Kiểm tra lại database bảng `leads` thấy record mới.

---
Next Phase: [Phase 03](phase-03-admin.md)
