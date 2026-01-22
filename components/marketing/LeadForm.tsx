
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
                course_id: courseId
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
            <div className="bg-white p-10 rounded-[2.5rem] text-center border border-green-100 shadow-2xl animate-fade-in">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-black text-brand-darkBlue mb-4">Gửi yêu cầu thành công!</h3>
                <p className="text-gray-500 leading-relaxed font-light">
                    Cảm ơn bạn đã quan tâm. Đội ngũ tư vấn của <span className="text-brand-blue font-bold">CIC</span> sẽ liên hệ lại với bạn qua số điện thoại <span className="font-bold text-brand-darkBlue">{formData.phone}</span> để hỗ trợ chi tiết về khóa học <span className="font-bold text-brand-darkBlue">{courseTitle}</span>.
                </p>
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <button
                        onClick={() => setSuccess(false)}
                        className="text-brand-blue font-black uppercase text-xs tracking-widest hover:underline transition-all"
                    >
                        Gửi yêu cầu khác
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 relative overflow-hidden group">
            {/* Design element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16 group-hover:bg-brand-orange/10 transition-all duration-700"></div>

            <h3 className="text-2xl font-black text-brand-darkBlue mb-8 tracking-tight relative z-10">
                {courseTitle ? (
                    <>Tư vấn: <span className="text-brand-blue block">{courseTitle}</span></>
                ) : 'Đăng ký Tư vấn ngay'}
            </h3>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center border border-red-100 animate-shake">
                    <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            <div className="space-y-5 relative z-10">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Họ và tên</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-brand-darkBlue placeholder:text-gray-300"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email cá nhân</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="email@company.com"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-brand-darkBlue placeholder:text-gray-300"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="091 xxx xxxx"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-brand-darkBlue placeholder:text-gray-300"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tên Công ty</label>
                        <input
                            type="text"
                            name="company"
                            placeholder="CIC Technology..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-brand-darkBlue placeholder:text-gray-300"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vị trí công tác</label>
                        <input
                            type="text"
                            name="position"
                            placeholder="BIM Manager..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-brand-darkBlue placeholder:text-gray-300"
                            value={formData.position}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Bạn cần hỗ trợ gì?</label>
                    <textarea
                        name="message"
                        rows={3}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-brand-darkBlue placeholder:text-gray-300 resize-none"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Ví dụ: Tôi muốn nhận báo giá cho nhóm 5 người..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center uppercase text-sm tracking-[0.2em]"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <>
                            <span>Gửi Đăng ký ngay</span>
                            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                        </>
                    )}
                </button>

                <p className="text-[10px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest">
                    🔒 Thông tin của bạn được CIC bảo mật tuyệt đối
                </p>
            </div>
        </form>
    );
};

export default LeadForm;
