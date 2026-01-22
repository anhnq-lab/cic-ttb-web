# 🔧 Quick Fix Guide - Data & Login Issues

## Vấn đề hiện tại

1. ❌ **Không load được dữ liệu dự án** - Trang trống
2. ❌ **Không đăng nhập được admin**

## Nguyên nhân

App đang try gọi backend API (`/api/projects`), nhưng:
- Backend Express server chưa được start
- Database có thể chưa có seed data

## ✅ Solution 1: Start Backend Server (RECOMMENDED)

### Bước 1: Kiểm tra có file .env không

```bash
cd d:\QuocAnh\CIC_TTB_WEB

# Nếu chưa có .env.local, copy từ .env.example
copy .env.example .env.local
```

### Bước 2: Edit .env.local với Supabase credentials

File đã có sẵn hardcoded trong code:
```
SUPABASE_URL=https://dsrquyuuqjcykyjrlrpb.supabase.co  
SUPABASE_KEY=eyJhbGci...
```

### Bước 3: Start Backend Server

```bash
# Terminal 1: Backend
node server/index.js

# Terminal 2: Frontend
npm run dev
```

### Bước 4: Seed database (nếu cần)

```bash
node server/seed_projects.js
node server/seed_library.js  
node server/seed_news.js
```

---

## ✅  Solution 2: Quick Fix - Dùng Supabase Direct

Tôi sẽ modify code để bypass backend và dùng Supabase trực tiếp.

### Modify `services/api.ts`:

Change line 10:
```typescript
const USE_REAL_API = false; // Tạm thời dùng fallback
```

**Kết quả**: App sẽ dùng localStorage fallback (mock data), hoạt động ngay không cần backend.

---

## ✅ Login Admin Issue

### Credentials mặc định:
- Username: `admin`
- Password: `admin123_secure_password`

### If still cannot login:

1. Check console browser (F12) xem có error không
2. Try clear cache: Ctrl + Shift + Delete
3. Check backend logs

---

## 🚀 Recommended Next Steps

1. **Immediate**: Tôi sẽ modify code để app hoạt động ngay (bypass backend)
2. **Long term**: Setup backend server proper với PM2

Bạn muốn tôi:
- [ ] Modify code ngay để app hoạt động (no backend needed)?
- [ ] Hướng dẫn start backend server?  
- [ ] Tạo mock data để test UI?
