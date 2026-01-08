# KẾ HOẠCH HOÀN THIỆN VÀ TRIỂN KHAI WEBSITE CIC PLATFORM

**Ngày lập**: 06/01/2026  
**Người lập**: Digital Marketing Admin  
**Phiên bản**: 1.0

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Sitemap - Cấu trúc Website](#2-sitemap---cấu-trúc-website)
3. [Các tính năng Website](#3-các-tính-năng-website)
4. [Kế hoạch triển khai lên Internet](#4-kế-hoạch-triển-khai-lên-internet)
5. [Kế hoạch Marketing](#5-kế-hoạch-marketing)
6. [Kế hoạch SEO](#6-kế-hoạch-seo)
7. [Timeline tổng thể](#7-timeline-tổng-thể)
8. [Checklist trước Go-live](#8-checklist-trước-go-live)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Giới thiệu

**CIC Platform** là nền tảng Quản trị số & BIM hàng đầu Việt Nam, được xây dựng để phục vụ ngành xây dựng với các mục tiêu:

- Chuẩn hóa quy trình theo BIM 2026
- Đảm bảo tuân thủ pháp lý (NĐ 175/2024, NĐ 111/2024)
- Tối ưu hóa hiệu suất dự án

### 1.2 Tầm nhìn

Trở thành nền tảng quản trị tiêu chuẩn (Standard Platform) kết nối CĐT - PMU - Tư vấn - Nhà thầu trong hệ sinh thái số ngành xây dựng.

### 1.3 Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | React 18+, TypeScript, Vite, TailwindCSS |
| Backend | Node.js, Express |
| Database | SQLite |
| AI | Google Gemini AI |
| SEO | React Helmet Async |

---

## 2. SITEMAP - CẤU TRÚC WEBSITE

### 2.1 Sơ đồ tổng quan

```
CIC-PLATFORM.VN
│
├── 🏠 TRANG CHỦ (/)
│   ├── Hero Section - Banner chính
│   ├── Tools Section - Bộ công cụ số
│   ├── Services Section - Dịch vụ BIM
│   ├── Portfolio Section - Dự án tiêu biểu
│   ├── Stats Section - Thống kê thành tích
│   ├── Product Section - Sản phẩm CIC-PM
│   ├── Pricing Section - Bảng giá
│   ├── Library Section - Thư viện kiến thức
│   ├── Features Section - Tính năng nổi bật
│   ├── Testimonial Section - Đánh giá khách hàng
│   └── News Section - Tin tức
│
├── 📦 CIC-PLATFORM (/cic-platform)
│   ├── USP Section - Điểm bán hàng độc đáo
│   ├── Legal Basis - Cơ sở pháp lý
│   ├── Customer Segments - Phân khúc khách hàng
│   ├── Architecture - Kiến trúc hệ thống
│   ├── ROI Section - Phân tích lợi nhuận
│   └── Roadmap Section - Lộ trình phát triển
│
├── 📰 TIN TỨC (/news/:id)
│   └── Chi tiết bài viết
│
└── 🔐 ADMIN (/admin)
    ├── Dashboard
    ├── Quản lý Tin tức
    ├── Quản lý Thư viện
    ├── Quản lý Dự án
    ├── Quản lý Khách hàng
    ├── Quản lý Hợp đồng
    └── Analytics
```

### 2.2 Danh sách URL

| URL | Trang | Mô tả |
|-----|-------|-------|
| `/` | Trang chủ | Landing page chính |
| `/cic-platform` | Chi tiết sản phẩm | Trang giới thiệu CIC-Platform |
| `/news/:id` | Chi tiết tin tức | Trang chi tiết bài viết |
| `/admin` | Admin Dashboard | Quản trị nội dung |

### 2.3 Anchor Links

| Anchor | Section |
|--------|---------|
| `#tools` | Bộ công cụ số |
| `#services` | Dịch vụ |
| `#portfolio` | Dự án tiêu biểu |
| `#products` | Sản phẩm CIC-PM |
| `#pricing` | Bảng giá |
| `#library` | Thư viện kiến thức |
| `#news` | Tin tức |

---

## 3. CÁC TÍNH NĂNG WEBSITE

### 3.1 Tính năng Frontend

| STT | Tính năng | Mô tả | Trạng thái |
|-----|-----------|-------|------------|
| 1 | Hero Banner | Banner động với CTA "Khám phá CIC Platform" | ✅ Hoàn thành |
| 2 | Bộ công cụ số | Trợ lý AI, Assessment, Toolkit download | ✅ Hoàn thành |
| 3 | Dịch vụ | 3 nhóm dịch vụ BIM chính | ✅ Hoàn thành |
| 4 | Portfolio dự án | Showcase các dự án đã triển khai | ✅ Hoàn thành |
| 5 | Thống kê ấn tượng | Số liệu thành tích | ✅ Hoàn thành |
| 6 | Sản phẩm CIC-PM | Chi tiết phần mềm quản lý dự án | ✅ Hoàn thành |
| 7 | Bảng giá | Các gói phần mềm và dịch vụ | ✅ Hoàn thành |
| 8 | Thư viện kiến thức | Tài liệu, video, template | ✅ Hoàn thành |
| 9 | Tin tức | Bài viết cập nhật pháp lý, xu hướng | ✅ Hoàn thành |
| 10 | Testimonials | Đánh giá từ khách hàng | ✅ Hoàn thành |
| 11 | AI Chat Widget | Chatbot Gemini AI 24/7 | ✅ Hoàn thành |
| 12 | SEO Component | Meta tags, Open Graph, Schema | ✅ Hoàn thành |
| 13 | Cookie Consent | Tuân thủ GDPR | ✅ Hoàn thành |
| 14 | Responsive Design | Mobile-first | ✅ Hoàn thành |

### 3.2 Hệ thống Modal

| Modal | Chức năng |
|-------|-----------|
| ContactModal | Form liên hệ tư vấn dịch vụ |
| LoginModal | Đăng nhập/Đăng ký tài khoản |
| SearchModal | Tìm kiếm nội dung toàn site |
| LeadCaptureModal | Thu thập thông tin lead |
| AssessmentModal | Đánh giá mức độ sẵn sàng BIM |

### 3.3 Admin Dashboard

| Module | Tính năng |
|--------|-----------|
| Dashboard | Tổng quan thống kê, biểu đồ |
| Tin tức | CRUD bài viết, rich text editor |
| Thư viện | Quản lý tài liệu, video |
| Dự án | Portfolio dự án đã triển khai |
| Khách hàng | CRM quản lý khách hàng |
| Hợp đồng | Quản lý hợp đồng dịch vụ |
| Liên hệ | Xem form liên hệ từ website |
| Analytics | Phân tích lượt truy cập |

### 3.4 Backend API

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/news` | GET, POST | Quản lý tin tức |
| `/api/news/:id` | GET, PUT, DELETE | Chi tiết tin tức |
| `/api/contact` | GET, POST | Form liên hệ |
| `/api/library` | GET, POST | Thư viện kiến thức |
| `/api/chat` | POST | AI Chatbot (Gemini) |
| `/api/analytics/*` | GET, POST | Tracking & Analytics |

---

## 4. KẾ HOẠCH TRIỂN KHAI LÊN INTERNET

### 4.1 Giai đoạn 1: Chuẩn bị (1-2 ngày)

| STT | Công việc | Chi tiết | Người thực hiện |
|-----|-----------|----------|-----------------|
| 1 | Mua tên miền | `cic-platform.vn` | Admin |
| 2 | Thuê VPS/Cloud | Node.js hosting (DigitalOcean, AWS) | Dev |
| 3 | Cấu hình DNS | Trỏ domain về IP server | Admin |
| 4 | Cài đặt môi trường | Node.js 18+, PM2, Nginx | Dev |

### 4.2 Giai đoạn 2: Deploy (1 ngày)

**Các bước thực hiện:**

1. Clone code lên server
2. Cấu hình environment (.env.local)
3. Build frontend: `npm install && npm run build`
4. Cài đặt backend: `cd server && npm install --production`
5. Chạy với PM2: `pm2 start index.js --name "cic-platform"`
6. Cấu hình Nginx & SSL

### 4.3 Giai đoạn 3: Kiểm tra (1 ngày)

| Checklist |
|-----------|
| ☐ Website hiển thị đúng trên desktop/mobile |
| ☐ Tất cả links hoạt động |
| ☐ AI Chatbot phản hồi |
| ☐ Form liên hệ gửi được |
| ☐ Admin dashboard đăng nhập được |
| ☐ SSL certificate active (HTTPS) |
| ☐ Page speed > 85/100 |

---

## 5. KẾ HOẠCH MARKETING

### 5.1 Đối tượng mục tiêu

| Persona | Đặc điểm | Pain Points |
|---------|----------|-------------|
| Ban QLDA vốn Ngân sách | 35-55 tuổi, khối công | Tuân thủ NĐ 175, NĐ 111 |
| Chủ đầu tư BĐS | CEO/Director | Quản lý dòng tiền, tiến độ |
| Đơn vị Tư vấn TK/GS | Kỹ sư BIM | Chuẩn ISO 19650, CDE |
| Nhà thầu thi công | Kỹ sư công trường | Quản lý vật tư, HSE |

### 5.2 Kênh Marketing

| Kênh | Mục tiêu | Ngân sách/tháng | KPI |
|------|----------|-----------------|-----|
| Google Ads | Lead generation | 15-30 triệu | 50 leads/tháng |
| LinkedIn Ads | B2B awareness | 10-20 triệu | 500 profile views |
| Facebook | Awareness | 5-10 triệu | 10,000 reach |
| Email Marketing | Nurturing | 2-5 triệu | 25% open rate |
| Event/Webinar | Thought leadership | 10-20 triệu | 100 participants |

### 5.3 Content Calendar (Tháng đầu)

| Tuần | Thứ 2 | Thứ 4 | Thứ 6 |
|------|-------|-------|-------|
| Tuần 1 | Tin pháp lý: NĐ 175/2024 | Hướng dẫn: BIM 3D là gì? | Tips: 5 lỗi BIM phổ biến |
| Tuần 2 | Case study khách hàng | So sánh: Revit vs ArchiCAD | Video: Demo CIC-PM |
| Tuần 3 | Tin pháp lý: NĐ 111/2024 | Hướng dẫn: Lập EIR/BEP | Infographic: Lộ trình BIM 2026 |
| Tuần 4 | Interview: Leader ngành | Whitepaper: Digital Twin | Webinar announcement |

### 5.4 Chiến dịch Marketing chính

**Chiến dịch 1: "BIM 2026 - Sẵn sàng hay không?"**
- Mục tiêu: Awareness về lộ trình BIM bắt buộc
- Thời gian: 1 tháng
- Hoạt động: Landing page, Assessment tool, Email series, Webinar

**Chiến dịch 2: "Tuân thủ pháp lý NĐ 175"**
- Mục tiêu: Lead generation từ PMU công
- Thời gian: 2 tháng
- Hoạt động: Checklist download, Tư vấn miễn phí, Case study

---

## 6. KẾ HOẠCH SEO

### 6.1 Technical SEO

| Hạng mục | Trạng thái | Hành động |
|----------|------------|-----------|
| HTTPS | ✅ Có | Đảm bảo SSL active |
| Mobile-friendly | ✅ Có | Kiểm tra Google Mobile Test |
| Page speed | ⚠️ Cần tối ưu | Target Core Web Vitals |
| Sitemap.xml | ⚠️ Cần tạo | Generate và submit GSC |
| Robots.txt | ⚠️ Cần tạo | Cấu hình crawler access |
| Schema markup | ⚠️ Cần thêm | Organization, Article schema |

### 6.2 Keywords chiến lược

| Loại | Keywords | Search Volume |
|------|----------|---------------|
| Primary | BIM Việt Nam, Quản lý dự án xây dựng | 1,000-5,000/tháng |
| Secondary | NĐ 175/2024, ISO 19650, CDE platform | 500-1,000/tháng |
| Long-tail | "Phần mềm quản lý công trình tốt nhất" | 100-500/tháng |
| Local | "Tư vấn BIM Hà Nội", "BIM Sài Gòn" | 100-300/tháng |

### 6.3 Meta Tags chuẩn

**Trang chủ:**
- Title: "CIC Platform | Nền tảng Quản trị số & BIM hàng đầu Việt Nam"
- Description: "Giải pháp chuyển đổi số toàn diện cho ngành xây dựng. Tư vấn BIM, đào tạo, nền tảng CDE chuẩn ISO 19650."

**CIC-Platform:**
- Title: "CIC-Platform | Hệ điều hành số ngành Xây dựng"
- Description: "Phần mềm quản lý dự án xây dựng tích hợp BIM. Quản lý tiến độ, chi phí, tài liệu trên một nền tảng."

### 6.4 Pillar Content

1. "Hướng dẫn toàn diện BIM cho người mới bắt đầu" (3,000+ từ)
2. "NĐ 175/2024: Tất cả những gì bạn cần biết" (2,000+ từ)
3. "ISO 19650: Tiêu chuẩn quản lý thông tin BIM" (2,500+ từ)
4. "Lựa chọn phần mềm quản lý dự án xây dựng 2026" (2,000+ từ)

### 6.5 Off-Page SEO

| Hoạt động | Mục tiêu | Số lượng/tháng |
|-----------|----------|----------------|
| Guest posting | Backlinks DA 40+ | 2-3 bài |
| Directory listings | Local SEO | 5-10 listings |
| Press releases | Brand awareness | 1-2 bài |
| Industry forums | Community building | 10+ contributions |

### 6.6 KPIs SEO

| KPI | Baseline | Target 3 tháng | Target 6 tháng |
|-----|----------|----------------|----------------|
| Organic traffic | 0 | 1,000/tháng | 5,000/tháng |
| Keyword rankings (top 10) | 0 | 10 keywords | 30 keywords |
| Domain Authority | 0 | DA 15 | DA 25 |
| Lead từ organic | 0 | 20/tháng | 50/tháng |

---

## 7. TIMELINE TỔNG THỂ

| Giai đoạn | Thời gian | Công việc chính |
|-----------|-----------|-----------------|
| **Chuẩn bị** | Ngày 1-2 | Mua domain, hosting, cấu hình server |
| **Deploy** | Ngày 3 | Build, deploy, cài SSL |
| **Kiểm tra** | Ngày 4-5 | Test toàn bộ tính năng, fix bugs |
| **SEO Foundation** | Ngày 6-10 | Sitemap, Google Search Console, GA4 |
| **Marketing Launch** | Tuần 2-3 | Content pillar, social media, email |
| **Ongoing** | Tuần 4+ | Content marketing, SEO, Paid ads |

---

## 8. CHECKLIST TRƯỚC GO-LIVE

### 8.1 Technical Checklist

- [ ] SSL certificate đã cài và active
- [ ] Tất cả pages load < 3 giây
- [ ] Mobile responsive test pass
- [ ] Form liên hệ hoạt động
- [ ] AI Chatbot phản hồi đúng
- [ ] Admin dashboard secure

### 8.2 SEO Checklist

- [ ] Sitemap.xml đã tạo và submit
- [ ] Robots.txt cấu hình đúng
- [ ] Meta tags đầy đủ mọi trang
- [ ] Google Analytics 4 tracking
- [ ] Google Search Console verified
- [ ] Schema markup Organization

### 8.3 Content Checklist

- [ ] Tối thiểu 5 bài tin tức
- [ ] Tối thiểu 10 items thư viện
- [ ] 3-5 testimonials với ảnh
- [ ] Portfolio 5-10 dự án
- [ ] FAQ section đầy đủ

### 8.4 Marketing Checklist

- [ ] Social media profiles created
- [ ] Email list setup
- [ ] UTM parameters configured
- [ ] Tracking pixels installed
- [ ] Content calendar 1 tháng

---

**LƯU Ý**: Để xuất file này sang DOC:
1. Mở file bằng VS Code hoặc Notepad
2. Copy toàn bộ nội dung
3. Paste vào Microsoft Word
4. Hoặc sử dụng công cụ online: https://cloudconvert.com/md-to-docx

---

**Tài liệu cập nhật**: 06/01/2026  
**Người lập**: Digital Marketing Admin  
**Liên hệ**: marketing@cic-platform.vn
