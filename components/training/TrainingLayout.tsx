// Training Layout with Sidebar Navigation
// Styled to match main website theme (navy blue)

import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface TrainingLayoutProps {
    children: ReactNode;
    activeSection?: 'courses' | 'my-courses' | 'certificates';
}

const TrainingLayout: React.FC<TrainingLayoutProps> = ({ children, activeSection = 'courses' }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            id: 'courses',
            label: 'Khóa học',
            icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
            path: '/dao-tao'
        },
        {
            id: 'my-courses',
            label: 'Khóa học của tôi',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            path: '/dao-tao/cua-toi'
        },
        {
            id: 'certificates',
            label: 'Chứng chỉ',
            icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
            path: '/dao-tao/chung-chi'
        }
    ];

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Navy Blue Theme */}
            <aside className="w-64 bg-[#1a237e] text-white flex-shrink-0 shadow-xl">
                <div className="p-6 border-b border-blue-800">
                    <button
                        onClick={handleBackToHome}
                        className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors group mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-sm font-medium">Quay lại Trang chủ</span>
                    </button>
                    <h2 className="text-xl font-bold text-white">Đào tạo BIM</h2>
                    <p className="text-sm text-blue-200 mt-1">Nâng cao năng lực chuyên môn</p>
                </div>

                <nav className="p-4">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === item.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                    }`}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                <span className="font-medium text-sm">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Support Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
                    <div className="bg-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-xs font-semibold text-white mb-1">Cần hỗ trợ?</p>
                                <p className="text-xs text-blue-200 mb-2">Liên hệ bộ phận đào tạo</p>
                                <a href="tel:+84123456789" className="text-xs text-blue-300 hover:text-white underline">
                                    📞 0123 456 789
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default TrainingLayout;
