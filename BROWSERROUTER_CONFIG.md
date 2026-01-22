# Nginx Configuration for BrowserRouter Support

## For production deployment, add this to your nginx.conf:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name cic-bim-hub.vn www.cic-bim-hub.vn;
    
    root /var/www/cic-bim/dist;
    index index.html;
    
    # BrowserRouter support - redirect all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (if using separate backend)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Test locally:
```bash
npm run build
npx serve dist
```

The BrowserRouter will now work with clean URLs (no #):
- Before: `/#/cic-platform`
- After: `/cic-platform`
