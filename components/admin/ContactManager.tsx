import React, { useState } from 'react';
import type { Contact } from '../../types/admin';
import { exportContacts } from '../../utils/export';

interface ContactManagerProps {
    contacts: Contact[];
    onDelete: (id: number) => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({ contacts, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Contact['status']>('all');
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; contact: Contact | null }>({
        isOpen: false,
        contact: null
    });

    // Filter contacts
    const filteredContacts = contacts.filter(c => {
        const matchSearch =
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.company?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.phone?.includes(searchTerm));

        const matchStatus = statusFilter === 'all' || c.status === statusFilter;

        return matchSearch && matchStatus;
    });

    const handleExport = () => {
        if (filteredContacts.length === 0) {
            alert('Không có liên hệ nào để xuất');
            return;
        }
        exportContacts(filteredContacts);
    };

    const handleDeleteClick = (contact: Contact) => {
        setDeleteConfirm({ isOpen: true, contact });
    };

    const confirmDelete = () => {
        if (deleteConfirm.contact) {
            onDelete(deleteConfirm.contact.id as number);
        }
        setDeleteConfirm({ isOpen: false, contact: null });
    };

    const getStatusBadge = (status: Contact['status']) => {
        const statusStyles = {
            new: 'bg-blue-100 text-blue-700',
            contacted: 'bg-yellow-100 text-yellow-700',
            qualified: 'bg-purple-100 text-purple-700',
            converted: 'bg-green-100 text-green-700',
            closed: 'bg-gray-100 text-gray-600'
        };

        const statusLabels = {
            new: 'Mới',
            contacted: 'Đã liên hệ',
            qualified: 'Đủ điều kiện',
            converted: 'Đã chuyển đổi',
            closed: 'Đã đóng'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Liên hệ khách hàng</h2>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xuất Excel
                </button>
            </div>

            {/* Search and Filter */}
            <div className="mb-4 flex gap-4 bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex-1">
                    <input
                        type="search"
                        placeholder="Tìm kiếm theo tên, email, công ty, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-[180px]"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="new">Mới</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="qualified">Đủ điều kiện</option>
                    <option value="converted">Đã chuyển đổi</option>
                    <option value="closed">Đã đóng</option>
                </select>
            </div>

            <div className="mb-2 text-sm text-gray-500">
                Hiển thị {filteredContacts.length} / {contacts.length} liên hệ
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Ngày gửi</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Khách hàng</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Liên lạc</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Dịch vụ</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Trạng thái</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Ghi chú</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredContacts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'Không tìm thấy liên hệ phù hợp.'
                                        : 'Chưa có liên hệ nào.'}
                                </td>
                            </tr>
                        ) : filteredContacts.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-500">
                                    {c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : '-'}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{c.name}</div>
                                    {c.company && <div className="text-xs text-gray-500">{c.company}</div>}
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="text-gray-800">{c.email}</div>
                                    {c.phone && <div className="text-gray-500">{c.phone}</div>}
                                </td>
                                <td className="p-4 text-sm">
                                    <span className="font-medium text-blue-600 bg-blue-50 rounded-full px-3 py-1 inline-block">
                                        {c.service || 'Chưa xác định'}
                                    </span>
                                </td>
                                <td className="p-4">{getStatusBadge(c.status)}</td>
                                <td className="p-4 text-sm italic text-gray-600 max-w-xs truncate" title={c.note}>
                                    {c.note || '-'}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleDeleteClick(c)}
                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                        title="Xóa liên hệ"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirm Dialog */}
            {deleteConfirm.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-red-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
                                <p className="text-gray-600 mb-6">
                                    Bạn có chắc muốn xóa liên hệ từ <strong>{deleteConfirm.contact?.name}</strong> ({deleteConfirm.contact?.email})?
                                    Hành động này không thể hoàn tác.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setDeleteConfirm({ isOpen: false, contact: null })}
                                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactManager;
