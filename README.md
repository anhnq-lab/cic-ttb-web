# CIC BIM Hub Vietnam 🏗️

<div align="center">

[![CI/CD](https://github.com/anhnq-lab/cic-ttb-web/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/anhnq-lab/cic-ttb-web/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org)

**Platform tư vấn và đào tạo BIM & Digital Twin hàng đầu Việt Nam**

[Website](https://cic-bim-hub.vn) • [Documentation](.github/README.md) • [Changelog](CHANGELOG.md)

</div>

---

## 🎯 Overview

CIC BIM Hub là nền tảng toàn diện cung cấp dịch vụ tư vấn, đào tạo và giải pháp BIM (Building Information Modeling) & Digital Twin cho ngành xây dựng Việt Nam.

### ✨ Features

- 🏢 **Tư vấn chuyên nghiệp**: Dịch vụ tư vấn BIM từ cơ bản đến nâng cao
- 📚 **Thư viện tài liệu**: Tài liệu, template, infographic BIM tiêu chuẩn
- 🎓 **Đào tạo trực tuyến**: Khóa học BIM chuyên nghiệp với chứng chỉ
- 🤖 **AI Chatbot**: Hỗ trợ tư vấn 24/7 với Google Gemini
- 📰 **Tin tức & Blog**: Cập nhật xu hướng BIM mới nhất
- 🛠️ **Công cụ hỗ trợ**: Tools và plugin tối ưu workflow

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version

### Installation

```bash
# Clone repository
git clone https://github.com/anhnq-lab/cic-ttb-web.git
cd cic-ttb-web

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app! 🎉

---

## 📦 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite 6.2** - Build tool & dev server
- **React Router v7** - Client-side routing
- **Zustand** - Global state management
- **React Query** - Server state & caching
- **React Helmet Async** - SEO meta tags

### Backend
- **Node.js + Express** - REST API server
- **Supabase** - PostgreSQL database & auth
- **Google Gemini** - AI chatbot integration
- **JWT** - Authentication

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Vercel/GitHub Pages** - Static hosting
- **Nginx** - Production web server

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │  Pages   │  │Components│  │  State (Zustand│ │
│  │          │←─┤          │←─┤  + React Query)│ │
│  └──────────┘  └──────────┘  └───────────────┘ │
└────────────────────┬────────────────────────────┘
                     │ API Calls
┌────────────────────▼────────────────────────────┐
│              Backend (Express)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Routes  │─▶│Controllers│─▶│  Services    │  │
│  └──────────┘  └──────────┘  └──────┬───────┘  │
└────────────────────────────────────┬─┴──────────┘
                                     │
                    ┌────────────────▼────────────┐
                    │   Database (Supabase)       │
                    │  PostgreSQL + RLS Policies  │
                    └─────────────────────────────┘
```

---

## 📂 Project Structure

```
cic-ttb-web/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── components/             # React components
│   ├── shared/            # Reusable components
│   └── ...
├── pages/                 # Route pages
├── services/              # API services & queries
├── store/                 # Zustand state management
├── lib/                   # Utilities & config
├── server/                # Express backend
├── public/                # Static assets
└── scripts/               # Build & utility scripts
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 5173)

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Deployment
npm run deploy           # Deploy to GitHub Pages

# Utilities
node scripts/scan-images.js  # Scan for placeholder images
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# AI
GEMINI_API_KEY=your_gemini_api_key

# Security
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### BrowserRouter Configuration

For production deployment with clean URLs:

```nginx
# nginx.conf
location / {
    try_files $uri $uri/ /index.html;
}
```

See [BROWSERROUTER_CONFIG.md](BROWSERROUTER_CONFIG.md) for details.

---

## 🚦 CI/CD Pipeline

Automatic deployment via GitHub Actions:

- ✅ **Build verification** on every push
- ✅ **TypeScript checking** on PRs
- ✅ **Bundle size monitoring**
- ✅ **Auto-deploy to GitHub Pages** (main branch)

Check workflow status: [Actions](https://github.com/anhnq-lab/cic-ttb-web/actions)

---

## 📊 Performance

### Metrics (After Optimization)

- **Bundle Size**: 150KB gzipped (main)
- **First Contentful Paint**: ~1.5s
- **Time to Interactive**: ~2.5s
- **Lighthouse Score**: 85-90

### Code Splitting

- Main bundle: 150KB
- AdminDashboard chunk: 94KB (lazy)
- Page chunks: 4-7KB each (lazy)
- ChatWidget: 3KB (lazy, 3s delay)

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## 📝 Documentation

- [Project Analysis](C:/Users/nguye/.gemini/antigravity/brain/109c9986-1f12-42cd-bccf-4768bc5bc9c7/project_analysis.md)
- [Technical Debt Resolution](C:/Users/nguye/.gemini/antigravity/brain/109c9986-1f12-42cd-bccf-4768bc5bc9c7/final_session_summary.md)
- [GitHub Actions Guide](.github/README.md)
- [BrowserRouter Config](BROWSERROUTER_CONFIG.md)
- [Deployment Guide](DEPLOYMENT.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI-powered chatbot
- **Supabase** - Backend infrastructure
- **Vercel** - Hosting platform

---

## 📞 Contact

- **Website**: [cic-bim-hub.vn](https://cic-bim-hub.vn)
- **Email**: contact@cic-platform.vn
- **GitHub**: [@anhnq-lab](https://github.com/anhnq-lab)

---

<div align="center">
Made with ❤️ by CIC Platform Team
</div>
