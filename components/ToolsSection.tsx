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
    <div className="py-16 bg-gradient-to-b from-slate-50 to-white scroll-mt-20" id="tools">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header Section - Compact */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-3 rounded-full bg-blue-50 border border-blue-100">
            <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">Công nghệ tiên phong</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Bộ công cụ chuyên sâu
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hệ sinh thái công cụ số tối ưu hóa quy trình BIM & Pháp lý xây dựng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* AI Legal Assistant Card - Compact & Value Packed */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden group hover:border-blue-200 transition-all duration-500 flex flex-col justify-center">

            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 h-full">
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4 flex items-center justify-center md:justify-start gap-3">
                  <div className="flex items-center space-x-2 bg-blue-50/80 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-blue-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700">AI ASSISTANT v2.0</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Tin dùng bởi 500+ kỹ sư
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                  Trợ lý Pháp lý AI
                </h3>
                <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                  Tư vấn pháp lý dự án, phân tích rủi ro hợp đồng và đề xuất lộ trình tối ưu chỉ trong <span className="font-bold text-blue-600">30 giây</span>.
                </p>

                {/* SEO/Benefit Bullets */}
                <ul className="mb-6 space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                  {[
                    "Tra cứu văn bản pháp luật xây dựng 24/7",
                    "Phân tích rủi ro hợp đồng tự động",
                    "Tiết kiệm 90% chi phí pháp chế thuê ngoài"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs font-medium text-slate-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button
                    variant="primary"
                    size="md"
                    className="rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-semibold px-6 text-sm"
                    onClick={handleAsk}
                  >
                    <span className="mr-2">✨</span> Trải nghiệm ngay
                  </Button>
                </div>
              </div>

              {/* Character Illustration - Smaller */}
              <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 relative">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-2xl transform scale-105"></div>
                <RobotAvatar />
              </div>
            </div>
          </div>

          {/* Right Column Grid - Compact */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Maturity Assessment Card */}
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Đánh giá năng lực BIM</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Theo tiêu chuẩn ISO 19650</p>
                    </div>
                  </div>
                </div>

                {/* Progress Visual - Compact */}
                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Điểm trung bình ngành</span>
                    <span className="text-xl font-bold text-indigo-600">3.5<span className="text-xs text-slate-400">/5</span></span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full w-[70%]"></div>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full justify-center rounded-lg border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 group-hover:bg-indigo-50 text-xs font-semibold py-2.5" onClick={onStartAssessment}>
                Bắt đầu đánh giá <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </div>

            {/* Toolkit Card */}
            <div className="flex-1 bg-gradient-to-br from-orange-50 to-white rounded-3xl p-6 shadow-xl shadow-orange-100/50 border border-orange-100 hover:shadow-2xl hover:shadow-orange-100/60 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-50 transition-opacity"></div>

              <div>
                <div className="flex items-start mb-4 relative z-10">
                  <div className="w-10 h-10 bg-white text-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-100 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors relative z-10">Toolkit Chuyển đổi số</h3>
                    <div className="flex gap-2 mt-1 flex-wrap relative z-10">
                      {["BEP Template", "CDE Guide", "Checklists"].map((tag, i) => (
                        <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-orange-100 text-orange-800 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mb-4 relative z-10 line-clamp-2">Thư viện biểu mẫu và quy trình chuẩn giúp doanh nghiệp áp dụng BIM ngay hôm nay.</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center rounded-lg bg-orange-500 hover:bg-orange-600 border-none shadow-lg shadow-orange-200 relative z-10 text-xs font-semibold py-2.5"
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
          50% { transform: translateY(-6px); }
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