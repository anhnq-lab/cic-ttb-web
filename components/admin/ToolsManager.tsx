import React from 'react';

interface ToolsManagerProps {
    tools: any[];
    toolForm: any;
    setToolForm: (f: any) => void;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (id: number) => void;
}

const ToolsManager: React.FC<ToolsManagerProps> = ({ tools, toolForm, setToolForm, editingId, setEditingId, onSubmit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">{editingId ? 'Sửa công cụ' : 'Thêm công cụ mới'}</h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên công cụ</label>
                            <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required value={toolForm.title} onChange={e => setToolForm({ ...toolForm, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" required value={toolForm.description} onChange={e => setToolForm({ ...toolForm, description: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji/URL)</label>
                            <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={toolForm.icon} onChange={e => setToolForm({ ...toolForm, icon: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                            <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={toolForm.link} onChange={e => setToolForm({ ...toolForm, link: e.target.value })} />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
                            {editingId && <button type="button" onClick={() => { setEditingId(null); setToolForm({ title: '', description: '', icon: '', link: '' }) }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Hủy</button>}
                        </div>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Danh sách công cụ ({tools.length})</h3>
                    <div className="space-y-3">
                        {tools.map(tool => (
                            <div key={tool.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg text-2xl">{tool.icon}</div>
                                    <div>
                                        <div className="font-bold text-gray-900">{tool.title}</div>
                                        <div className="text-sm text-gray-500">{tool.description}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setToolForm(tool); setEditingId(tool.id); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => onDelete(tool.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolsManager;
