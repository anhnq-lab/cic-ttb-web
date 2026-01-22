# Hướng Dẫn Triển Khai CIC.Website-TTBIM

Tài liệu này hướng dẫn cách đưa website lên môi trường Internet (Production).

## 1. Yêu cầu Hệ thống

| Yêu cầu | Giá trị |
|---------|---------|
| **Node.js** | Phiên bản 18.0 trở lên |
| **Disk Space** | Ít nhất 1GB |
| **RAM** | Khuyến nghị 1GB trở lên |

## 2. Cấu trúc Triển khai

Hệ thống theo mô hình **"Monolith"** đơn giản:
- Backend (Node.js/Express) chạy trên cổng `3000`
- Backend phục vụ luôn file giao diện (Frontend) đã build
- Dữ liệu SQLite lưu trực tiếp trên file

## 3. Các bước Triển khai

### Bước 1: Cấu hình Môi trường
```bash
# Copy file cấu hình mẫu
cp .env.example .env.local

# Mở file và điền các giá trị
nano .env.local
```

**Các biến cần cấu hình:**
| Biến | Mô tả |
|------|-------|
| `NODE_ENV` | Đặt là `production` |
| `PORT` | Cổng chạy server (mặc định 3000) |
| `GEMINI_API_KEY` | API key cho tính năng AI |

### Bước 2: Build Frontend
```bash
# Tại thư mục gốc dự án
npm install
npm run build
```

### Bước 3: Upload lên Server
Upload các thư mục/file sau:
```
/var/www/cic-bim/
├── dist/               # Frontend đã build
├── server/             # Backend
│   ├── index.js
│   ├── database.js
│   ├── package.json
│   └── database.sqlite # Sẽ tự tạo
└── .env.local          # File cấu hình
```

### Bước 4: Cài đặt Dependencies trên Server
```bash
cd /var/www/cic-bim/server
npm install --production
```

### Bước 5: Chạy với PM2
```bash
# Cài PM2 (nếu chưa có)
npm install -g pm2

# Chạy server
NODE_ENV=production pm2 start index.js --name "cic-bim-web"

# Lưu cấu hình để tự restart
pm2 save
pm2 startup
```

## 4. Cấu hình Nginx (Khuyến nghị)

```nginx
server {
    listen 80;
    server_name cic-bim-hub.vn www.cic-bim-hub.vn;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cic-bim-hub.vn www.cic-bim-hub.vn;

    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/cic-bim-hub.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cic-bim-hub.vn/privkey.pem;

    # Proxy to Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Tối ưu static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Cài SSL với Certbot
```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx

# Lấy SSL certificate
sudo certbot --nginx -d cic-bim-hub.vn -d www.cic-bim-hub.vn

# Tự động gia hạn
sudo certbot renew --dry-run
```

## 5. Sao lưu Dữ liệu

Toàn bộ dữ liệu nằm trong `server/database.sqlite`.

```bash
# Sao lưu
cp server/database.sqlite backup/database_$(date +%Y%m%d).sqlite

# Khôi phục
cp backup/database_YYYYMMDD.sqlite server/database.sqlite
pm2 restart cic-bim-web
```

## 6. Tài khoản Quản trị

| Thông tin | Giá trị |
|-----------|---------|
| **URL** | `https://domain.com/admin` |
| **Mật khẩu** | `admin123` |

> [!WARNING]
> **Bảo mật**: Nên thêm lớp xác thực Nginx Basic Auth cho đường dẫn `/admin`.

```nginx
location /admin {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://127.0.0.1:3000;
}
```

## 7. Kiểm tra Sức khỏe

```bash
# Kiểm tra server
pm2 status

# Xem logs
pm2 logs cic-bim-web

# Monitor realtime
pm2 monit
```

## 8. Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| Port 3000 đã dùng | Đổi PORT trong `.env.local` |
| AI không hoạt động | Kiểm tra GEMINI_API_KEY |
| 502 Bad Gateway | Kiểm tra PM2 có chạy không |
| Frontend trắng | Kiểm tra đã build chưa |
