import React from 'react';
import type { LibraryItem, LibraryForm } from '../../types/admin';

interface LibraryManagerProps {
    library: LibraryItem[];
    form: LibraryForm;
    setForm: (f: LibraryForm) => void;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onEdit: (item: LibraryItem) => void;
    onDelete: (id: number) => void;
}

const LibraryManager: React.FC<LibraryManagerProps> = ({ library, form, setForm, editingId, setEditingId, onSubmit, onEdit, onDelete }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Thư viện Kiến thức</h2>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">{editingId ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                                placeholder="Nhập tên tài liệu..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài liệu</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value as LibraryForm['type'] })}
                            >
                                <option value="technical">Kỹ thuật (Technical)</option>
                                <option value="legal">Pháp lý (Legal)</option>
                                <option value="featured">Nổi bật (Featured)</option>
                                <option value="infographic">Infographic</option>
                                <option value="resource">Tài liệu & Ebook</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Nhãn)</label>
                            <input
                                type="text"
                                placeholder="VD: Revit, Civil 3D, NĐ 15..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.tag}
                                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh Thumbnail URL</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link tải / Liên kết ngoài</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Mô tả nội dung tài liệu..."
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => { setEditingId(null); setForm({ title: '', description: '', type: 'technical', image_url: '', tag: '', link: '' }); }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all active:scale-95"
                        >
                            {editingId ? 'Cập nhật Tài liệu' : 'Thêm Tài liệu'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th scope="col" className="px-6 py-4">Thông tin Tài liệu</th>
                            <th scope="col" className="px-6 py-4">Loại & Tag</th>
                            <th scope="col" className="px-6 py-4">Link</th>
                            <th scope="col" className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {library.map((item) => (
                            <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover border" />}
                                        <div className="font-medium text-gray-900">{item.title}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`w-fit px-2 py-0.5 rounded text-xs font-bold border ${item.type === 'featured' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            item.type === 'infographic' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                item.type === 'legal' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {item.type.toUpperCase()}
                                        </span>
                                        {item.tag && <span className="text-xs text-gray-500">#{item.tag}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px] block">
                                        {item.link}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {library.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Chưa có tài liệu nào trong thư viện.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LibraryManager;
