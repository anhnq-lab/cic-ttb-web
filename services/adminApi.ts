// Admin API Client - Simple WordPress-style API client
// All endpoints return { success: true/false, data: {...}, error: "..." }

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get auth token from localStorage
// Note: api.ts uses 'authToken' as the key
const getToken = (): string | null => {
    try {
        return localStorage.getItem('authToken') || localStorage.getItem('token');
    } catch {
        return null;
    }
};

// Make API request
const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> => {
    const token = getToken();
    const url = `${API_BASE_URL}/admin${endpoint}`;

    if (!token) {
        console.error('[Admin API] No token found. Available keys:', Object.keys(localStorage));
        return { success: false, error: 'No token provided. Please login again.' };
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        // Handle empty response
        const text = await response.text();
        if (!text) {
            return { success: false, error: 'Empty response from server' };
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            return { success: false, error: `Invalid JSON response: ${text.substring(0, 100)}` };
        }

        if (!response.ok) {
            return { success: false, error: json.error || `HTTP ${response.status}` };
        }

        return json;
    } catch (error: any) {
        return { success: false, error: error.message || 'Network error' };
    }
};

// ===== PROJECTS =====
export const projectsApi = {
    getAll: () => apiRequest<any[]>('/projects'),
    getOne: (id: string | number) => apiRequest<any>(`/projects/${id}`),
    create: (data: any) => apiRequest<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) =>
        apiRequest<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => apiRequest(`/projects/${id}`, { method: 'DELETE' }),
};

// ===== NEWS =====
export const newsApi = {
    getAll: () => apiRequest<any[]>('/news'),
    create: (data: any) => apiRequest<any>('/news', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) =>
        apiRequest<any>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => apiRequest(`/news/${id}`, { method: 'DELETE' }),
};

// ===== TRAINING / COURSES =====
export const coursesApi = {
    getAll: () => apiRequest<any[]>('/courses'),
    create: (data: any) => apiRequest<any>('/courses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) =>
        apiRequest<any>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => apiRequest(`/courses/${id}`, { method: 'DELETE' }),
};

// ===== LIBRARY =====
export const libraryApi = {
    getAll: () => apiRequest<any[]>('/library'),
    create: (data: any) => apiRequest<any>('/library', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) =>
        apiRequest<any>(`/library/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => apiRequest(`/library/${id}`, { method: 'DELETE' }),
};

// ===== CONTACTS =====
export const contactsApi = {
    getAll: () => apiRequest<any[]>('/contacts'),
    delete: (id: string | number) => apiRequest(`/contacts/${id}`, { method: 'DELETE' }),
};

// ===== TOOLS =====
export const toolsApi = {
    getAll: () => apiRequest<any[]>('/tools'),
    create: (data: any) => apiRequest<any>('/tools', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) =>
        apiRequest<any>(`/tools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => apiRequest(`/tools/${id}`, { method: 'DELETE' }),
};

// ===== PRICING =====
export const pricingApi = {
    getAll: () => apiRequest<any[]>('/pricing'),
    update: (id: string | number, data: any) =>
        apiRequest<any>(`/pricing/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ===== SETTINGS =====
export const settingsApi = {
    get: () => apiRequest<any>('/settings'),
    update: (data: any) => apiRequest<any>('/settings', { method: 'POST', body: JSON.stringify(data) }),
};

// Export all APIs
export const adminApi = {
    projects: projectsApi,
    news: newsApi,
    courses: coursesApi,
    library: libraryApi,
    contacts: contactsApi,
    tools: toolsApi,
    pricing: pricingApi,
    settings: settingsApi,
};

export default adminApi;
