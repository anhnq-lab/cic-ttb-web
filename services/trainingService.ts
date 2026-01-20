
import { API_BASE_URL } from './api';

const USE_REAL_API = true;

// Helper to get data from localStorage (mock)
const getLocalData = (key: string, defaultValue: any) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const saveLocalData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export interface TrainingCourse {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    curriculum: any[];
    image_url: string;
    price: number;
    duration: string;
    level: string;
    is_active: boolean;
}

export interface Lead {
    id?: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    position?: string;
    course_id?: string;
    message?: string;
    status: 'new' | 'contacted' | 'converted' | 'closed';
    created_at?: string;
}

// Reuse the apiRequest from api.ts if possible, but here we'll rewrite a simple one or import it if exported.
// Since api.ts exports `api`, let's try to stick to the same pattern or just use fetch directly.

const request = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
};

export const trainingService = {
    // === COURSES ===
    getCourses: async (): Promise<TrainingCourse[]> => {
        if (USE_REAL_API) {
            try {
                // If backend endpoint isn't ready, this will fail.
                // Depending on supabase client, we might be calling supabase directly or via express proxy.
                // Assuming express backend proxies or direct supabase call.
                // For now let's try calling our backend route /api/training/courses
                // If it fails, fallback to mock data for demo.
                return await request('/training/courses');
            } catch (e) {
                console.warn('Backend API failed, using mock/local data', e);
            }
        }
        return getLocalData('training_courses', MOCK_COURSES);
    },

    getCourseBySlug: async (slug: string): Promise<TrainingCourse | null> => {
        if (USE_REAL_API) {
            try {
                return await request(`/training/courses/${slug}`);
            } catch (e) {
                console.warn('Backend API failed, using mock/local data', e);
            }
        }
        const courses = getLocalData('training_courses', MOCK_COURSES);
        return courses.find((c: TrainingCourse) => c.slug === slug) || null;
    },

    // === LEADS ===
    submitLead: async (lead: Partial<Lead>) => {
        if (USE_REAL_API) {
            try {
                return await request('/training/leads', {
                    method: 'POST',
                    body: JSON.stringify(lead)
                });
            } catch (e) {
                console.warn('Backend API failed, using mock/local data', e);
            }
        }
        const leads = getLocalData('leads', []);
        const newLead = { ...lead, id: `local-${Date.now()}`, status: 'new', created_at: new Date().toISOString() };
        saveLocalData('leads', [...leads, newLead]);
        return newLead;
    }
};

// Mock Data matching the Migration
const MOCK_COURSES: TrainingCourse[] = [
    {
        id: '1',
        title: 'Tổng quan về BIM (BIM Overview)',
        slug: 'bim-overview',
        description: 'Khóa học cung cấp kiến thức nền tảng về BIM, khái niệm, lợi ích và lộ trình áp dụng BIM cho doanh nghiệp theo xu hướng chuyển đổi số ngành xây dựng.',
        content: '<h3>Giới thiệu khóa học</h3><p>BIM (Building Information Modeling) đang trở thành xu hướng tất yếu...</p>',
        curriculum: [
            { title: 'Module 1: Tổng quan', lessons: ['Khái niệm BIM', 'Lịch sử phát triển'] },
            { title: 'Module 2: Lợi ích', lessons: ['Lợi ích cho CĐT', 'Lợi ích cho Nhà thầu'] }
        ],
        image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        price: 2000000,
        duration: '1 ngày',
        level: 'Cơ bản',
        is_active: true
    },
    {
        id: '2',
        title: 'Thiết lập môi trường dữ liệu chung (CDE)',
        slug: 'cde-setup',
        description: 'Hướng dẫn kỹ thuật thiết lập, quản lý và vận hành Môi trường dữ liệu chung (CDE) để trao đổi thông tin hiệu quả trong dự án.',
        content: '<p>Chi tiết về CDE...</p>',
        curriculum: [],
        image_url: 'https://images.unsplash.com/photo-1558494949-efc02220ec8c?auto=format&fit=crop&w=800&q=80',
        price: 3500000,
        duration: '2 ngày',
        level: 'Nâng cao',
        is_active: true
    },
    {
        id: '3',
        title: 'Quản lý và Phối hợp BIM (BIM Coordination)',
        slug: 'bim-coordination',
        description: 'Đào tạo kỹ năng sử dụng phần mềm (Navisworks, Solibri) để kiểm tra xung đột (Clash Detection) và phối hợp đa bộ môn.',
        content: '<p>Chi tiết về Coordination...</p>',
        curriculum: [],
        image_url: 'https://images.unsplash.com/photo-1581094794329-cd11965d1169?auto=format&fit=crop&w=800&q=80',
        price: 4000000,
        duration: '3 ngày',
        level: 'Trung cấp',
        is_active: true
    },
    {
        id: '4',
        title: 'Chuyên gia BIM theo tiêu chuẩn ISO 19650',
        slug: 'iso-19650-master',
        description: 'Chương trình đào tạo chuyên sâu về quản lý thông tin dự án theo tiêu chuẩn quốc tế ISO 19650-1 & 2.',
        content: '<p>Chi tiết về ISO 19650...</p>',
        curriculum: [],
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        price: 5000000,
        duration: '4 ngày',
        level: 'Chuyên gia',
        is_active: true
    }
];
