import React, { useEffect, useState } from 'react';
import Button from './Button';
import { api } from '../services/api';

interface ToolsSectionProps {
  onStartAssessment?: () => void;
  onAskAI?: (question: string) => void;
  onDownloadToolkit?: () => void;
}

// --- MODERN SVG ASSETS ---

// 1. CIC LOGO - Tech & Trust
export const CICLogo: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 140 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15 L10 30 L20 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700" />
    <path d="M120 15 L130 30 L120 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700" />
    <text x="70" y="42" textAnchor="middle" fill="currentColor" fontSize="32" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="-1" className="text-blue-900">CIC</text>
    <circle cx="108" cy="18" r="4" fill="#FF6B00" className="animate-pulse" />
    <rect x="35" y="52" width="70" height="3" rx="1.5" className="fill-gray-200" />
    <rect x="35" y="52" width="20" height="3" rx="1.5" fill="#FF6B00">
      <animate attributeName="x" values="35;85;35" dur="4s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 2. AI AVATAR - Futuristic & Friendly
export const RobotAvatar: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <g className="animate-float">
      {/* Background Glow */}
      <circle cx="100" cy="100" r="60" fill="url(#aiGradient)" opacity="0.2" filter="url(#glow)" />

      {/* Main Sphere */}
      <circle cx="100" cy="100" r="45" fill="white" className="drop-shadow-lg" />

      {/* Face/Screen */}
      <rect x="75" y="85" width="50" height="30" rx="15" fill="#1E293B" />

      {/* Eyes */}
      <circle cx="90" cy="100" r="4" fill="#60A5FA" className="animate-blink">
        <animate attributeName="opacity" values="1;0;1" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="100" r="4" fill="#60A5FA" className="animate-blink">
        <animate attributeName="opacity" values="1;0;1" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Orbiting Elements */}
      <circle cx="100" cy="100" r="70" stroke="url(#aiGradient)" strokeWidth="1.5" strokeDasharray="10 15" className="animate-spin-slow" opacity="0.6" />
    </g>
  </svg>
);

const ToolsSection: React.FC<ToolsSectionProps> = ({ onStartAssessment, onAskAI, onDownloadToolkit }) => {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    api.getTools().then(data => setTools(data));
  }, []);

  const handleAsk = () => {
    if (onAskAI) {
      onAskAI("Tôi muốn tìm hiểu về pháp lý dự án.");
    }
  };

  return (
    <div className="py-24 bg-gradient-to-b from-slate-50 to-white scroll-mt-20" id="tools">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-50 border border-blue-100">
            <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Công nghệ tiên phong</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Bộ công cụ chuyên sâu
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Hệ sinh thái công cụ số giúp tối ưu hóa toàn diện quy trình pháp lý, kỹ thuật và quản lý dự án BIM của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* AI Legal Assistant Card - Main Feature (Span 12 on mobile, 7 on LG) */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden group hover:border-blue-200 transition-all duration-500">

            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 h-full">
              <div className="flex-1 text-center md:text-left">
                <div className="mb-6 inline-block">
                  <div className="flex items-center space-x-2 bg-blue-50/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-blue-100">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-bold text-blue-700">AI ASSISTANT v2.0</span>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                  Trợ lý Pháp lý AI
                </h3>
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                  Nhận tư vấn pháp lý dự án được cá nhân hóa chỉ trong <span className="font-bold text-blue-600">30 giây</span>. Phân tích rủi ro và đề xuất lộ trình tối ưu bằng trí tuệ nhân tạo.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-semibold px-8"
                    onClick={handleAsk}
                  >
                    <span className="mr-2">✨</span> Trải nghiệm ngay
                  </Button>
                  <button className="px-6 py-3 rounded-full text-slate-600 font-medium hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                    Xem demo
                  </button>
                </div>
              </div>

              {/* Character Illustration */}
              <div className="w-56 h-56 md:w-64 md:h-64 flex-shrink-0 relative">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-2xl transform scale-110"></div>
                <RobotAvatar />
              </div>
            </div>
          </div>

          {/* Right Column Grid (Span 12 on mobile, 5 on LG) */}
          <div className="lg:col-span-5 flex flex-col gap-8">

            {/* Maturity Assessment Card */}
            <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div className="bg-indigo-50 px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-indigo-600">+150 Doanh nghiệp</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">Đánh giá năng lực BIM</h3>
              <p className="text-slate-500 text-sm mb-6">Đo lường mức độ trưởng thành số của doanh nghiệp bạn so với thị trường.</p>

              {/* Progress Visual */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Điểm trung bình</span>
                  <span className="text-2xl font-bold text-indigo-600">3.5<span className="text-sm text-slate-400">/5</span></span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full w-[70%]"></div>
                </div>
              </div>

              <Button variant="outline" className="w-full justify-center rounded-xl border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 group-hover:bg-indigo-50" onClick={onStartAssessment}>
                Bắt đầu đánh giá <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </div>

            {/* Toolkit Card */}
            <div className="flex-1 bg-gradient-to-br from-orange-50 to-white rounded-[2rem] p-8 shadow-xl shadow-orange-100/50 border border-orange-100 hover:shadow-2xl hover:shadow-orange-100/60 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-50 transition-opacity"></div>

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-white text-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors relative z-10">Toolkit Chuyển đổi số</h3>
              <p className="text-slate-500 text-sm mb-6 relative z-10">Thư viện biểu mẫu, quy trình mẫu BEP, CDE Guidelines chuẩn quốc tế.</p>

              <Button
                variant="primary"
                className="w-full justify-center rounded-xl bg-orange-500 hover:bg-orange-600 border-none shadow-lg shadow-orange-200 relative z-10"
                onClick={onDownloadToolkit}
              >
                Tải ngay miễn phí
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Inline Styles for Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blink {
          transform-origin: center;
          animation: blink 4s infinite;
        }
        .animate-spin-slow {
            transform-origin: center;
            animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ToolsSection;