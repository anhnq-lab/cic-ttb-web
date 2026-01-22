import React from 'react';

interface AnalyticsManagerProps {
    stats: any;
    insight: string;
    loadingInsight: boolean;
    onGetInsight: () => void;
}

const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ stats, insight, loadingInsight, onGetInsight }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Thống kê & Phân tích Dữ liệu (AI Powered)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S5.26 14.12.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="z-10">
                        <div className="text-sm font-medium text-gray-500 mb-1">Tổng lượt truy cập</div>
                        <div className="text-3xl font-extrabold text-gray-800">{stats?.views?.toLocaleString() || 0}</div>
                    </div>
                    <div className="z-10 flex items-center text-xs text-green-600 font-medium">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        +12% tuần này
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                    </div>
                    <div className="z-10">
                        <div className="text-sm font-medium text-gray-500 mb-1">Liên hệ mới</div>
                        <div className="text-3xl font-extrabold text-gray-800">{stats?.contacts || 0}</div>
                    </div>
                    <div className="z-10 text-xs text-gray-400">
                        Cần xử lý ngay
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="z-10">
                        <div className="text-sm font-medium text-gray-500 mb-1">Bài viết & Tin tức</div>
                        <div className="text-3xl font-extrabold text-gray-800">{stats?.news || 0}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                    </div>
                    <div className="z-10">
                        <div className="text-sm font-medium text-gray-500 mb-1">Thư viện tài liệu</div>
                        <div className="text-3xl font-extrabold text-gray-800">{stats?.library || 0}</div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-blue-100 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-indigo-900 flex items-center">
                            <span className="bg-white p-2 rounded-lg shadow-sm mr-3">
                                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                            </span>
                            AI Business Insight
                        </h3>
                        <button
                            onClick={onGetInsight}
                            disabled={loadingInsight}
                            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${loadingInsight ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200'}`}
                        >
                            {loadingInsight ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Đang phân tích...
                                </span>
                            ) : 'Phân tích & Báo cáo ngay'}
                        </button>
                    </div>

                    <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-sm min-h-[120px]">
                        {insight ? (
                            <div className="prose prose-indigo text-gray-800 leading-relaxed">
                                {insight}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-4">
                                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                <p>Nhấn nút phân tích để AI tổng hợp dữ liệu và đưa ra lời khuyên.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decoration */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30"></div>
            </div>
        </div>
    );
};

export default AnalyticsManager;
