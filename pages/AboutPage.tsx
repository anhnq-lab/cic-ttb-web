
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Về chúng tôi | CIC - Tiên phong Công nghệ & Digital Twin</title>
                <meta name="description" content="CIC với 35 năm kinh nghiệm, định hướng trở thành Tech Leader về AI, Digital Twin và Green BIM tại Việt Nam. Đối tác tin cậy của Bộ Xây dựng và VC Group." />
                <meta name="keywords" content="CIC, về chúng tôi, digital twin, ai xây dựng, green bim, iso 19650, phần mềm xây dựng" />
                <meta property="og:title" content="Về CIC - Tiên phong Kiến tạo Tương lai Số" />
                <meta property="og:description" content="Hành trình 35 năm từ Trung tâm Tin học - Bộ Xây dựng đến Doanh nghiệp Công nghệ hàng đầu." />
                <link rel="canonical" href="https://cic-bim-hub.vn/ve-chung-toi" />
            </Helmet>

            {/* Hero Section */}
            <div className="relative bg-brand-darkBlue py-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-darkBlue via-brand-blue/90 to-brand-darkBlue"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-blue-200 text-sm font-semibold mb-6 backdrop-blur-sm">
                        Since 1990 • 35 Năm Kinh Nghiệm
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Kiến tạo <span className="text-brand-orange">Tương lai Số</span> <br />
                        ngành Xây dựng Việt Nam
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Từ nền tảng Trung tâm Tin học - Bộ Xây dựng đến vị thế tiên phong trong kỷ nguyên
                        <strong className="text-white font-semibold"> AI & Digital Twin</strong>.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="container mx-auto px-4 py-16 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-brand-blue mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-brand-darkBlue mb-3">Sứ mệnh</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Cung cấp các giải pháp công nghệ toàn diện, giúp doanh nghiệp xây dựng Việt Nam tối ưu hóa quy trình, nâng cao năng suất và tiệm cận chuẩn quốc tế.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-brand-orange mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-brand-darkBlue mb-3">Tầm nhìn 2030</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Trở thành doanh nghiệp công nghệ quy mô lớn, dẫn đầu về tư vấn <strong>BIM, AI và Smart City</strong> tại Việt Nam và khu vực ASEAN.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-brand-darkBlue mb-3">Giá trị cốt lõi</h3>
                        <p className="text-gray-600 leading-relaxed">
                            <strong>Tin cậy - Đổi mới - Bền vững.</strong> Chúng tôi cam kết đồng hành cùng sự phát triển Xanh (Green BIM) và minh bạch của ngành.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
                    <div className="md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Văn phòng CIC" className="w-full" />
                            <div className="absolute inset-0 bg-brand-blue/20"></div>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-brand-darkBlue mb-6">Lịch sử & Di sản</h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                            <p>
                                Tiền thân là <strong>Trung tâm Tin học - Bộ Xây dựng</strong>, CIC tự hào là đơn vị đặt nền móng cho việc ứng dụng công nghệ thông tin vào ngành xây dựng Việt Nam từ những năm 90.
                            </p>
                            <p>
                                Trải qua hơn 3 thập kỷ, CIC đã phát triển hàng loạt phần mềm "Made in Vietnam" nổi tiếng như <strong>Escon, RDW, KPW</strong>... đồng thời là đối tác chiến lược của các ông lớn công nghệ thế giới như Autodesk, Bentley Systems, Trimble.
                            </p>
                            <p>
                                Hiện nay, CIC là thành viên nòng cốt của <strong>Tổng Công ty Tư vấn Xây dựng Việt Nam (VC Group)</strong>, tiếp tục sứ mệnh dẫn dắt chuyển đổi số quốc gia.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                            {/* Placeholder for AI/Tech image */}
                            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" alt="Công nghệ AI & Digital Twin" className="w-full opacity-80" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
                                    <div className="font-bold text-lg mb-1">Trung tâm Digital Twin</div>
                                    <div className="text-sm opacity-80">Nghiên cứu & Ứng dụng AI mới nhất 2026</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-brand-darkBlue mb-6">Chiến lược 2026: AI & Digital Twin</h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                            <p>
                                Không dừng lại ở BIM truyền thống, CIC đang tiên phong nghiên cứu ứng dụng <strong>Trí tuệ nhân tạo (AI)</strong> trong thiết kế tạo hình và quản lý rủi ro dự án.
                            </p>
                            <p>
                                Giải pháp <strong>Digital Twin (Bản sao số)</strong> của chúng tôi giúp các chủ đầu tư quản lý vận hành tòa nhà, khu công nghiệp và đô thị thông minh một cách trực quan, thời gian thực và tiết kiệm năng lượng.
                            </p>
                            <ul className="grid grid-cols-2 gap-4 mt-6">
                                <li className="flex items-center text-brand-blue font-medium">
                                    <span className="w-2 h-2 bg-brand-orange rounded-full mr-2"></span> Green BIM
                                </li>
                                <li className="flex items-center text-brand-blue font-medium">
                                    <span className="w-2 h-2 bg-brand-orange rounded-full mr-2"></span> Smart City
                                </li>
                                <li className="flex items-center text-brand-blue font-medium">
                                    <span className="w-2 h-2 bg-brand-orange rounded-full mr-2"></span> AI Generative Design
                                </li>
                                <li className="flex items-center text-brand-blue font-medium">
                                    <span className="w-2 h-2 bg-brand-orange rounded-full mr-2"></span> CDE Platform
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-brand-darkBlue mb-4">Bạn muốn hợp tác cùng CIC?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng đồng hành cùng doanh nghiệp bạn trên hành trình chuyển đổi số.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/lien-he" className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                            Liên hệ Hợp tác
                        </Link>
                        <Link to="/dao-tao" className="bg-white hover:bg-gray-50 text-brand-blue border border-brand-blue font-bold py-3 px-8 rounded-xl transition-all">
                            Xem Khóa học BIM
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
