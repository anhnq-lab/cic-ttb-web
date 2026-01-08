import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import ImageUploader from './ImageUploader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'news' | 'settings' | 'analytics' | 'library' | 'tools' | 'pricing' | 'projects'>('contacts');
    const [contacts, setContacts] = useState<any[]>([]);
    const [newsList, setNewsList] = useState<any[]>([]);
    const [library, setLibrary] = useState<any[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Library State
    const [libraryForm, setLibraryForm] = useState({
        title: '', description: '', type: 'technical', image_url: '', tag: '', link: ''
    });
    const [editingLibId, setEditingLibId] = useState<number | null>(null);

    // News Form State
    const [isEditingNews, setIsEditingNews] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
    const [newsForm, setNewsForm] = useState({
        category: 'Tin tức',
        title: '',
        date: new Date().toLocaleDateString('vi-VN'),
        imageUrl: '',
        excerpt: '',
        content: '',
        author: '',
        videoUrl: '', // YouTube or MP4
        audioUrl: '', // MP3 or Podcast link
        attachments: [] as { name: string, url: string, size: string, type: string }[],
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });

    // Social Media Kit State
    const [socialKit, setSocialKit] = useState<any>(null);
    const [showSocialModal, setShowSocialModal] = useState(false);

    // Settings Form State
    const [settings, setSettings] = useState({
        companyName: '',
        address: '',
        phone: '',
        email: '',
        facebook: '',
        linkedin: '',
        footerDescription: '',
        footerCategories: '[]',
        footerAudiences: '[]'
    });

    // AI & Analytics State
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [insight, setInsight] = useState<string>('');
    const [loadingInsight, setLoadingInsight] = useState(false);

    // Tools State
    const [tools, setTools] = useState<any[]>([]);
    const [toolForm, setToolForm] = useState({ title: '', description: '', icon: '', link: '' });
    const [editingToolId, setEditingToolId] = useState<number | null>(null);

    // Pricing State
    const [pricing, setPricing] = useState<any[]>([]);
    const [editingPricingId, setEditingPricingId] = useState<number | null>(null);
    const [pricingForm, setPricingForm] = useState({ name: '', price: '', period: '', description: '', features: '', ctaText: '' });

    // Projects State
    const [projects, setProjects] = useState<any[]>([]);
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [projectForm, setProjectForm] = useState({
        title: '', client: '', location: '', service_type: 'Scan-to-BIM',
        description: '', challenge: '', solution: '', result: '',
        images: [] as string[], completion_date: ''
    });

    useEffect(() => {
        const checkAuth = async () => {
            const user = await api.getMe();
            if (user) {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'contacts') loadContacts();
            if (activeTab === 'news') loadNews();
            if (activeTab === 'settings') loadSettings();
            if (activeTab === 'analytics') loadAnalytics();
            if (activeTab === 'library') loadLibrary();
            if (activeTab === 'tools') loadTools();
            if (activeTab === 'pricing') loadPricing();
            if (activeTab === 'projects') loadProjects();
        }
    }, [isAuthenticated, activeTab]);

    // ... load functions ...
    const loadTools = async () => {
        try {
            const data = await api.getTools();
            setTools(data);
        } catch (error) { console.error('Failed load tools', error); }
    };

    const loadPricing = async () => {
        try {
            const data = await api.getPricing();
            setPricing(data);
        } catch (error) { console.error('Failed load pricing', error); }
    };

    const loadProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (error) { console.error('Failed load projects', error); }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProjectId) {
                await api.updateProject(editingProjectId, projectForm);
                alert('Cập nhật dự án thành công!');
            } else {
                await api.addProject(projectForm);
                alert('Thêm dự án thành công!');
            }
            setProjectForm({
                title: '', client: '', location: '', service_type: 'Scan-to-BIM',
                description: '', challenge: '', solution: '', result: '',
                images: [], completion_date: ''
            });
            setEditingProjectId(null);
            loadProjects();
        } catch (error) { alert('Lỗi xử lý dự án'); }
    };

    const handleDeleteProject = async (id: number) => {
        if (confirm('Xóa dự án này?')) {
            await api.deleteProject(id);
            loadProjects();
        }
    };

    const handleEditProject = (item: any) => {
        setProjectForm({
            title: item.title, client: item.client, location: item.location,
            service_type: item.service_type, description: item.description,
            challenge: item.challenge, solution: item.solution, result: item.result,
            images: item.images || [], completion_date: item.completion_date
        });
        setEditingProjectId(item.id);
        setActiveTab('projects');
    };

    const loadLibrary = async () => {
        try {
            const data = await api.getLibrary();
            setLibrary(data);
        } catch (error) {
            console.error('Failed to load library', error);
        }
    };

    const loadContacts = async () => {
        try {
            const data = await api.getContacts();
            setContacts(data);
        } catch (error) {
            console.error('Failed to load contacts', error);
        }
    };

    const loadNews = async () => {
        try {
            const data = await api.getNews();
            setNewsList(data);
        } catch (error) {
            console.error('Failed to load news', error);
        }
    };

    const loadSettings = async () => {
        try {
            const data = await api.getSettings();
            if (data && Object.keys(data).length > 0) {
                setSettings(data as any);
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    }

    const loadAnalytics = async () => {
        try {
            const s = await api.getAnalyticsStats();
            setStats(s);
            // Don't auto-load insight to save tokens, let user click
        } catch (error) {
            console.error('Failed to load stats', error);
        }
    };

    const handleGenerateNews = async () => {
        if (!aiTopic) return alert('Vui lòng nhập chủ đề bài viết');
        setIsGenerating(true);
        try {
            const result = await api.generatePost(aiTopic);
            setNewsForm({
                ...newsForm,
                title: result.title || '',
                excerpt: result.excerpt || '',
                content: result.content || '',
                // If AI returns category, use it, else keep default
            });
            alert('Đã tạo nội dung tữ động!');
        } catch (error) {
            alert('Lỗi khi tạo nội dung: ' + error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGetInsight = async () => {
        setLoadingInsight(true);
        try {
            const res = await api.getAnalyticsInsight();
            setInsight(res.insight);
        } catch (error) {
            alert('Lỗi lấy phân tích AI');
        } finally {
            setLoadingInsight(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.login({ username: 'admin', password: password }); // Admin dashboard usually implies admin user
            setIsAuthenticated(true);
        } catch (error) {
            alert('Đăng nhập thất bại: ' + error);
        }
    };

    const handleNewsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditingNews && editingNewsId) {
                await api.updateNews(editingNewsId, newsForm);
                alert('Cập nhật tin tức thành công!');
                setIsEditingNews(false);
                setEditingNewsId(null);
            } else {
                await api.addNews(newsForm);
                alert('Đã thêm tin tức thành công!');
            }
            setNewsForm({
                category: 'Tin tức',
                title: '',
                date: new Date().toLocaleDateString('vi-VN'),
                imageUrl: '',
                excerpt: '',
                content: '',
                author: '',
                videoUrl: '',
                audioUrl: '',
                attachments: [],
                metaTitle: '',
                metaDescription: '',
                keywords: ''
            });
            loadNews();
        } catch (error) {
            alert('Lỗi khi lưu tin tức');
        }
    };

    const handleEditNews = (news: any) => {
        setNewsForm({
            category: news.category,
            title: news.title,
            date: news.date,
            imageUrl: news.imageUrl,
            excerpt: news.excerpt,
            content: news.content,
            author: news.author || '',
            videoUrl: news.videoUrl || '',
            audioUrl: news.audioUrl || '',
            attachments: news.attachments ? (typeof news.attachments === 'string' ? JSON.parse(news.attachments) : news.attachments) : [],
            metaTitle: news.metaTitle || '',
            metaDescription: news.metaDescription || '',
            keywords: news.keywords || ''
        });
        setIsEditingNews(true);
        setEditingNewsId(news.id);
        setActiveTab('news');
    };

    const handleCancelEdit = () => {
        setIsEditingNews(false);
        setEditingNewsId(null);
        setNewsForm({
            category: 'Tin tức',
            title: '',
            date: new Date().toLocaleDateString('vi-VN'),
            imageUrl: '',
            excerpt: '',
            content: '',
            author: '',
            videoUrl: '',
            audioUrl: '',
            attachments: [],
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        });
    };

    const handleGenerateSEO = async () => {
        if (!newsForm.content) return alert('Hãy nhập nội dung bài viết trước!');
        setIsGenerating(true);
        try {
            const res = await api.generateSEO(newsForm.content);
            setNewsForm({
                ...newsForm,
                metaTitle: res.metaTitle || '',
                metaDescription: res.metaDescription || '',
                keywords: Array.isArray(res.keywords) ? res.keywords.join(', ') : res.keywords
            });
            alert('Đã tạo thẻ SEO!');
        } catch (error) {
            alert('Lỗi tạo SEO: ' + error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateMarketingKit = async (news: any) => {
        // Use full content if available, or just title/excerpt
        const contentToGen = news.content || (news.title + "\n" + news.excerpt);
        setIsGenerating(true);
        try {
            const res = await api.generateSocialPosts(contentToGen);
            setSocialKit(res);
            setShowSocialModal(true);
        } catch (error) {
            alert('Lỗi tạo nội dung MXH: ' + error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteContact = async (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa liên hệ này?')) {
            try {
                await api.deleteContact(id);
                loadContacts();
            } catch (error) {
                alert('Xóa thất bại');
            }
        }
    };

    const handleDeleteNews = async (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa tin tức này?')) {
            try {
                await api.deleteNews(id);
                loadNews();
            } catch (error) {
                alert('Xóa thất bại');
            }
        }
    };

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.saveSettings(settings);
            alert('Đã lưu cấu hình thành công!');
        } catch (error) {
            alert('Lỗi khi lưu cấu hình');
        }
    };

    const handleLibrarySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLibId) {
                await api.updateLibrary(editingLibId, libraryForm);
                alert('Cập nhật tài liệu thành công!');
            } else {
                await api.addLibrary(libraryForm);
                alert('Thêm tài liệu thành công!');
            }
            setLibraryForm({ title: '', description: '', type: 'technical', image_url: '', tag: '', link: '' });
            setEditingLibId(null);
            loadLibrary();
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra.');
        }
    };

    const handleEditLibrary = (item: any) => {
        setLibraryForm({
            title: item.title,
            description: item.description,
            type: item.type,
            image_url: item.image_url,
            tag: item.tag,
            link: item.link || ''
        });
        setEditingLibId(item.id);
        setActiveTab('library');
    };

    const handleDeleteLibrary = async (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa tài liệu này?')) {
            try {
                await api.deleteLibrary(id);
                loadLibrary();
            } catch (error) {
                console.error(error);
                alert('Lỗi khi xóa.');
            }
        }
    };

    // Tools Handlers
    const handleToolSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingToolId) {
                await api.updateTool(editingToolId, toolForm);
                alert('Cập nhật công cụ thành công!');
            } else {
                await api.addTool(toolForm);
                alert('Thêm công cụ thành công!');
            }
            setToolForm({ title: '', description: '', icon: '', link: '' });
            setEditingToolId(null);
            loadTools();
        } catch (error) { alert('Lỗi lưu công cụ'); }
    };

    const handleDeleteTool = async (id: number) => {
        if (window.confirm('Chắc chắn xóa tool này?')) {
            await api.deleteTool(id);
            loadTools();
        }
    };

    // Pricing Handlers
    const handlePricingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPricingId) {
                // Parse features from string if needed, or backend handles it. Assuming API expects array but form matches state? 
                // Currently mock API takes any. Let's send as is, but in real app parse split('\n')
                const dataToSend = { ...pricingForm, features: typeof pricingForm.features === 'string' ? pricingForm.features.split('\n') : pricingForm.features };
                await api.updatePricing(editingPricingId, dataToSend);
                alert('Cập nhật gói giá thành công!');
            }
            setEditingPricingId(null);
            loadPricing();
        } catch (error) { alert('Lỗi lưu giá'); }
    };

    const handleEditPricing = (item: any) => {
        setPricingForm({
            name: item.name,
            price: item.price,
            period: item.period,
            description: item.description,
            features: Array.isArray(item.features) ? item.features.join('\n') : item.features,
            ctaText: item.ctaText
        });
        setEditingPricingId(item.id);
        setActiveTab('pricing');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-brand-blue">Admin Login</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                        placeholder="Mật khẩu quản trị"
                    />
                    <button type="submit" className="w-full bg-brand-blue text-white p-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">Đăng nhập</button>
                    <div className="mt-4 text-center">
                        <a href="/" className="text-sm text-gray-500 hover:underline">← Về trang chủ</a>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-grow container mx-auto p-4 mt-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Hệ thống Quản trị</h1>
                    <button onClick={() => { api.logout(); setIsAuthenticated(false); }} className="text-red-600 hover:text-red-800 text-sm font-medium">Đăng xuất</button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'contacts' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Quản lý Liên hệ
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'news' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Quản lý Tin tức
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'library' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Quản lý Thư viện
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'settings' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Cấu hình
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'analytics' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Analytics & AI
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'tools' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Tools
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'pricing' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Pricing
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'projects' ? 'bg-white text-brand-blue border-t border-l border-r border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Quản lý Dự án
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white p-6 rounded-b-lg shadow-sm border border-gray-200 min-h-[500px]">

                    {/* Contacts Tab */}
                    {activeTab === 'contacts' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Danh sách Liên hệ ({contacts.length})</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="p-4 font-semibold text-gray-600">Ngày gửi</th>
                                            <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
                                            <th className="p-4 font-semibold text-gray-600">Liên lạc</th>
                                            <th className="p-4 font-semibold text-gray-600">Dịch vụ quan tâm</th>
                                            <th className="p-4 font-semibold text-gray-600">Ghi chú</th>
                                            <th className="p-4 font-semibold text-gray-600 text-center">Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.length === 0 ? (
                                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Chưa có liên hệ nào.</td></tr>
                                        ) : contacts.map((c) => (
                                            <tr key={c.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4 text-sm">{new Date(c.created_at).toLocaleString()}</td>
                                                <td className="p-4">
                                                    <div className="font-medium">{c.name}</div>
                                                    <div className="text-xs text-gray-500">{c.company}</div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <div>{c.email}</div>
                                                    <div className="text-gray-500">{c.phone}</div>
                                                </td>
                                                <td className="p-4 text-sm text-blue-600 font-medium">{c.service}</td>
                                                <td className="p-4 text-sm italic text-gray-600 max-w-xs truncate" title={c.note}>{c.note}</td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleDeleteContact(c.id)}
                                                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition-colors"
                                                        title="Xóa liên hệ"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* News Tab */}
                    {activeTab === 'news' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* News Form */}
                            <div className="lg:col-span-1 border-r pr-8">
                                <h2 className="text-xl font-bold mb-6 text-gray-800">{isEditingNews ? 'Chỉnh sửa Tin tức' : 'Đăng Tin mới'}</h2>

                                {/* AI Tool */}
                                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                                    <h3 className="font-bold text-brand-blue text-sm mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                        AI Magic Writer
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            value={aiTopic}
                                            onChange={(e) => setAiTopic(e.target.value)}
                                            placeholder="Nhập chủ đề (VD: Lợi ích của BIM...)"
                                            className="flex-grow border p-2 rounded text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenerateNews}
                                            disabled={isGenerating}
                                            className="bg-brand-blue text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {isGenerating ? 'Đang viết...' : 'Tạo bài'}
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleNewsSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết</label>
                                        <input
                                            required
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                            placeholder="Nhập tiêu đề..."
                                            value={newsForm.title}
                                            onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                            <select
                                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                                value={newsForm.category}
                                                onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}
                                            >
                                                <option>Tin tức</option>
                                                <option>Nghị định</option>
                                                <option>Thông tư</option>
                                                <option>Sự kiện</option>
                                                <option>Xu hướng</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh thumbnail</label>
                                            <ImageUploader
                                                value={newsForm.imageUrl}
                                                onChange={(url) => setNewsForm({ ...newsForm, imageUrl: url })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt ngắn</label>
                                        <textarea
                                            required
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none h-24"
                                            placeholder="Mô tả ngắn gọn về bài viết..."
                                            value={newsForm.excerpt}
                                            onChange={e => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                                        />
                                    </div>

                                    {/* Author & Media Fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                                            <input
                                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                                placeholder="Tên tác giả"
                                                value={newsForm.author}
                                                onChange={e => setNewsForm({ ...newsForm, author: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Video (YouTube/MP4)</label>
                                            <input
                                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                                placeholder="URL Video"
                                                value={newsForm.videoUrl}
                                                onChange={e => setNewsForm({ ...newsForm, videoUrl: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết</label>
                                        <div className="bg-white">
                                            <ReactQuill
                                                theme="snow"
                                                value={newsForm.content}
                                                onChange={(content) => setNewsForm({ ...newsForm, content })}
                                                className="h-64 mb-12"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, false] }],
                                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        ['link', 'image', 'video'],
                                                        ['clean']
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Attachments UI */}
                                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tài liệu đính kèm</label>
                                        {newsForm.attachments.map((file, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                                <input
                                                    placeholder="Tên file"
                                                    className="flex-1 border p-1 rounded text-sm"
                                                    value={file.name}
                                                    onChange={e => {
                                                        const newAtt = [...newsForm.attachments];
                                                        newAtt[idx].name = e.target.value;
                                                        setNewsForm({ ...newsForm, attachments: newAtt });
                                                    }}
                                                />
                                                <input
                                                    placeholder="URL (Google Drive, PDF...)"
                                                    className="flex-1 border p-1 rounded text-sm"
                                                    value={file.url}
                                                    onChange={e => {
                                                        const newAtt = [...newsForm.attachments];
                                                        newAtt[idx].url = e.target.value;
                                                        setNewsForm({ ...newsForm, attachments: newAtt });
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newAtt = newsForm.attachments.filter((_, i) => i !== idx);
                                                        setNewsForm({ ...newsForm, attachments: newAtt });
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setNewsForm({
                                                ...newsForm,
                                                attachments: [...newsForm.attachments, { name: '', url: '', size: 'Unknown', type: 'file' }]
                                            })}
                                            className="text-sm text-brand-blue font-medium hover:underline"
                                        >
                                            + Thêm tài liệu
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <button type="submit" className={`flex-1 text-white px-4 py-2 rounded font-medium shadow-sm transition-colors ${isEditingNews ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}>
                                            {isEditingNews ? 'Cập nhật bài viết' : 'Đăng bài viết'}
                                        </button>
                                        {isEditingNews && (
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 border border-gray-300 rounded font-medium hover:bg-gray-100"
                                            >
                                                Hủy
                                            </button>
                                        )}
                                    </div>

                                    {/* SEO Tools Section */}
                                    <div className="border-t pt-6 mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-gray-800">Cấu hình SEO</h3>
                                            <button
                                                type="button"
                                                onClick={handleGenerateSEO}
                                                disabled={isGenerating}
                                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 flex items-center"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0 v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                                                AI Auto-Fill
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                                                <input
                                                    className="w-full border border-gray-300 p-2 rounded text-sm"
                                                    value={newsForm.metaTitle || ''}
                                                    onChange={e => setNewsForm({ ...newsForm, metaTitle: e.target.value })}
                                                    placeholder="Tiêu đề hiển thị trên Google"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                                                <textarea
                                                    className="w-full border border-gray-300 p-2 rounded text-sm h-16"
                                                    value={newsForm.metaDescription || ''}
                                                    onChange={e => setNewsForm({ ...newsForm, metaDescription: e.target.value })}
                                                    placeholder="Mô tả hiển thị trên Google..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Keywords</label>
                                                <input
                                                    className="w-full border border-gray-300 p-2 rounded text-sm"
                                                    value={newsForm.keywords || ''}
                                                    onChange={e => setNewsForm({ ...newsForm, keywords: e.target.value })}
                                                    placeholder="bim, xay dung, so hoa..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* News List */}
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-bold mb-6 text-gray-800">Kho Tin tức ({newsList.length})</h2>
                                <div className="space-y-4">
                                    {newsList.map((news) => (
                                        <div key={news.id} className="flex bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
                                            {news.imageUrl && (
                                                <img src={news.imageUrl} alt="" className="w-24 h-24 object-cover rounded-md mr-4" />
                                            )}
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">{news.category}</span>
                                                        <h3 className="font-bold text-lg leading-tight mb-1">{news.title}</h3>
                                                        <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                                                    </div>
                                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleCreateMarketingKit(news)}
                                                            className="text-purple-600 hover:bg-purple-50 p-2 rounded flex items-center"
                                                            title="Tạo Marketing Kit"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditNews(news)}
                                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                                                            title="Sửa"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNews(news.id)}
                                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                                            title="Xóa"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">{news.excerpt}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LIBRARY TAB */}
                    {activeTab === 'library' && (
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{editingLibId ? 'Sửa tài liệu' : 'Thêm tài liệu mới'}</h3>
                                <form onSubmit={handleLibrarySubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={libraryForm.title}
                                                onChange={(e) => setLibraryForm({ ...libraryForm, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại (Type)</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={libraryForm.type}
                                                onChange={(e) => setLibraryForm({ ...libraryForm, type: e.target.value })}
                                            >
                                                <option value="technical">Kỹ thuật thực chiến (Technical)</option>
                                                <option value="legal">Giải mã Pháp lý (Legal)</option>
                                                <option value="featured">Nổi bật (Featured)</option>
                                                <option value="infographic">Infographic</option>
                                                <option value="resource">Tài liệu & Ebook</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Nhãn)</label>
                                            <input
                                                type="text"
                                                placeholder="VD: Navisworks, Revit API"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={libraryForm.tag}
                                                onChange={(e) => setLibraryForm({ ...libraryForm, tag: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh URL</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={libraryForm.image_url}
                                                onChange={(e) => setLibraryForm({ ...libraryForm, image_url: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Link tải / Liên kết ngoài</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={libraryForm.link}
                                                onChange={(e) => setLibraryForm({ ...libraryForm, link: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                                                value={libraryForm.description}
                                                onChange={(e) => setLibraryForm({ ...libraryForm, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        {editingLibId && (
                                            <button
                                                type="button"
                                                onClick={() => { setEditingLibId(null); setLibraryForm({ title: '', description: '', type: 'technical', image_url: '', tag: '', link: '' }); }}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                            >
                                                Hủy sửa
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                        >
                                            {editingLibId ? 'Cập nhật' : 'Thêm mới'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Tiêu đề</th>
                                            <th scope="col" className="px-6 py-3">Loại</th>
                                            <th scope="col" className="px-6 py-3">Tag</th>
                                            <th scope="col" className="px-6 py-3">Link</th>
                                            <th scope="col" className="px-6 py-3 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {library.map((item) => (
                                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'featured' ? 'bg-orange-100 text-orange-800' :
                                                        item.type === 'infographic' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {item.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{item.tag}</td>
                                                <td className="px-6 py-4 truncate max-w-xs">{item.link}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => handleEditLibrary(item)} className="font-medium text-blue-600 hover:underline">Sửa</button>
                                                    <button onClick={() => handleDeleteLibrary(item.id)} className="font-medium text-red-600 hover:underline">Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {library.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                    Chưa có tài liệu nào.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Cấu hình thông tin Website</h2>
                            <p className="mb-8 text-gray-500">Các thông tin dưới đây sẽ được hiển thị ở Header và Footer của website. Cập nhật chúng sẽ thay đổi nội dung trên toàn trang.</p>

                            <form onSubmit={handleSettingsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-brand-blue border-b pb-2">Thông tin Liên lạc</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên Công ty / Đơn vị</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                            value={settings.companyName}
                                            onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                            value={settings.address}
                                            onChange={e => setSettings({ ...settings, address: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại / Hotline</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                            value={settings.phone}
                                            onChange={e => setSettings({ ...settings, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                            value={settings.email}
                                            onChange={e => setSettings({ ...settings, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-brand-blue border-b pb-2">Mạng xã hội & Khác</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                            value={settings.facebook}
                                            onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                                            value={settings.linkedin}
                                            onChange={e => setSettings({ ...settings, linkedin: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả Footer</label>
                                        <textarea
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-brand-blue outline-none h-24"
                                            value={settings.footerDescription}
                                            onChange={e => setSettings({ ...settings, footerDescription: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 text-right">
                                    <button type="submit" className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
                                        Lưu cấu hình
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TOOLS TAB */}
                    {activeTab === 'tools' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 border-r pr-8">
                                <h3 className="text-xl font-bold mb-6 text-gray-800">{editingToolId ? 'Sửa công cụ' : 'Thêm công cụ mới'}</h3>
                                <form onSubmit={handleToolSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên công cụ</label>
                                        <input className="w-full p-2 border rounded" required value={toolForm.title} onChange={e => setToolForm({ ...toolForm, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                        <textarea className="w-full p-2 border rounded h-24" required value={toolForm.description} onChange={e => setToolForm({ ...toolForm, description: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji/URL)</label>
                                        <input className="w-full p-2 border rounded" value={toolForm.icon} onChange={e => setToolForm({ ...toolForm, icon: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                        <input className="w-full p-2 border rounded" value={toolForm.link} onChange={e => setToolForm({ ...toolForm, link: e.target.value })} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 bg-brand-blue text-white py-2 rounded hover:bg-blue-700">{editingToolId ? 'Cập nhật' : 'Thêm'}</button>
                                        {editingToolId && <button type="button" onClick={() => { setEditingToolId(null); setToolForm({ title: '', description: '', icon: '', link: '' }) }} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>}
                                    </div>
                                </form>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-xl font-bold text-gray-800">Danh sách công cụ ({tools.length})</h3>
                                {tools.map(tool => (
                                    <div key={tool.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl">{tool.icon}</div>
                                            <div>
                                                <div className="font-bold text-gray-900">{tool.title}</div>
                                                <div className="text-sm text-gray-500">{tool.description}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setToolForm(tool); setEditingToolId(tool.id); }} className="text-blue-600 font-medium">Sửa</button>
                                            <button onClick={() => handleDeleteTool(tool.id)} className="text-red-500 font-medium">Xóa</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PRICING TAB */}
                    {activeTab === 'pricing' && (
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-gray-800">Quản lý Bảng giá (Dịch vụ/Phần mềm)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pricing.map(item => (
                                    <div key={item.id} className={`border rounded-xl p-6 ${editingPricingId === item.id ? 'ring-2 ring-brand-blue' : ''}`}>
                                        {editingPricingId === item.id ? (
                                            <form onSubmit={handlePricingSubmit} className="space-y-3">
                                                <input className="w-full font-bold text-lg border-b p-1" value={pricingForm.name} onChange={e => setPricingForm({ ...pricingForm, name: e.target.value })} placeholder="Tên gói" />
                                                <div className="flex gap-2">
                                                    <input className="w-1/2 font-bold text-brand-blue border-b p-1" value={pricingForm.price} onChange={e => setPricingForm({ ...pricingForm, price: e.target.value })} placeholder="Giá" />
                                                    <input className="w-1/2 text-gray-500 border-b p-1" value={pricingForm.period} onChange={e => setPricingForm({ ...pricingForm, period: e.target.value })} placeholder="/ tháng" />
                                                </div>
                                                <textarea className="w-full text-sm border p-2 rounded h-20" value={pricingForm.features} onChange={e => setPricingForm({ ...pricingForm, features: e.target.value })} placeholder="Các tính năng, mỗi dòng 1 ý" />
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button type="button" onClick={() => setEditingPricingId(null)} className="text-sm text-gray-500 hover:text-gray-700">Hủy</button>
                                                    <button type="submit" className="text-sm bg-brand-blue text-white px-3 py-1 rounded">Lưu</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{item.name}</h4>
                                                        <div className="text-brand-blue font-bold text-xl">{item.price} <span className="text-sm text-gray-500 font-normal">{item.period}</span></div>
                                                    </div>
                                                    <button onClick={() => handleEditPricing(item)} className="text-gray-400 hover:text-brand-blue">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                                                <ul className="text-sm space-y-2 mb-6">
                                                    {item.features?.map((f: string, i: number) => (
                                                        <li key={i} className="flex items-start">
                                                            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 border-r pr-8">
                                <h3 className="text-xl font-bold mb-6 text-gray-800">{editingProjectId ? 'Sửa Dự án' : 'Thêm Dự án mới'}</h3>
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <input className="w-full p-2 border rounded" required placeholder="Tên dự án" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
                                    <input className="w-full p-2 border rounded" placeholder="Khách hàng" value={projectForm.client} onChange={e => setProjectForm({ ...projectForm, client: e.target.value })} />
                                    <div className="flex gap-2">
                                        <input className="w-1/2 p-2 border rounded" placeholder="Địa điểm" value={projectForm.location} onChange={e => setProjectForm({ ...projectForm, location: e.target.value })} />
                                        <input className="w-1/2 p-2 border rounded" placeholder="Ngày hoàn thành" type="date" value={projectForm.completion_date} onChange={e => setProjectForm({ ...projectForm, completion_date: e.target.value })} />
                                    </div>
                                    <select className="w-full p-2 border rounded" value={projectForm.service_type} onChange={e => setProjectForm({ ...projectForm, service_type: e.target.value })}>
                                        <option value="Scan-to-BIM">Scan-to-BIM</option>
                                        <option value="BIM Modeling">BIM Modeling</option>
                                        <option value="Clash Detection">Clash Detection</option>
                                        <option value="Digital Twin">Digital Twin</option>
                                        <option value="Training">Training</option>
                                    </select>

                                    <div>
                                        <label className="text-sm font-medium">Hình ảnh dự án (tối đa 4 ảnh)</label>
                                        <ImageUploader
                                            value={projectForm.images[0] || ''}
                                            onChange={(url) => setProjectForm({ ...projectForm, images: [url, ...projectForm.images.slice(1)] })}
                                        />
                                        <input className="w-full p-2 border rounded mt-2 text-sm" placeholder="URL ảnh 2..." value={projectForm.images[1] || ''} onChange={e => {
                                            const newImages = [...projectForm.images];
                                            newImages[1] = e.target.value;
                                            setProjectForm({ ...projectForm, images: newImages });
                                        }} />
                                        <input className="w-full p-2 border rounded mt-2 text-sm" placeholder="URL ảnh 3..." value={projectForm.images[2] || ''} onChange={e => {
                                            const newImages = [...projectForm.images];
                                            newImages[2] = e.target.value;
                                            setProjectForm({ ...projectForm, images: newImages });
                                        }} />
                                        <input className="w-full p-2 border rounded mt-2 text-sm" placeholder="URL ảnh 4..." value={projectForm.images[3] || ''} onChange={e => {
                                            const newImages = [...projectForm.images];
                                            newImages[3] = e.target.value;
                                            setProjectForm({ ...projectForm, images: newImages });
                                        }} />
                                    </div>

                                    <textarea className="w-full p-2 border rounded h-20" placeholder="Mô tả dự án..." value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
                                    <textarea className="w-full p-2 border rounded h-20" placeholder="Thách thức..." value={projectForm.challenge} onChange={e => setProjectForm({ ...projectForm, challenge: e.target.value })} />
                                    <textarea className="w-full p-2 border rounded h-20" placeholder="Giải pháp..." value={projectForm.solution} onChange={e => setProjectForm({ ...projectForm, solution: e.target.value })} />
                                    <textarea className="w-full p-2 border rounded h-20" placeholder="Kết quả..." value={projectForm.result} onChange={e => setProjectForm({ ...projectForm, result: e.target.value })} />

                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 bg-brand-blue text-white py-2 rounded">Lưu Dự án</button>
                                        {editingProjectId && <button type="button" onClick={() => { setEditingProjectId(null); setProjectForm({ title: '', client: '', location: '', service_type: 'Scan-to-BIM', description: '', challenge: '', solution: '', result: '', images: [], completion_date: '' }) }} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>}
                                    </div>
                                </form>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-xl font-bold text-gray-800">Danh sách Dự án ({projects.length})</h3>
                                {projects.map(p => (
                                    <div key={p.id} className="flex gap-4 border p-4 rounded bg-white hover:shadow-sm">
                                        <img src={p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/150'} className="w-32 h-24 object-cover rounded" alt="" />
                                        <div className="flex-grow">
                                            <div className="flex justify-between">
                                                <h4 className="font-bold text-lg">{p.title}</h4>
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.service_type}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                                            <div className="mt-2 flex gap-4 text-xs text-gray-500">
                                                <span>Client: {p.client}</span>
                                                <span>Location: {p.location}</span>
                                            </div>
                                            <div className="mt-2 flex gap-2 justify-end">
                                                <button onClick={() => handleEditProject(p)} className="text-blue-600 text-sm">Sửa</button>
                                                <button onClick={() => handleDeleteProject(p.id)} className="text-red-600 text-sm">Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {
                        activeTab === 'analytics' && (
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-xl font-bold mb-6 text-gray-800">Thống kê & Phân tích AI</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
                                        <div className="p-3 bg-blue-100 rounded-full mr-4 text-brand-blue">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Lượt truy cập trang</div>
                                            <div className="text-3xl font-bold text-gray-800">{stats?.views || 0}</div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
                                        <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Liên hệ mới (7 ngày)</div>
                                            <div className="text-3xl font-bold text-gray-800">{stats?.contacts || 0}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg text-brand-blue flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                            Tuần này có gì nổi bật? (AI Insight)
                                        </h3>
                                        <button
                                            onClick={handleGetInsight}
                                            disabled={loadingInsight}
                                            className="text-sm border border-blue-300 bg-white px-3 py-1 rounded hover:bg-blue-50 text-brand-blue"
                                        >
                                            {loadingInsight ? 'Đang phân tích...' : 'Tạo lại báo cáo'}
                                        </button>
                                    </div>

                                    {insight ? (
                                        <div className="prose prose-sm text-gray-700 bg-white p-4 rounded shadow-sm">
                                            {insight}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            Chưa có báo cáo phân tích. Nhấn nút phía trên để AI tổng hợp dữ liệu.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div >
            </div >


            {/* Social Media Modal */}
            {
                showSocialModal && socialKit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800">Marketing Kit (AI Generated)</h3>
                                <button onClick={() => setShowSocialModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>
                            <div className="p-6 space-y-6">

                                {/* Facebook */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">f</span>
                                        Facebook Post
                                    </h4>
                                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{socialKit.facebook}</pre>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(socialKit.facebook)}
                                        className="mt-3 text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                                    >
                                        Copy Content
                                    </button>
                                </div>

                                {/* LinkedIn */}
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <h4 className="font-bold text-indigo-800 mb-2 flex items-center">
                                        <span className="w-6 h-6 bg-indigo-700 text-white rounded sm flex items-center justify-center text-xs mr-2">in</span>
                                        LinkedIn Post
                                    </h4>
                                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{socialKit.linkedin}</pre>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(socialKit.linkedin)}
                                        className="mt-3 text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100"
                                    >
                                        Copy Content
                                    </button>
                                </div>

                                {/* Email */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <span className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs mr-2">@</span>
                                        Email Newsletter
                                    </h4>
                                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{socialKit.email}</pre>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(socialKit.email)}
                                        className="mt-3 text-xs bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
                                    >
                                        Copy Content
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
            <Footer />
        </div >
    );
};

export default AdminDashboard;
