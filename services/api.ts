// API Service for BIM Hub Website - Production Ready
// Automatically detects environment and uses real backend or localStorage fallback

// Use Mock API if on GitHub Pages (static site) or explicitly set
const isGitHubPages = window.location.hostname.includes('github.io');
const RENDER_API_URL = 'https://cic-ttb-web.onrender.com/api';

const API_BASE_URL = isGitHubPages ? RENDER_API_URL : '/api';
const USE_REAL_API = true; // Always attempt to use real API now that we have Render

// Helper for localStorage (development fallback)
const getData = (key: string, defaultValue: any) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const saveData = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(new Event('storage-update-' + key));
    } catch (e) {
        console.error('Save failed', e);
    }
};

// Default pricing packages
const defaultPricingPackages = [
    {
        id: 'starter',
        name: 'Gói Khởi Đầu',
        type: 'software',
        description: 'Phù hợp cho doanh nghiệp nhỏ, dự án đơn lẻ',
        price: '5.900.000đ',
        period: '/tháng',
        isPopular: false,
        ctaText: 'Bắt đầu dùng thử',
        features: [
            'Quản lý tối đa 3 dự án',
            'Lưu trữ 50GB Cloud',
            'Số hóa Nhật ký công trình',
            'Báo cáo tiến độ cơ bản',
            'Hỗ trợ qua Email',
            'Không có BIM Viewer 3D',
            'Không có tích hợp API'
        ]
    },
    {
        id: 'professional',
        name: 'Gói Chuyên Nghiệp',
        type: 'software',
        description: 'Dành cho PMU và tổ chức tư vấn giám sát',
        price: '12.900.000đ',
        period: '/tháng',
        isPopular: true,
        ctaText: 'Liên hệ tư vấn',
        features: [
            'Quản lý không giới hạn dự án',
            'Lưu trữ 500GB Cloud',
            'Số hóa toàn bộ quy trình',
            'BIM Viewer 3D Online',
            'Báo cáo tuân thủ pháp lý',
            'Tích hợp e-Office / ERP',
            'Hỗ trợ 24/7 qua Hotline',
            'Đào tạo nhân sự (4 buổi)'
        ]
    },
    {
        id: 'enterprise',
        name: 'Gói Doanh Nghiệp',
        type: 'software',
        description: 'Giải pháp toàn diện cho tập đoàn lớn',
        price: 'Liên hệ',
        period: '',
        isPopular: false,
        ctaText: 'Nhận báo giá',
        features: [
            'Mọi tính năng Chuyên Nghiệp',
            'Lưu trữ không giới hạn',
            'Tùy biến theo quy trình riêng',
            'Digital Twin & IoT Integration',
            'AI phân tích dự báo rủi ro',
            'API mở & tích hợp SAP/Oracle',
            'SLA đảm bảo uptime 99.9%',
            'Đào tạo và triển khai tại chỗ'
        ]
    },
    {
        id: 'legal-service',
        name: 'Tư vấn Pháp lý BIM',
        type: 'service',
        description: 'Hỗ trợ tuân thủ pháp luật xây dựng và tối ưu hồ sơ pháp lý dự án.',
        features: [
            'Rà soát hồ sơ theo NĐ 175/2024',
            'Tư vấn quy trình nghiệm thu',
            'Hỗ trợ quyết toán vốn đầu tư công',
            'Đào tạo Compliance cho team'
        ]
    },
    {
        id: 'bim-consulting',
        name: 'Triển khai BIM Doanh nghiệp',
        type: 'service',
        description: 'Lộ trình chuyển đổi số toàn diện từ đánh giá hiện trạng đến vận hành.',
        features: [
            'Khảo sát và đánh giá năng lực BIM',
            'Xây dựng BIM Execution Plan (BEP)',
            'Setup CDE và quy trình phối hợp',
            'Đào tạo và chuyển giao công nghệ'
        ]
    }
];

// HTTP helper for real API calls
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers, // FIX: Include headers in request
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// Unified API that works in both dev (localStorage) and production (real backend)
export const api = {
    // ===== AUTH =====
    login: async (credentials: any) => {
        if (USE_REAL_API) {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data.user;
        } else {
            // Dev fallback
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                const user = { id: 1, username: 'admin', role: 'admin' };
                localStorage.setItem('authToken', 'dev-token');
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            }
            throw new Error('Mật khẩu không đúng (Dev Mode: admin/admin123)');
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.reload();
    },

    getMe: async () => {
        if (USE_REAL_API) {
            try {
                return await apiRequest('/auth/me');
            } catch (e) {
                return null;
            }
        }
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    // ===== TRACKING =====
    trackView: async (path: string) => {
        console.log(`Tracking view: ${path}`);
        return Promise.resolve();
    },

    // ===== LIBRARY =====
    getLibrary: async () => {
        if (USE_REAL_API) {
            return apiRequest('/library');
        }
        return Promise.resolve(getData('library', []));
    },

    getLibraryDetail: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/library/${id}`);
        }
        const items = getData('library', []);
        const item = items.find((i: any) => i.id == id);
        return item ? Promise.resolve({
            ...item,
            author: item.author || 'CIC Team',
            content: item.content || `<p>${item.description}</p>`,
            attachments: item.attachments || [],
            related: item.related || []
        }) : Promise.resolve(null);
    },

    addLibrary: async (item: any) => {
        if (USE_REAL_API) {
            return apiRequest('/library', {
                method: 'POST',
                body: JSON.stringify(item)
            });
        }
        const items = getData('library', []);
        const newItem = { ...item, id: Date.now(), created_at: new Date().toISOString() };
        saveData('library', [newItem, ...items]);
        return Promise.resolve(newItem);
    },

    updateLibrary: async (id: number | string, data: any) => {
        if (USE_REAL_API) {
            return apiRequest(`/library/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
        const items = getData('library', []).map((i: any) => i.id == id ? { ...i, ...data } : i);
        saveData('library', items);
        return Promise.resolve({ ...data, id });
    },

    deleteLibrary: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/library/${id}`, { method: 'DELETE' });
        }
        const items = getData('library', []);
        saveData('library', items.filter((i: any) => i.id != id));
        return Promise.resolve(id);
    },

    // ===== NEWS =====
    getNews: async () => {
        if (USE_REAL_API) {
            return apiRequest('/news');
        }
        return Promise.resolve(getData('news', []));
    },

    getNewsDetail: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/news/${id}`);
        }
        const items = getData('news', []);
        const item = items.find((i: any) => i.id == id);
        if (item && !item.content) {
            item.content = `<p>${item.excerpt || item.title}</p>`;
            item.author = 'Admin';
            item.attachments = [];
        }
        return Promise.resolve(item || null);
    },

    getRelatedNews: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/news/${id}/related`);
        }
        const items = getData('news', []);
        return Promise.resolve(items.filter((i: any) => i.id != id).slice(0, 3));
    },

    addNews: async (item: any) => {
        if (USE_REAL_API) {
            return apiRequest('/news', {
                method: 'POST',
                body: JSON.stringify(item)
            });
        }
        const items = getData('news', []);
        const newItem = { ...item, id: Date.now(), date: new Date().toLocaleDateString('vi-VN') };
        saveData('news', [newItem, ...items]);
        return Promise.resolve(newItem);
    },

    updateNews: async (id: number | string, data: any) => {
        if (USE_REAL_API) {
            return apiRequest(`/news/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
        const items = getData('news', []).map((i: any) => i.id == id ? { ...i, ...data } : i);
        saveData('news', items);
        return Promise.resolve({ ...data, id });
    },

    deleteNews: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/news/${id}`, { method: 'DELETE' });
        }
        const items = getData('news', []);
        saveData('news', items.filter((i: any) => i.id != id));
        return Promise.resolve(id);
    },

    // ===== TOOLS =====
    getTools: async () => {
        if (USE_REAL_API) {
            return apiRequest('/tools');
        }
        return Promise.resolve(getData('tools', []));
    },

    addTool: async (item: any) => {
        if (USE_REAL_API) {
            return apiRequest('/tools', {
                method: 'POST',
                body: JSON.stringify(item)
            });
        }
        const items = getData('tools', []);
        const newItem = { ...item, id: Date.now() };
        saveData('tools', [newItem, ...items]);
        return Promise.resolve(newItem);
    },

    updateTool: async (id: number | string, data: any) => {
        if (USE_REAL_API) {
            return apiRequest(`/tools/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
        const items = getData('tools', []).map((i: any) => i.id == id ? { ...i, ...data } : i);
        saveData('tools', items);
        return Promise.resolve({ ...data, id });
    },

    deleteTool: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/tools/${id}`, { method: 'DELETE' });
        }
        const items = getData('tools', []);
        saveData('tools', items.filter((i: any) => i.id != id));
        return Promise.resolve(id);
    },

    // ===== PRICING =====
    getPricing: async () => {
        if (USE_REAL_API) {
            const data = await apiRequest('/pricing');
            return data.length > 0 ? data : defaultPricingPackages;
        }
        const storedData = getData('pricing', []);
        return storedData.length > 0 ? Promise.resolve(storedData) : Promise.resolve(defaultPricingPackages);
    },

    updatePricing: async (id: number | string, data: any) => {
        if (USE_REAL_API) {
            return apiRequest(`/pricing/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
        const items = getData('pricing', defaultPricingPackages).map((i: any) => i.id == id ? { ...i, ...data } : i);
        saveData('pricing', items);
        return Promise.resolve({ ...data, id });
    },

    // ===== SETTINGS =====
    getSettings: async () => {
        if (USE_REAL_API) {
            return apiRequest('/settings');
        }
        return Promise.resolve(getData('settings', {}));
    },

    saveSettings: async (data: any) => {
        if (USE_REAL_API) {
            return apiRequest('/settings', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
        saveData('settings', data);
        return Promise.resolve(data);
    },

    // ===== PROJECTS =====
    getProjects: async () => {
        if (USE_REAL_API) {
            return apiRequest('/projects');
        }
        return Promise.resolve(getData('projects', []));
    },

    getProjectDetail: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/projects/${id}`);
        }
        const items = getData('projects', []);
        const item = items.find((i: any) => i.id == id);
        return item ? Promise.resolve(item) : Promise.resolve(null);
    },

    addProject: async (item: any) => {
        if (USE_REAL_API) {
            return apiRequest('/projects', {
                method: 'POST',
                body: JSON.stringify(item)
            });
        }
        const items = getData('projects', []);
        const newItem = { ...item, id: Date.now(), created_at: new Date().toISOString() };
        saveData('projects', [newItem, ...items]);
        return Promise.resolve(newItem);
    },

    updateProject: async (id: number | string, data: any) => {
        if (USE_REAL_API) {
            return apiRequest(`/projects/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
        const items = getData('projects', []).map((i: any) => i.id == id ? { ...i, ...data } : i);
        saveData('projects', items);
        return Promise.resolve({ ...data, id });
    },

    deleteProject: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/projects/${id}`, { method: 'DELETE' });
        }
        const items = getData('projects', []);
        saveData('projects', items.filter((i: any) => i.id != id));
        return Promise.resolve(id);
    },

    // ===== CONTACTS =====
    getContacts: async () => {
        if (USE_REAL_API) {
            return apiRequest('/contacts');
        }
        return Promise.resolve(getData('contacts', []));
    },

    submitContact: async (data: any) => {
        if (USE_REAL_API) {
            return apiRequest('/contacts', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
        const items = getData('contacts', []);
        const newItem = { ...data, id: Date.now(), created_at: new Date().toISOString() };
        saveData('contacts', [newItem, ...items]);
        return Promise.resolve(newItem);
    },

    deleteContact: async (id: number | string) => {
        if (USE_REAL_API) {
            return apiRequest(`/contacts/${id}`, { method: 'DELETE' });
        }
        const items = getData('contacts', []);
        saveData('contacts', items.filter((i: any) => i.id != id));
        return Promise.resolve(id);
    },

    // ===== NEWSLETTER =====
    subscribeNewsletter: async (email: string) => {
        if (USE_REAL_API) {
            return apiRequest('/newsletter', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        }
        console.log(`Newsletter subscription: ${email}`);
        return Promise.resolve({ success: true, message: 'Đăng ký thành công!' });
    },

    // ===== AI FEATURES =====
    generatePost: async (topic: string) => {
        if (USE_REAL_API) {
            return apiRequest('/ai/generate', {
                method: 'POST',
                body: JSON.stringify({ prompt: topic, type: 'post' })
            });
        }
        return Promise.resolve({
            title: `Bài viết AI về ${topic}`,
            excerpt: `Đây là tóm tắt tự động cho chủ đề ${topic}...`,
            content: `<p>Nội dung chi tiết về <strong>${topic}</strong> do AI Magic Writer tạo ra.</p>`
        });
    },

    generateSEO: async (content: string) => {
        if (USE_REAL_API) {
            return apiRequest('/ai/generate', {
                method: 'POST',
                body: JSON.stringify({ prompt: content, type: 'seo' })
            });
        }
        return Promise.resolve({
            metaTitle: 'Meta Title AI Generated',
            metaDescription: 'Meta Description AI Generated based on content...',
            keywords: ['bim', 'xay dung', 'news']
        });
    },

    generateSocialPosts: async (content: string) => {
        if (USE_REAL_API) {
            return apiRequest('/ai/generate', {
                method: 'POST',
                body: JSON.stringify({ prompt: content, type: 'social' })
            });
        }
        return Promise.resolve({
            facebook: '🔥 Tin mới về BIM...',
            linkedin: '📢 [BIM Update] ...',
            email: 'Kính gửi Quý khách hàng...'
        });
    },

    // ===== ANALYTICS =====
    getAnalytics: async () => {
        if (USE_REAL_API) {
            return apiRequest('/analytics/stats');
        }
        return Promise.resolve({
            views: Math.floor(Math.random() * 1000) + 500,
            contacts: Math.floor(Math.random() * 20) + 5
        });
    },

    getAnalyticsStats: async () => {
        if (USE_REAL_API) {
            return apiRequest('/analytics/stats');
        }
        return Promise.resolve({
            views: Math.floor(Math.random() * 5000) + 1000,
            contacts: Math.floor(Math.random() * 50) + 10,
            news: Math.floor(Math.random() * 20) + 5,
            library: Math.floor(Math.random() * 30) + 10
        });
    },

    getAnalyticsInsight: async () => {
        if (USE_REAL_API) {
            return apiRequest('/analytics/insight');
        }
        return Promise.resolve({
            insight: 'Tuần này website có lượt truy cập tốt với các bài viết về pháp lý BIM được quan tâm nhiều nhất.'
        });
    },

    generateInsight: async () => {
        if (USE_REAL_API) {
            const result = await apiRequest('/analytics/insight');
            return result.insight;
        }
        return Promise.resolve('Tuần này website có lượt truy cập tốt với các bài viết về pháp lý BIM được quan tâm nhiều nhất.');
    }
};
