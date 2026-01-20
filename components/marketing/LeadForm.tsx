
import React, { useState } from 'react';
import { trainingService, Lead } from '../../services/trainingService';

interface LeadFormProps {
    courseId?: string;
    courseTitle?: string;
    onSuccess?: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ courseId, courseTitle, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<Lead>>({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        message: '',
        course_id: courseId
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await trainingService.submitLead({
                ...formData,
                status: 'new',
                course_id: courseId // Ensure courseId is passed if available
            });
            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Đăng ký thành công!</h3>
                <p className="text-green-700">Cảm ơn bạn đã quan tâm. CIC sẽ liên hệ lại với bạn trong thời gian sớm nhất để tư vấn về khóa học {courseTitle}.</p>
                <button onClick={() => setSuccess(false)} className="mt-4 text-green-600 font-medium hover:underline">Gửi đăng ký khác</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {courseTitle ? `Đăng ký tư vấn: ${courseTitle}` : 'Đăng ký tư vấn khóa học'}
            </h3>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
                        <input
                            type="text"
                            name="company"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                        <input
                            type="text"
                            name="position"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.position}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lời nhắn / Câu hỏi</label>
                    <textarea
                        name="message"
                        rows={3}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Bạn cần tư vấn thêm thông tin gì?"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : 'Gửi đăng ký'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                    CIC cam kết bảo mật thông tin cá nhân của bạn.
                </p>
            </div>
        </form>
    );
};

export default LeadForm;
