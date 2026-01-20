# Plan: Completion & Refactoring
Created: 2026-01-20
Status: 🟡 In Progress

## Overview
Kế hoạch này tập trung vào việc "hoàn thiện" website Fullstack hiện tại dựa trên kết quả Audit, đưa code về trạng thái Clean Architecture, bảo mật và sẵn sàng cho các tính năng CDE/Digital Twin phức tạp trong tương lai.

## Tech Stack
- **Frontend:** Vite + React + TypeScript
- **Backend:** Node.js + Express (Refactor from Monolith)
- **Database:** Supabase (Single Source of Truth)
- **AI:** Google Gemini

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | **Security & Stabilization** | ⬜ Pending | 0% |
| 02 | **Backend Refactoring** | ⬜ Pending | 0% |
| 03 | **Feature Completion (Admin)** | ⬜ Pending | 0% |
| 04 | **Performance & SEO** | ⬜ Pending | 0% |

## Phase Details

### Phase 01: Security & Stabilization (Sửa Critical Issues)
- [ ] Cài đặt `zod` và thêm Validation Middleware cho tất cả API (News, Contacts, Tools...).
- [ ] Thêm `express-rate-limit` để chống spam.
- [ ] Bảo mật Headers với `helmet`.
- [ ] Review và xóa các đoạn code hardcode sensitive data (nếu sót).

### Phase 02: Backend Refactoring (Chuẩn hóa Architecture)
- [ ] Tách `server/index.js` thành các Controllers:
  - `controllers/newsController.js`
  - `controllers/libraryController.js`
  - `controllers/toolController.js`
  - `controllers/contactController.js`
  - `controllers/analyticsController.js`
- [ ] Tách Routes tương ứng vào `routes/`.
- [ ] Tạo centralized `errorMiddleware.js`.
- [ ] Setup `winston` logging.

### Phase 03: Feature Completion (Admin UI)
- [ ] Rà soát Frontend Admin Dashboard.
- [ ] Kết nối API Analytics thực tế (thay vì Mock data).
- [ ] Đảm bảo tính năng Upload ảnh (News/Library) hoạt động trơn tru với Supabase Storage.

### Phase 04: Performance & SEO
- [ ] Tối ưu ảnh (WebP).
- [ ] Cấu hình SEO metadata động cho từng bài News.
- [ ] Setup Caching đơn giản nếu cần.

## Next Steps
- Start Phase 1: `/code phase-01`
- Save context: `/save-brain`
