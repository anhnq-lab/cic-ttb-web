import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUploader from '../ImageUploader';

interface NewsManagerProps {
    newsList: any[];
    form: any;
    setForm: (f: any) => void;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
    isGenerating: boolean;
    aiTopic: string;
    setAiTopic: (s: string) => void;
    onGenerate: () => void;
    onSEO: () => void;
    onMarketingKit: (news: any) => void;
    onCancelEdit: () => void;
}

const NewsManager: React.FC<NewsManagerProps> = ({
    newsList, form, setForm, editingId, setEditingId, onSubmit, onEdit, onDelete,
    isGenerating, aiTopic, setAiTopic, onGenerate, onSEO, onMarketingKit, onCancelEdit
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* News Form */}
            <div className="lg:col-span-1 border-r pr-8 border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Chỉnh sửa Tin tức' : 'Đăng Tin mới'}</h2>

                {/* AI Tool */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6 border border-blue-100 shadow-sm">
                    <h3 className="font-bold text-brand-blue text-sm mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                        AI Magic Writer
                    </h3>
                    <div className="flex gap-2">
                        <input
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            placeholder="Nhập chủ đề..."
                            className="flex-grow border border-blue-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                        <button
                            type="button"
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className="bg-brand-blue text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isGenerating ? '...' : 'Viết'}
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết</label>
                        <input
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="Nhập tiêu đề..."
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                            <select
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
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
                                value={form.imageUrl}
                                onChange={(url) => setForm({ ...form, imageUrl: url })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt ngắn</label>
                        <textarea
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none h-24"
                            placeholder="Mô tả ngắn gọn về bài viết..."
                            value={form.excerpt}
                            onChange={e => setForm({ ...form, excerpt: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                            <input
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                placeholder="Tên tác giả"
                                value={form.author}
                                onChange={e => setForm({ ...form, author: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                            <input
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                placeholder="URL Video"
                                value={form.videoUrl}
                                onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết</label>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
                            <ReactQuill
                                theme="snow"
                                value={form.content}
                                onChange={(content) => setForm({ ...form, content })}
                                className="h-64 mb-12"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'image', 'video', 'clean']
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="submit" className={`flex-1 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-colors ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}>
                            {editingId ? 'Cập nhật bài viết' : 'Đăng bài viết'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                        )}
                    </div>

                    {/* SEO Tools Section */}
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-purple-900 border-b border-purple-200 pb-1">Cấu hình SEO</h3>
                            <button
                                type="button"
                                onClick={onSEO}
                                disabled={isGenerating}
                                className="text-xs bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 flex items-center shadow-sm transition-colors"
                            >
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0 v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                                AI Auto-Fill
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                className="w-full border border-purple-200 p-2 rounded text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                                value={form.metaTitle || ''}
                                onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                                placeholder="Meta Title (Tiêu đề SEO)"
                            />
                            <textarea
                                className="w-full border border-purple-200 p-2 rounded text-sm h-16 focus:ring-2 focus:ring-purple-400 outline-none"
                                value={form.metaDescription || ''}
                                onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                                placeholder="Meta Description (Mô tả SEO)"
                            />
                            <input
                                className="w-full border border-purple-200 p-2 rounded text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                                value={form.keywords || ''}
                                onChange={e => setForm({ ...form, keywords: e.target.value })}
                                placeholder="Keywords (Từ khóa phân cách dấu phẩy)"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* News List */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Kho Tin tức & Bài viết ({newsList.length})</h2>
                <div className="space-y-4">
                    {newsList.map((news) => (
                        <div key={news.id} className="flex bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all group">
                            <div className="w-32 h-24 flex-shrink-0 mr-4">
                                <img src={news.imageUrl || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2 font-medium">{news.category}</span>
                                            <h3 className="font-bold text-lg leading-tight mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">{news.title}</h3>
                                        </div>
                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onMarketingKit(news)}
                                                className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
                                                title="Tạo Marketing Kit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => onEdit(news)}
                                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                title="Sửa"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => onDelete(news.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{news.excerpt}</p>
                                </div>
                                <div className="mt-3 text-xs text-gray-400 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {news.date}
                                </div>
                            </div>
                        </div>
                    ))}
                    {newsList.length === 0 && (
                        <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            Chưa có bài viết nào.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsManager;
