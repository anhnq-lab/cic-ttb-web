import React from 'react';

interface ContactManagerProps {
    contacts: any[];
    onDelete: (id: number) => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({ contacts, onDelete }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Liên hệ khách hàng</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Ngày gửi</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Khách hàng</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Liên lạc</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Dịch vụ</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Ghi chú</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {contacts.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Chưa có liên hệ nào.</td></tr>
                        ) : contacts.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-500">{new Date(c.created_at).toLocaleString()}</td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{c.name}</div>
                                    <div className="text-xs text-gray-500">{c.company}</div>
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="text-gray-800">{c.email}</div>
                                    <div className="text-gray-500">{c.phone}</div>
                                </td>
                                <td className="p-4 text-sm font-medium text-blue-600 bg-blue-50 rounded-full px-2 py-1 inline-block mt-2">{c.service}</td>
                                <td className="p-4 text-sm italic text-gray-600 max-w-xs">{c.note}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => onDelete(c.id)}
                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
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
    );
};

export default ContactManager;
