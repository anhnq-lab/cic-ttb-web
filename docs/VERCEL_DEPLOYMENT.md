# 🚀 Vercel Deployment Guide

## Prerequisites

- GitHub repository: `anhnq-lab/cic-ttb-web`
- Vercel account connected to GitHub
- Supabase project running

---

## 1. Environment Variables Setup

Trên Vercel Dashboard → Project Settings → Environment Variables, add:

### Server Configuration
```
PORT=3000
NODE_ENV=production
```

### Security
```
JWT_SECRET=cic_super_secure_jwt_secret_key_2024_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123_secure_password
```

### Database (Supabase)
```
SUPABASE_URL=https://dsrquyuuqjcykyjrlrpb.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnF1eXV1cWpjeWt5anJscnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM1NDY3NSwiZXhwIjoyMDgzOTMwNjc1fQ.xg9TpYgJ3_cvvgHH33TFT4JCxglKzrdT7G-TxPz5POY
```

### Frontend (Vite) - For build time
```
VITE_SUPABASE_URL=https://dsrquyuuqjcykyjrlrpb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnF1eXV1cWpjeWt5anJscnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM1NDY3NSwiZXhwIjoyMDgzOTMwNjc1fQ.xg9TpYgJ3_cvvgHH33TFT4JCxglKzrdT7G-TxPz5POY
```

### AI (Optional)
```
GEMINI_API_KEY=your_gemini_api_key_if_needed
```

---

## 2. Deploy Steps

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import `anhnq-lab/cic-ttb-web`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add all environment variables above
6. Click "Deploy"

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

---

## 3. Custom Domain (Optional)

1. Vercel Dashboard → Domains
2. Add `cic-bim-hub.vn`
3. Update DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

---

## 4. Verify Deployment

After deployment:

1. **Check API**: `https://your-app.vercel.app/api/projects`
2. **Check Frontend**: `https://your-app.vercel.app`
3. **Test Login**: Admin credentials from env vars

---

## 5. Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all env vars are set
- Ensure `vercel.json` is committed

### API Not Working
- Check Vercel Functions logs
- Verify Supabase URL/KEY are correct
- Check CORS settings in `server/index.js`

### Frontend Not Loading Data
- Check Network tab (F12)
- Verify API_BASE_URL in `services/api.ts`
- Check Supabase connection

---

## 6. Auto-Deploy

Vercel automatically deploys on:
- ✅ Push to `main` branch
- ✅ Pull Request (preview deployment)

To disable: Vercel Dashboard → Settings → Git

---

## 7. Monitoring

- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Functions → Logs
- **Performance**: Vercel Dashboard → Speed Insights

---

## 8. Rollback

If deployment fails:
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

---

**Quick Deploy Checklist:**
- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Test API and frontend
- [ ] Configure custom domain (optional)
