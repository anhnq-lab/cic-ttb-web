import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoginModal from './LoginModal';
import SimpleSidebar from './admin/SimpleSidebar';
import DataTable, { Column } from './admin/DataTable';
import EditModal, { Field } from './admin/EditModal';
import adminApi from '../services/adminApi';

const SimpleAdminPanel: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');
    const [loading, setLoading] = useState(false);

    // Data states
    const [projects, setProjects] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [library, setLibrary] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [tools, setTools] = useState<any[]>([]);
    const [pricing, setPricing] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [modalFields, setModalFields] = useState<Field[]>([]);
    const [modalTitle, setModalTitle] = useState('');

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await api.getMe();
                if (user && (user.role === 'admin' || user.username === 'admin')) {
                    setIsAuthenticated(true);
                }
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    // Load data when tab changes
    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [activeTab, isAuthenticated]);

    const loadData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'projects': {
                    const projRes = await adminApi.projects.getAll();
                    console.log('[SimpleAdminPanel] Projects response:', projRes);
                    if (projRes.success) {
                        console.log('[SimpleAdminPanel] Projects data:', projRes.data);
                        setProjects(projRes.data || []);
                    } else {
                        console.error('[SimpleAdminPanel] Projects error:', projRes.error);
                        alert('Lỗi tải dự án: ' + projRes.error);
                    }
                    break;
                }
                case 'news': {
                    const newsRes = await adminApi.news.getAll();
                    if (newsRes.success) setNews(newsRes.data || []);
                    break;
                }
                case 'courses': {
                    const coursesRes = await adminApi.courses.getAll();
                    if (coursesRes.success) setCourses(coursesRes.data || []);
                    break;
                }
                case 'library': {
                    const libRes = await adminApi.library.getAll();
                    if (libRes.success) setLibrary(libRes.data || []);
                    break;
                }
                case 'contacts': {
                    const contactsRes = await adminApi.contacts.getAll();
                    if (contactsRes.success) setContacts(contactsRes.data || []);
                    break;
                }
                case 'tools': {
                    const toolsRes = await adminApi.tools.getAll();
                    if (toolsRes.success) setTools(toolsRes.data || []);
                    break;
                }
                case 'pricing': {
                    const pricingRes = await adminApi.pricing.getAll();
                    if (pricingRes.success) setPricing(pricingRes.data || []);
                    break;
                }
                case 'settings': {
                    const settingsRes = await adminApi.settings.get();
                    if (settingsRes.success) setSettings(settingsRes.data || {});
                    break;
                }
            }
        } catch (error: any) {
            alert('Lỗi tải dữ liệu: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setEditModalOpen(true);
    };

    const handleEdit = (item: any) => {
        if (activeTab === 'contacts') {
            alert('Contacts chỉ có thể xem và xóa, không thể sửa');
            return;
        }
        setEditingItem(item);
        setEditModalOpen(true);
    };

    const handleDelete = async (id: string | number) => {
        try {
            let result;
            switch (activeTab) {
                case 'projects':
                    result = await adminApi.projects.delete(id);
                    break;
                case 'news':
                    result = await adminApi.news.delete(id);
                    break;
                case 'courses':
                    result = await adminApi.courses.delete(id);
                    break;
                case 'library':
                    result = await adminApi.library.delete(id);
                    break;
                case 'contacts':
                    result = await adminApi.contacts.delete(id);
                    break;
                case 'tools':
                    result = await adminApi.tools.delete(id);
                    break;
                default:
                    return;
            }
            if (result.success) {
                loadData();
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error: any) {
            alert('Lỗi: ' + (error.message || 'Unknown error'));
        }
    };

    const handleModalSubmit = async (data: any) => {
        try {
            console.log('[SimpleAdminPanel] Submitting data:', {
                activeTab,
                isEdit: !!editingItem,
                editingId: editingItem?.id,
                dataKeys: Object.keys(data),
                hasImages: !!data.images,
                imagesType: Array.isArray(data.images) ? 'array' : typeof data.images
            });

            let result;
            const isEdit = !!editingItem;

            switch (activeTab) {
                case 'projects': {
                    if (isEdit) {
                        console.log('[SimpleAdminPanel] Updating project:', editingItem.id);
                        result = await adminApi.projects.update(editingItem.id, data);
                        console.log('[SimpleAdminPanel] Update result:', result);
                    } else {
                        console.log('[SimpleAdminPanel] Creating project');
                        result = await adminApi.projects.create(data);
                        console.log('[SimpleAdminPanel] Create result:', result);
                    }
                    break;
                }
                case 'news': {
                    if (isEdit) {
                        result = await adminApi.news.update(editingItem.id, data);
                    } else {
                        result = await adminApi.news.create(data);
                    }
                    break;
                }
                case 'courses': {
                    if (isEdit) {
                        result = await adminApi.courses.update(editingItem.id, data);
                    } else {
                        result = await adminApi.courses.create(data);
                    }
                    break;
                }
                case 'library': {
                    if (isEdit) {
                        result = await adminApi.library.update(editingItem.id, data);
                    } else {
                        result = await adminApi.library.create(data);
                    }
                    break;
                }
                case 'tools': {
                    if (isEdit) {
                        result = await adminApi.tools.update(editingItem.id, data);
                    } else {
                        result = await adminApi.tools.create(data);
                    }
                    break;
                }
                case 'pricing': {
                    if (isEdit) {
                        result = await adminApi.pricing.update(editingItem.id, data);
                    }
                    break;
                }
                case 'settings': {
                    result = await adminApi.settings.update(data);
                    break;
                }
                default:
                    return;
            }

            if (result && result.success) {
                setEditModalOpen(false);
                loadData();
            } else {
                alert('Lỗi: ' + (result?.error || 'Unknown error'));
            }
        } catch (error: any) {
            alert('Lỗi: ' + (error.message || 'Unknown error'));
        }
    };

    // Define columns and fields for each tab
    const getColumns = (): Column[] => {
        switch (activeTab) {
            case 'projects':
                return [
                    { key: 'title', label: 'Tiêu đề' },
                    { key: 'client', label: 'Khách hàng' },
                    { key: 'location', label: 'Địa điểm' },
                    { key: 'service_type', label: 'Loại dịch vụ' },
                    { key: 'status', label: 'Trạng thái' },
                ];
            case 'news':
                return [
                    { key: 'title', label: 'Tiêu đề' },
                    { key: 'category', label: 'Danh mục' },
                    { key: 'date', label: 'Ngày', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-' },
                    { key: 'author', label: 'Tác giả' },
                ];
            case 'courses':
                return [
                    { key: 'title', label: 'Tiêu đề' },
                    { key: 'level', label: 'Cấp độ' },
                    { key: 'price', label: 'Giá', render: (val) => val ? `${val.toLocaleString('vi-VN')}đ` : '-' },
                    { key: 'duration', label: 'Thời lượng' },
                    { key: 'is_active', label: 'Hoạt động', render: (val) => val ? 'Có' : 'Không' },
                ];
            case 'library':
                return [
                    { key: 'title', label: 'Tiêu đề' },
                    { key: 'type', label: 'Loại' },
                    { key: 'tag', label: 'Tag' },
                ];
            case 'contacts':
                return [
                    { key: 'name', label: 'Tên' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Điện thoại' },
                    { key: 'company', label: 'Công ty' },
                    { key: 'service', label: 'Dịch vụ' },
                    { key: 'created_at', label: 'Ngày', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-' },
                ];
            case 'tools':
                return [
                    { key: 'title', label: 'Tiêu đề' },
                    { key: 'description', label: 'Mô tả', render: (val) => val ? (val.length > 50 ? val.substring(0, 50) + '...' : val) : '-' },
                    { key: 'link', label: 'Link' },
                ];
            case 'pricing':
                return [
                    { key: 'name', label: 'Tên gói' },
                    { key: 'price', label: 'Giá' },
                    { key: 'period', label: 'Chu kỳ' },
                    { key: 'isPopular', label: 'Phổ biến', render: (val) => val ? 'Có' : 'Không' },
                ];
            default:
                return [];
        }
    };

    const getFields = (): Field[] => {
        switch (activeTab) {
            case 'projects':
                return [
                    { key: 'title', label: 'Tiêu đề', type: 'text', required: true },
                    { key: 'client', label: 'Khách hàng', type: 'text' },
                    { key: 'location', label: 'Địa điểm', type: 'text' },
                    { key: 'service_type', label: 'Loại dịch vụ', type: 'select', options: [
                        { value: 'Scan-to-BIM', label: 'Scan-to-BIM' },
                        { value: '3D Modeling', label: '3D Modeling' },
                        { value: 'BIM Modeling', label: 'BIM Modeling' },
                        { value: 'BIM Coordination', label: 'BIM Coordination' },
                        { value: 'Clash Detection', label: 'Clash Detection' },
                        { value: 'Digital Twin', label: 'Digital Twin' },
                        { value: 'Training', label: 'Training' },
                        { value: 'Consulting', label: 'Consulting' },
                        { value: 'Other', label: 'Other' },
                    ] },
                    { key: 'images', label: 'Hình ảnh dự án (Ảnh 1 là ảnh bìa)', type: 'images', maxImages: 4, helpText: 'Ảnh 1 sẽ được dùng làm ảnh bìa' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'scope_of_work', label: 'Phạm vi công việc', type: 'textarea' },
                    { key: 'challenge', label: 'Thách thức', type: 'textarea' },
                    { key: 'solution', label: 'Giải pháp', type: 'textarea' },
                    { key: 'result', label: 'Kết quả', type: 'textarea' },
                    { key: 'content', label: 'Nội dung chi tiết (HTML)', type: 'textarea', rows: 10 },
                    { key: 'completion_date', label: 'Ngày hoàn thành', type: 'date' },
                    { key: 'status', label: 'Trạng thái', type: 'select', options: [
                        { value: 'published', label: 'Công khai' },
                        { value: 'draft', label: 'Bản nháp' },
                        { value: 'pending', label: 'Chờ duyệt' },
                    ] },
                ];
            case 'news':
                return [
                    { key: 'title', label: 'Tiêu đề', type: 'text', required: true },
                    { key: 'category', label: 'Danh mục', type: 'text' },
                    { key: 'date', label: 'Ngày', type: 'date' },
                    { key: 'imageUrl', label: 'Ảnh bìa', type: 'image' },
                    { key: 'excerpt', label: 'Tóm tắt', type: 'textarea', rows: 3 },
                    { key: 'content', label: 'Nội dung', type: 'textarea', rows: 10 },
                    { key: 'author', label: 'Tác giả', type: 'text' },
                ];
            case 'courses':
                return [
                    { key: 'title', label: 'Tiêu đề', type: 'text', required: true },
                    { key: 'slug', label: 'Slug', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'content', label: 'Nội dung', type: 'textarea', rows: 10 },
                    { key: 'price', label: 'Giá', type: 'number' },
                    { key: 'duration', label: 'Thời lượng', type: 'text' },
                    { key: 'level', label: 'Cấp độ', type: 'select', options: [
                        { value: 'Cơ bản', label: 'Cơ bản' },
                        { value: 'Trung bình', label: 'Trung bình' },
                        { value: 'Nâng cao', label: 'Nâng cao' },
                    ] },
                    { key: 'image_url', label: 'Ảnh khóa học', type: 'image' },
                    { key: 'is_active', label: 'Hoạt động', type: 'checkbox' },
                ];
            case 'library':
                return [
                    { key: 'title', label: 'Tiêu đề', type: 'text', required: true },
                    { key: 'type', label: 'Loại', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'tag', label: 'Tag', type: 'text' },
                    { key: 'image_url', label: 'Ảnh', type: 'image' },
                    { key: 'link', label: 'Link', type: 'url' },
                ];
            case 'tools':
                return [
                    { key: 'title', label: 'Tiêu đề', type: 'text', required: true },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'icon', label: 'Icon', type: 'text' },
                    { key: 'link', label: 'Link', type: 'url' },
                ];
            case 'pricing':
                return [
                    { key: 'name', label: 'Tên gói', type: 'text', required: true },
                    { key: 'price', label: 'Giá', type: 'text' },
                    { key: 'period', label: 'Chu kỳ', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'features', label: 'Tính năng (JSON array)', type: 'json', helpText: 'Ví dụ: ["Tính năng 1", "Tính năng 2"]' },
                    { key: 'ctaText', label: 'Text nút CTA', type: 'text' },
                    { key: 'isPopular', label: 'Phổ biến', type: 'checkbox' },
                ];
            case 'settings':
                return [
                    { key: 'companyName', label: 'Tên công ty', type: 'text' },
                    { key: 'address', label: 'Địa chỉ', type: 'text' },
                    { key: 'phone', label: 'Điện thoại', type: 'text' },
                    { key: 'email', label: 'Email', type: 'email' },
                    { key: 'facebook', label: 'Facebook', type: 'url' },
                    { key: 'linkedin', label: 'LinkedIn', type: 'url' },
                    { key: 'footerDescription', label: 'Mô tả footer', type: 'textarea' },
                ];
            default:
                return [];
        }
    };

    // Update modal when tab or editing item changes
    useEffect(() => {
        if (editModalOpen) {
            const fields = getFields();
            setModalFields(fields);
            const tabNames: Record<string, string> = {
                projects: 'Dự án',
                news: 'Tin tức',
                courses: 'Khóa học',
                library: 'Thư viện',
                tools: 'Công cụ',
                pricing: 'Bảng giá',
            };
            const tabName = tabNames[activeTab] || activeTab;
            setModalTitle(editingItem ? `Sửa ${tabName}` : `Thêm mới ${tabName}`);
        }
    }, [editModalOpen, activeTab, editingItem]);

    // Force reload data when tab changes
    useEffect(() => {
        if (isAuthenticated && activeTab) {
            loadData();
        }
    }, [activeTab, isAuthenticated]);

    if (!isAuthenticated) {
        return <LoginModal isOpen={true} onClose={() => {}} onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    const currentData = {
        projects,
        news,
        courses,
        library,
        contacts,
        tools,
        pricing,
    }[activeTab] || [];

    const handleSettingsSave = async () => {
        try {
            const result = await adminApi.settings.update(settings);
            if (result.success) {
                alert('Đã lưu cấu hình thành công!');
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error: any) {
            alert('Lỗi: ' + (error.message || 'Unknown error'));
        }
    };

    const renderContent = () => {
        if (activeTab === 'settings') {
            return (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Cấu hình</h2>
                        <button
                            onClick={handleSettingsSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Lưu cấu hình
                        </button>
                    </div>
                    <div className="space-y-4">
                        {getFields().map((field) => (
                            <div key={field.key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={settings[field.key] || ''}
                                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows={4}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        value={settings[field.key] || ''}
                                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <DataTable
                title={`Quản lý ${activeTab}`}
                columns={getColumns()}
                data={currentData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                searchable={true}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SimpleSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={() => {
                    api.logout();
                    setIsAuthenticated(false);
                }}
            />
            <div className="flex-1 ml-64">
                <main className="p-8">
                    {renderContent()}
                    {activeTab !== 'settings' && (
                        <EditModal
                            isOpen={editModalOpen}
                            title={modalTitle}
                            fields={modalFields}
                            data={editingItem || {}}
                            onSubmit={handleModalSubmit}
                            onClose={() => {
                                setEditModalOpen(false);
                                setEditingItem(null);
                            }}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default SimpleAdminPanel;
