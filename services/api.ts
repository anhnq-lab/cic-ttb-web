// API Service for BIM Hub Website - Production Ready
// Uses Supabase directly in production, Express API in local dev

import { supabase } from '../lib/supabaseClient';

// Determine environment
const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const isProduction = !isDev; // If not localhost, use Supabase directly

// API Base URL - use environment variable or default
// In production, if API is on same domain, use relative path
// Otherwise, set VITE_API_URL in Vercel environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (isDev ? 'http://localhost:3000/api' : '/api');

// In production (Vercel), use Supabase directly. In dev (localhost), use Express backend
const USE_SUPABASE = isProduction;
// Use real API if we have API_BASE_URL set OR if we're in dev mode
// For admin operations (create/update/delete), always use API if available
const USE_REAL_API = isDev || !!import.meta.env.VITE_API_URL; // Use Express API in dev or if API_URL is set

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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3bd652de-c938-4bbc-84f0-87f5dcaa2de6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'services/api.ts:130',message:'apiRequest called',data:{endpoint,apiBaseUrl:API_BASE_URL,method:options.method||'GET',hasToken:!!localStorage.getItem('authToken')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const fullUrl = `${API_BASE_URL}${endpoint}`;
    // #region agent log
    const logDataB = {location:'services/api.ts:142',message:'Before fetch',data:{fullUrl,headers:Object.keys(headers)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.log('[DEBUG] Hypothesis B:', logDataB);
    fetch('http://127.0.0.1:7242/ingest/3bd652de-c938-4bbc-84f0-87f5dcaa2de6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataB)}).catch(()=>{});
    // #endregion

    const response = await fetch(fullUrl, {
        ...options,
        headers, // FIX: Include headers in request
    });

    // #region agent log
    const logDataC = {location:'services/api.ts:150',message:'Response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
    console.log('[DEBUG] Hypothesis C:', logDataC);
    fetch('http://127.0.0.1:7242/ingest/3bd652de-c938-4bbc-84f0-87f5dcaa2de6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataC)}).catch(()=>{});
    // #endregion

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
            // Failed to parse JSON, try text
            const text = await response.text().catch(() => '');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/3bd652de-c938-4bbc-84f0-87f5dcaa2de6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'services/api.ts:161',message:'Error response text',data:{text:text.substring(0,200),error:e},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            if (text) errorMessage += ` | Response: ${text.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
    }

    // #region agent log
    const responseText = await response.clone().text().catch(() => '');
    const logDataE = {location:'services/api.ts:170',message:'Success response body',data:{textLength:responseText.length,textPreview:responseText.substring(0,200),isEmpty:responseText.trim()==='',isJson:responseText.trim().startsWith('{')||responseText.trim().startsWith('[')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
    console.log('[DEBUG] Hypothesis E:', logDataE);
    fetch('http://127.0.0.1:7242/ingest/3bd652de-c938-4bbc-84f0-87f5dcaa2de6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataE)}).catch(()=>{});
    // #endregion

    try {
        const jsonData = await response.json();
        // #region agent log
        const logDataF = {location:'services/api.ts:175',message:'JSON parsed successfully',data:{hasData:!!jsonData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
        console.log('[DEBUG] Hypothesis F:', logDataF);
        fetch('http://127.0.0.1:7242/ingest/3bd652de-c938-4bbc-84f0-87f5dcaa2de6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataF)}).catch(()=>{});
        // #endregion
        return jsonData;
    } catch (e) {
        // #region agent log
        const logDataG = {location:'services/api.ts:179',message:'JSON parse failed',data:{error:String(e),responseText:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
        console.error('[DEBUG] Hypothesis G - JSON PARSE FAILED:', logDataG);
        fetch('http://127.0.0.1:7242/ingest/3bd652de-c938-4bbc-84f0-87f5dcaa2de6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataG)}).catch(()=>{});
        // #endregion
        throw new Error(`Invalid JSON response: ${e}. Response: ${responseText.substring(0, 100)}`);
    }
}

// Unified API that works in both dev (localStorage) and production (real backend)
export const api = {
    // ===== AUTH =====
    login: async (credentials: any) => {
        // Always try to use backend API if available (for production with Vercel)
        if (USE_REAL_API || API_BASE_URL) {
            try {
                const data = await apiRequest('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(credentials)
                });
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                return data.user;
            } catch (error: any) {
                // If API call fails and we're in production, fall back to Supabase
                if (USE_SUPABASE && !USE_REAL_API) {
                    // Try Supabase auth
                    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
                        email: credentials.username.includes('@') ? credentials.username : credentials.username + '@example.com',
                        password: credentials.password
                    });
                    if (supabaseError) {
                        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
                    }
                    const user = {
                        id: data.user?.id,
                        username: data.user?.email,
                        role: 'user',
                        full_name: data.user?.user_metadata?.full_name || data.user?.email
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    return user;
                }
                throw error;
            }
        }
        
        // Fallback for development without API
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            const user = { id: 1, username: 'admin', role: 'admin' };
            localStorage.setItem('authToken', 'dev-token');
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        throw new Error('Mật khẩu không đúng');
    },

    register: async (userData: any) => {
        if (USE_REAL_API) {
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            return data;
        }
        throw new Error('Đăng ký chỉ hoạt động ở môi trường Production');
    },

    verifyGoogleLogin: async (token: string, user: any) => {
        if (USE_REAL_API) {
            const data = await apiRequest('/auth/google', {
                method: 'POST',
                body: JSON.stringify({ token, user })
            });
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data.user;
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.reload();
    },

    getMe: async () => {
        // Always try to use backend API if available
        if (USE_REAL_API || API_BASE_URL) {
            try {
                return await apiRequest('/auth/me');
            } catch (e) {
                // Fallback to localStorage if API fails
                const userStr = localStorage.getItem('user');
                return userStr ? JSON.parse(userStr) : null;
            }
        }
        // Fallback to localStorage
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
        if (USE_SUPABASE) {
            try {
                const { data, error } = await supabase
                    .from('library')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('[Supabase] Failed to fetch library:', error);
                return [];
            }
        }
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
        if (USE_SUPABASE) {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('[Supabase] Failed to fetch news:', error);
                return [];
            }
        }
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

    getProjects: async () => {
        // In production (Vercel), fetch directly from Supabase
        if (USE_SUPABASE) {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                // Map database fields to frontend expected fields with robust null handling
                return (data || []).map((p: any) => {
                    // Parse images - handle JSON string, array, or single URL
                    let images: string[] = [];
                    try {
                        if (typeof p.images === 'string') {
                            const parsed = JSON.parse(p.images);
                            images = Array.isArray(parsed) ? parsed : [parsed];
                        } else if (Array.isArray(p.images)) {
                            images = p.images;
                        } else if (p.imageUrl) {
                            images = [p.imageUrl];
                        }
                    } catch {
                        images = p.images ? [p.images] : (p.imageUrl ? [p.imageUrl] : []);
                    }

                    return {
                        ...p,
                        title: p.title || p.name || 'Untitled Project',
                        client: p.client || p.investor || '',
                        completion_date: p.completion_date || p.endDate || null,
                        service_type: p.service_type || p.type || 'Scan-to-BIM',
                        status: p.status || 'active',
                        images
                    };
                });
            } catch (error) {
                console.error('[Supabase] Failed to fetch projects:', error);
                return [];
            }
        }
        // In dev (localhost), use Express backend
        if (USE_REAL_API) {
            try {
                return await apiRequest('/projects');
            } catch (error) {
                console.error('[API] Failed to fetch projects:', error);
                return [];
            }
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
        // Always use API if available (for admin operations)
        if (USE_REAL_API || API_BASE_URL) {
            try {
                const response = await apiRequest('/admin/projects', {
                    method: 'POST',
                    body: JSON.stringify(item)
                });
                // Handle WordPress-style response { success: true, data: {...} }
                if (response.success && response.data) {
                    return response.data;
                }
                if (!response.success) {
                    throw new Error(response.error || 'Create failed');
                }
                return response;
            } catch (err: any) {
                // Fallback to old endpoint if new one fails
                console.warn('[API] Admin endpoint failed, trying old endpoint:', err);
                return apiRequest('/projects', {
                    method: 'POST',
                    body: JSON.stringify(item)
                });
            }
        }
        // Fallback to localStorage only in dev without API
        const items = getData('projects', []);
        const newItem = { ...item, id: Date.now(), created_at: new Date().toISOString() };
        saveData('projects', [newItem, ...items]);
        return Promise.resolve(newItem);
    },

    updateProject: async (id: number | string, data: any) => {
        // Always use API if available (for admin operations)
        if (USE_REAL_API || API_BASE_URL) {
            try {
                const response = await apiRequest(`/admin/projects/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                // Handle WordPress-style response { success: true, data: {...} }
                if (response.success && response.data) {
                    return response.data;
                }
                if (!response.success) {
                    throw new Error(response.error || 'Update failed');
                }
                return response;
            } catch (err: any) {
                // Fallback to old endpoint if new one fails
                console.warn('[API] Admin endpoint failed, trying old endpoint:', err);
                return apiRequest(`/projects/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
            }
        }
        // Fallback to localStorage only in dev without API
        const items = getData('projects', []).map((i: any) => i.id == id ? { ...i, ...data } : i);
        saveData('projects', items);
        return Promise.resolve({ ...data, id });
    },

    deleteProject: async (id: number | string) => {
        // Always use API if available (for admin operations)
        if (USE_REAL_API || API_BASE_URL) {
            return apiRequest(`/projects/${id}`, { method: 'DELETE' });
        }
        // Fallback to localStorage only in dev without API
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
