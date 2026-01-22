
import React, { useState, useEffect } from 'react';
import { trainingService, TrainingCourse } from '../../services/trainingService';

const TrainingManager: React.FC = () => {
    const [courses, setCourses] = useState<TrainingCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState<Partial<TrainingCourse>>({
        title: '',
        slug: '',
        description: '',
        content: '',
        price: 0,
        duration: '',
        level: 'Cơ bản',
        image_url: '',
        is_active: true
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await trainingService.getCourses();
            setCourses(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await (trainingService as any).updateCourse(editingId, form);
                alert('Cập nhật thành công!');
            } else {
                await (trainingService as any).addCourse(form);
                alert('Thêm mới thành công!');
            }
            setEditingId(null);
            setShowForm(false);
            setForm({ title: '', slug: '', description: '', content: '', price: 0, duration: '', level: 'Cơ bản', image_url: '', is_active: true });
            fetchCourses();
        } catch (e) {
            alert('Lỗi lưu khóa học');
        }
    };

    const handleEdit = (course: TrainingCourse) => {
        setForm(course);
        setEditingId(course.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Xóa khóa học này?')) {
            try {
                await (trainingService as any).deleteCourse(id);
                fetchCourses();
            } catch (e) {
                alert('Lỗi khi xóa');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý Khóa học BIM</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', slug: '', description: '', content: '', price: 0, duration: '', level: 'Cơ bản', image_url: '', is_active: true }); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Hủy' : '+ Thêm khóa học mới'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tiêu đề khóa học</label>
                                <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                                <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Thời lượng</label>
                                    <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cấp độ</label>
                                    <select className="w-full border rounded px-3 py-2 mt-1" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                                        <option>Cơ bản</option>
                                        <option>Trung cấp</option>
                                        <option>Nâng cao</option>
                                        <option>Chuyên gia</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Học phí (VND)</label>
                                <input type="number" className="w-full border rounded px-3 py-2 mt-1" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ảnh bìa (URL)</label>
                                <input type="text" className="w-full border rounded px-3 py-2 mt-1" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                                <textarea rows={2} className="w-full border rounded px-3 py-2 mt-1" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nội dung chi tiết (HTML)</label>
                                <textarea rows={10} className="w-full border rounded px-3 py-2 mt-1 text-sm font-mono" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="mr-2" />
                                <label htmlFor="is_active" className="text-sm font-medium">Đang mở tuyển sinh</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                            {editingId ? 'Cập nhật khóa học' : 'Lưu khóa học'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-20 text-gray-400">Đang tải...</p>
                ) : courses.map(course => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                        <img src={course.image_url} alt="" className="h-32 w-full object-cover" />
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{course.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${course.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {course.is_active ? 'ACTIVE' : 'DRAFT'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Sửa</button>
                                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Xóa</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainingManager;
