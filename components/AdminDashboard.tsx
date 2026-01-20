import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import LoginModal from './LoginModal';
import DashboardLayout from './admin/DashboardLayout';
import ContactManager from './admin/ContactManager';
import NewsManager from './admin/NewsManager';
import LibraryManager from './admin/LibraryManager';
import SettingsManager from './admin/SettingsManager';
import AnalyticsManager from './admin/AnalyticsManager';
import ToolsManager from './admin/ToolsManager';
import PricingManager from './admin/PricingManager';
import ProjectManager from './admin/ProjectManager';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('analytics'); // Default to Analytics or Projects as landing
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // --- State Management ---
    const [contacts, setContacts] = useState<any[]>([]);
    const [newsList, setNewsList] = useState<any[]>([]);
    const [library, setLibrary] = useState<any[]>([]);
    const [tools, setTools] = useState<any[]>([]);
    const [pricing, setPricing] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    // Forms & UI States
    const [showLogin, setShowLogin] = useState(false);

    // Library
    const [libraryForm, setLibraryForm] = useState({ title: '', description: '', type: 'technical', image_url: '', tag: '', link: '' });
    const [editingLibId, setEditingLibId] = useState<number | null>(null);

    // News
    const [isEditingNews, setIsEditingNews] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
    const [newsForm, setNewsForm] = useState({
        category: 'Tin tức', title: '', date: new Date().toLocaleDateString('vi-VN'),
        imageUrl: '', excerpt: '', content: '', author: '', videoUrl: '',
        audioUrl: '', attachments: [] as any[], metaTitle: '', metaDescription: '', keywords: ''
    });
    // AI News
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [socialKit, setSocialKit] = useState<any>(null);
    const [showSocialModal, setShowSocialModal] = useState(false);

    // Analytics
    const [stats, setStats] = useState<any>(null);
    const [insight, setInsight] = useState('');
    const [loadingInsight, setLoadingInsight] = useState(false);

    // Tools
    const [toolForm, setToolForm] = useState({ title: '', description: '', icon: '', link: '' });
    const [editingToolId, setEditingToolId] = useState<number | null>(null);

    // Pricing
    const [editingPricingId, setEditingPricingId] = useState<number | null>(null);
    const [pricingForm, setPricingForm] = useState({ name: '', price: '', period: '', description: '', features: '', ctaText: '' });

    // Projects
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [projectForm, setProjectForm] = useState({
        title: '', client: '', location: '', service_type: 'Scan-to-BIM',
        description: '', challenge: '', solution: '', result: '',
        images: [] as string[], completion_date: ''
    });

    // Settings
    const [settings, setSettings] = useState({
        companyName: '', address: '', phone: '', email: '',
        facebook: '', linkedin: '', footerDescription: '',
        footerCategories: '[]', footerAudiences: '[]'
    });

    // --- Authentication ---
    useEffect(() => {
        const checkAuth = async () => {
            const user = await api.getMe();
            if (user && (user.role === 'admin' || user.username === 'admin')) {
                setIsAuthenticated(true);
            } else {
                setShowLogin(true); // Show login modal if not auth
            }
        };
        checkAuth();
    }, []);

    // --- Data Loading ---
    useEffect(() => {
        if (isAuthenticated) {
            console.log('[Admin] Authenticated. Loading data for tab:', activeTab);
            if (activeTab === 'contacts') api.getContacts().then(setContacts).catch(console.error);
            if (activeTab === 'news') api.getNews().then(setNewsList).catch(console.error);
            if (activeTab === 'settings') api.getSettings().then(d => d && setSettings(d as any)).catch(console.error);
            if (activeTab === 'analytics') api.getAnalyticsStats().then(setStats).catch(console.error);
            if (activeTab === 'library') api.getLibrary().then(setLibrary).catch(console.error);
            if (activeTab === 'tools') api.getTools().then(setTools).catch(console.error);
            if (activeTab === 'pricing') api.getPricing().then(setPricing).catch(console.error);
            if (activeTab === 'projects') {
                console.log('[Admin] Calling api.getProjects()...');
                api.getProjects().then(data => {
                    console.log('[Admin] Projects received:', data);
                    setProjects(data);
                }).catch(err => {
                    console.error('[Admin] Error loading projects:', err);
                });
            }
        } else {
            console.log('[Admin] Not authenticated yet.');
        }
    }, [isAuthenticated, activeTab]);

    // --- Handlers ---

    // Contacts
    const handleDeleteContact = async (id: number) => {
        if (confirm('Xóa liên hệ này?')) {
            await api.deleteContact(id);
            setContacts(contacts.filter(c => c.id !== id));
        }
    };

    // Library
    const handleLibrarySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLibId) {
                await api.updateLibrary(editingLibId, libraryForm);
                alert('Cập nhật thành công!');
            } else {
                await api.addLibrary(libraryForm);
                alert('Thêm mới thành công!');
            }
            setEditingLibId(null);
            setLibraryForm({ title: '', description: '', type: 'technical', image_url: '', tag: '', link: '' });
            api.getLibrary().then(setLibrary);
        } catch (error) { alert('Lỗi: ' + error); }
    };

    // News & AI
    const handleGenerateNews = async () => {
        if (!aiTopic) return alert('Nhập chủ đề!');
        setIsGenerating(true);
        try {
            const res = await api.generatePost(aiTopic);
            setNewsForm({ ...newsForm, title: res.title, excerpt: res.excerpt, content: res.content });
        } catch (e) { alert('Lỗi AI: ' + e); }
        finally { setIsGenerating(false); }
    };

    const handleGenerateSEO = async () => {
        if (!newsForm.content) return alert('Cần nội dung để tạo SEO');
        setIsGenerating(true);
        try {
            const res = await api.generateSEO(newsForm.content);
            setNewsForm({ ...newsForm, metaTitle: res.metaTitle, metaDescription: res.metaDescription, keywords: Array.isArray(res.keywords) ? res.keywords.join(', ') : res.keywords });
        } catch (e) { alert('Lỗi SEO: ' + e); }
        finally { setIsGenerating(false); }
    };

    const handleNewsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingNewsId) {
                await api.updateNews(editingNewsId, newsForm);
            } else {
                await api.addNews(newsForm);
            }
            alert(editingNewsId ? 'Cập nhật xong!' : 'Đăng tin thành công!');
            setIsEditingNews(false);
            setEditingNewsId(null);
            setNewsForm({ category: 'Tin tức', title: '', date: new Date().toLocaleDateString('vi-VN'), imageUrl: '', excerpt: '', content: '', author: '', videoUrl: '', audioUrl: '', attachments: [], metaTitle: '', metaDescription: '', keywords: '' });
            api.getNews().then(setNewsList);
        } catch (e) { alert('Lỗi lưu tin'); }
    };

    const handleCreateMarketingKit = async (news: any) => {
        setIsGenerating(true);
        try {
            const res = await api.generateSocialPosts(news.content || news.excerpt);
            setSocialKit(res);
            setShowSocialModal(true);
        } catch (e) { alert('Lỗi tạo Kit: ' + e); }
        finally { setIsGenerating(false); }
    };

    // Tools
    const handleToolSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingToolId) await api.updateTool(editingToolId, toolForm);
            else await api.addTool(toolForm);
            setEditingToolId(null);
            setToolForm({ title: '', description: '', icon: '', link: '' });
            api.getTools().then(setTools);
        } catch { alert('Lỗi lưu tool'); }
    };

    // Pricing
    const handlePricingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPricingId) {
                // Ensure features is array
                const data = { ...pricingForm, features: typeof pricingForm.features === 'string' ? pricingForm.features.split('\n') : pricingForm.features };
                await api.updatePricing(editingPricingId, data);
            }
            setEditingPricingId(null);
            api.getPricing().then(setPricing);
        } catch { alert('Lỗi lưu giá'); }
    };

    // Projects
    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProjectId) await api.updateProject(editingProjectId, projectForm);
            else await api.addProject(projectForm);
            setEditingProjectId(null);
            setProjectForm({ title: '', client: '', location: '', service_type: 'Scan-to-BIM', description: '', challenge: '', solution: '', result: '', images: [], completion_date: '' });
            api.getProjects().then(setProjects);
        } catch { alert('Lỗi lưu dự án'); }
    };

    if (!isAuthenticated) {
        return <LoginModal isOpen={true} onClose={() => { }} onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => { api.logout(); setIsAuthenticated(false); }}>
            {activeTab === 'analytics' && <AnalyticsManager stats={stats} insight={insight} loadingInsight={loadingInsight} onGetInsight={async () => {
                setLoadingInsight(true);
                try { const res = await api.getAnalyticsInsight(); setInsight(res.insight); } catch { alert('Lỗi AI'); } finally { setLoadingInsight(false); }
            }} />}

            {activeTab === 'projects' && <ProjectManager projects={projects} form={projectForm} setForm={setProjectForm} editingId={editingProjectId} setEditingId={setEditingProjectId} onSubmit={handleProjectSubmit} onEdit={(p) => { setProjectForm(p); setEditingProjectId(p.id); }} onDelete={async (id) => { if (confirm('Xóa?')) { await api.deleteProject(id); api.getProjects().then(setProjects); } }} />}

            {activeTab === 'news' && <NewsManager newsList={newsList} form={newsForm} setForm={setNewsForm} editingId={editingNewsId} setEditingId={setEditingNewsId} onSubmit={handleNewsSubmit} onEdit={(n) => { setNewsForm(n); setEditingNewsId(n.id); setIsEditingNews(true); }} onDelete={async (id) => { if (confirm('Xóa?')) { await api.deleteNews(id); api.getNews().then(setNewsList); } }} isGenerating={isGenerating} aiTopic={aiTopic} setAiTopic={setAiTopic} onGenerate={handleGenerateNews} onSEO={handleGenerateSEO} onMarketingKit={handleCreateMarketingKit} onCancelEdit={() => { setIsEditingNews(false); setEditingNewsId(null); }} />}

            {activeTab === 'library' && <LibraryManager library={library} form={libraryForm} setForm={setLibraryForm} editingId={editingLibId} setEditingId={setEditingLibId} onSubmit={handleLibrarySubmit} onEdit={(l) => { setLibraryForm(l); setEditingLibId(l.id); }} onDelete={async (id) => { if (confirm('Xóa?')) { await api.deleteLibrary(id); api.getLibrary().then(setLibrary); } }} />}

            {activeTab === 'contacts' && <ContactManager contacts={contacts} onDelete={handleDeleteContact} />}

            {activeTab === 'tools' && <ToolsManager tools={tools} toolForm={toolForm} setToolForm={setToolForm} editingId={editingToolId} setEditingId={setEditingToolId} onSubmit={handleToolSubmit} onDelete={async (id) => { if (confirm('Xóa?')) { await api.deleteTool(id); api.getTools().then(setTools); } }} />}

            {activeTab === 'pricing' && <PricingManager pricing={pricing} pricingForm={pricingForm} setPricingForm={setPricingForm} editingId={editingPricingId} setEditingId={setEditingPricingId} onSubmit={handlePricingSubmit} />}

            {activeTab === 'settings' && <SettingsManager settings={settings} setSettings={setSettings} onSubmit={async (e) => { e.preventDefault(); try { await api.saveSettings(settings); alert('Đã lưu!'); } catch { alert('Lỗi!'); } }} />}

            {/* Reuse Social Modal logic here if needed, or move to NewsManager */}
            {showSocialModal && socialKit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Marketing Kit</h3>
                            <button onClick={() => setShowSocialModal(false)}>✕</button>
                        </div>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="bg-blue-50 p-4 rounded">
                                <h4 className="font-bold text-blue-800">Facebook</h4>
                                <pre className="whitespace-pre-wrap text-sm">{socialKit.facebook}</pre>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded">
                                <h4 className="font-bold text-indigo-800">LinkedIn</h4>
                                <pre className="whitespace-pre-wrap text-sm">{socialKit.linkedin}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboard;
