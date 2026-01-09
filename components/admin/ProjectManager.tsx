import React from 'react';
import ImageUploader from '../ImageUploader';

interface ProjectManagerProps {
    projects: any[];
    form: any;
    setForm: (f: any) => void;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, form, setForm, editingId, setEditingId, onSubmit, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 sticky top-4">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">{editingId ? 'Chỉnh sửa Dự án' : 'Thêm Dự án mới'}</h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án</label>
                            <input className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="Tên dự án" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
                            <input className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Khách hàng" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                                <input className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Địa điểm" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hoàn thành</label>
                                <input className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="date" value={form.completion_date} onChange={e => setForm({ ...form, completion_date: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại dịch vụ</label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })}>
                                <option value="Scan-to-BIM">Scan-to-BIM</option>
                                <option value="BIM Modeling">BIM Modeling</option>
                                <option value="Clash Detection">Clash Detection</option>
                                <option value="Digital Twin">Digital Twin</option>
                                <option value="Training">Training</option>
                                <option value="Consulting">Consulting</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh dự án (Ảnh 1 là ảnh bìa)</label>
                            <ImageUploader
                                value={form.images[0] || ''}
                                onChange={(url) => setForm({ ...form, images: [url, ...form.images.slice(1)] })}
                            />
                            <div className="mt-2 space-y-2">
                                <input className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="URL ảnh 2..." value={form.images[1] || ''} onChange={e => {
                                    const newImages = [...form.images];
                                    newImages[1] = e.target.value;
                                    setForm({ ...form, images: newImages });
                                }} />
                                <input className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="URL ảnh 3..." value={form.images[2] || ''} onChange={e => {
                                    const newImages = [...form.images];
                                    newImages[2] = e.target.value;
                                    setForm({ ...form, images: newImages });
                                }} />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <textarea className="w-full p-2 border border-gray-300 rounded h-20 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Mô tả dự án..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            <textarea className="w-full p-2 border border-gray-300 rounded h-20 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Thách thức..." value={form.challenge} onChange={e => setForm({ ...form, challenge: e.target.value })} />
                            <textarea className="w-full p-2 border border-gray-300 rounded h-20 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Giải pháp..." value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} />
                            <textarea className="w-full p-2 border border-gray-300 rounded h-20 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Kết quả..." value={form.result} onChange={e => setForm({ ...form, result: e.target.value })} />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-sm transition-colors">
                                {editingId ? 'Cập nhật Dự án' : 'Lưu Dự án Mới'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => {
                                    setEditingId(null);
                                    setForm({ title: '', client: '', location: '', service_type: 'Scan-to-BIM', description: '', challenge: '', solution: '', result: '', images: [], completion_date: '' })
                                }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="xl:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Danh sách Dự án ({projects.length})</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => (
                        <div key={p.id} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48">
                                <img src={p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} className="w-full h-full object-cover" alt={p.title} />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm">
                                    {p.service_type}
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h4 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1" title={p.title}>{p.title}</h4>
                                <div className="flex text-xs text-gray-500 mb-3 space-x-3">
                                    <span className="flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>{p.client}</span>
                                    <span className="flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{p.location}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{p.description}</p>
                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                    <button onClick={() => onEdit(p)} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium transition-colors">Sửa</button>
                                    <button onClick={() => onDelete(p.id)} className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium transition-colors">Xóa</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            Chưa có dự án nào. Hãy thêm dự án đầu tiên!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectManager;
