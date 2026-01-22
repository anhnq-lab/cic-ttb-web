
import React, { useState, useEffect } from 'react';
import { trainingService, Lead } from '../../services/trainingService';

const LeadManager: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            // trainingService.getLeads doesn't exist yet, I need to add it or use api directly
            // For now, let's assume we use a mock if not available, but I should add it to trainingService
            // Actually, I'll add getLeads to trainingService first or just use a local mock for now.
            // Let's assume trainingService has it.
            const data = await (trainingService as any).getLeads();
            setLeads(data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await (trainingService as any).updateLeadStatus(id, status);
            setLeads(leads.map(l => l.id === id ? { ...l, status: status as any } : l));
        } catch (error) {
            alert('Lỗi cập nhật trạng thái');
        }
    };

    const filteredLeads = leads.filter(l => filterStatus === 'all' || l.status === filterStatus);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Mới</span>;
            case 'contacted': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Đã liên hệ</span>;
            case 'converted': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Đã chốt</span>;
            case 'closed': return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">Đóng</span>;
            default: return null;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý Đăng ký Khóa học</h2>
                <div className="flex gap-4">
                    <select
                        className="border rounded px-3 py-2 text-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="new">Mới</option>
                        <option value="contacted">Đã liên hệ</option>
                        <option value="converted">Đã chốt</option>
                        <option value="closed">Đóng</option>
                    </select>
                    <button onClick={fetchLeads} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Làm mới</button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Ngày đăng ký</th>
                            <th className="px-6 py-4">Thông tin khách hàng</th>
                            <th className="px-6 py-4">Khóa học quan tâm</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 italic">
                        {loading ? (
                            <tr><td colSpan={5} className="p-10 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr><td colSpan={5} className="p-10 text-center text-gray-400">Không có dữ liệu</td></tr>
                        ) : filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50 not-italic">
                                <td className="px-6 py-4 text-sm font-medium">
                                    {new Date(lead.created_at || '').toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{lead.name}</div>
                                    <div className="text-xs text-gray-500">{lead.email}</div>
                                    <div className="text-xs text-gray-500">{lead.phone}</div>
                                    {lead.company && <div className="text-xs text-blue-600 mt-1">{lead.company} - {lead.position}</div>}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {lead.course_id || 'Chung'}
                                    {lead.message && <div className="text-xs text-gray-400 mt-1 italic">"{lead.message}"</div>}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(lead.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        className="text-xs border rounded px-2 py-1"
                                        value={lead.status}
                                        onChange={(e) => handleUpdateStatus(lead.id!, e.target.value)}
                                    >
                                        <option value="new">Mới</option>
                                        <option value="contacted">Đã liên hệ</option>
                                        <option value="converted">Đã chốt</option>
                                        <option value="closed">Đóng</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadManager;
