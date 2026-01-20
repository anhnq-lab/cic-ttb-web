
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trainingService, TrainingCourse } from '../../services/trainingService';
import { Helmet } from 'react-helmet-async';

const TrainingList: React.FC = () => {
    const [courses, setCourses] = useState<TrainingCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'basic' | 'advanced' | 'expert'>('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await trainingService.getCourses();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Filter courses by level
    const filteredCourses = courses.filter(course => {
        if (activeFilter === 'all') return true;
        const levelMap: Record<string, string[]> = {
            'basic': ['cơ bản', 'basic', 'co ban'],
            'advanced': ['nâng cao', 'advanced', 'nang cao'],
            'expert': ['chuyên gia', 'expert', 'chuyen gia', 'trung cấp']
        };
        return levelMap[activeFilter]?.some(l => course.level?.toLowerCase().includes(l));
    });

    const filterButtons = [
        { id: 'all', label: 'Tất cả', count: courses.length },
        { id: 'basic', label: 'Cơ bản', count: courses.filter(c => c.level?.toLowerCase().includes('cơ bản')).length },
        { id: 'advanced', label: 'Nâng cao', count: courses.filter(c => c.level?.toLowerCase().includes('nâng cao')).length },
        { id: 'expert', label: 'Chuyên gia', count: courses.filter(c => c.level?.toLowerCase().includes('chuyên gia') || c.level?.toLowerCase().includes('trung cấp')).length },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Đào tạo BIM chuyên nghiệp | Khóa học chuẩn ISO 19650 | CIC</title>
                <meta name="description" content="Các khóa đào tạo BIM từ cơ bản đến nâng cao, chuẩn ISO 19650. Giảng viên dày dặn kinh nghiệm, chứng chỉ được công nhận. Đăng ký ngay!" />
                <meta name="keywords" content="đào tạo BIM, khóa học BIM, chứng chỉ BIM, ISO 19650, Revit, Navisworks, CDE" />
                <meta property="og:title" content="Đào tạo BIM chuyên nghiệp | CIC" />
                <meta property="og:description" content="Nâng cao năng lực đội ngũ với các khóa học BIM chuyên sâu từ chuyên gia hàng đầu." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://cic-ttb-web.vercel.app/dao-tao" />
            </Helmet>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center text-sm">
                        <Link to="/" className="text-gray-500 hover:text-[#1a237e] transition-colors">
                            Trang chủ
                        </Link>
                        <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#1a237e] font-semibold">Đào tạo BIM</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
                        🎓 Chuẩn ISO 19650
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Đào tạo BIM <span className="text-yellow-300">Chuyên nghiệp</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                        Nâng cao năng lực đội ngũ với các khóa học BIM chuyên sâu, thực chiến từ các chuyên gia hàng đầu của CIC.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 md:gap-16 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-300">500+</div>
                            <div className="text-sm text-blue-200">Học viên</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-300">4.8★</div>
                            <div className="text-sm text-blue-200">Đánh giá</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-300">{courses.length}</div>
                            <div className="text-sm text-blue-200">Khóa học</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white shadow-sm sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {filterButtons.map(btn => (
                            <button
                                key={btn.id}
                                onClick={() => setActiveFilter(btn.id as typeof activeFilter)}
                                className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${activeFilter === btn.id
                                    ? 'bg-[#1a237e] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {btn.label} {btn.count > 0 && <span className="opacity-70">({btn.count})</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white rounded-xl h-96 shadow"></div>
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">Không tìm thấy khóa học phù hợp</p>
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="mt-4 text-[#1a237e] font-medium hover:underline"
                        >
                            Xem tất cả khóa học
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <article key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={course.image_url}
                                        alt={`Khóa học ${course.title}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-4 right-4 bg-[#1a237e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                                        {course.level}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px] group-hover:text-[#1a237e] transition-colors">
                                        <Link to={`/dao-tao/${course.slug}`}>
                                            {course.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-[#1a237e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {course.duration}
                                        </div>
                                        <div className="flex items-center font-semibold text-green-600">
                                            {formatPrice(course.price)}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/dao-tao/${course.slug}`}
                                        className="block w-full text-center bg-[#1a237e] hover:bg-[#0d1554] text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                                    >
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Testimonials Section */}
            <div className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cảm nhận từ Học viên</h2>
                        <div className="w-20 h-1.5 bg-yellow-400 mx-auto rounded-full"></div>
                        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                            Hơn 500+ học viên đã tham gia và thay đổi tư duy làm việc với BIM sau các khóa đào tạo tại CIC.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Nguyễn Văn Hùng",
                                role: "BIM Manager - Vinaconex",
                                comment: "Khóa học BIM Coordinator rất thực tế. Giảng viên trình bày dễ hiểu, giúp chúng tôi áp dụng được ngay vào dự án thực tế của công ty.",
                                stars: 5
                            },
                            {
                                name: "Trần Thị Lan",
                                role: "Kiến trúc sư - Archetype Group",
                                comment: "Lộ trình đào tạo chuẩn ISO 19650 giúp tôi hệ thống hóa lại toàn bộ kiến thức. Tài liệu hướng dẫn rất chi tiết và đầy đủ.",
                                stars: 5
                            },
                            {
                                name: "Lê Minh Đức",
                                role: "Digital Engineer - Coteccons",
                                comment: "CIC Tools giúp tiết kiệm 50% thời gian triển khai. Rất cảm ơn đội ngũ CIC đã hỗ trợ nhiệt tình trong suốt khóa học.",
                                stars: 5
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all">
                                <div className="text-yellow-400 flex mb-4">
                                    {[...Array(t.stars)].map((_, s) => (
                                        <svg key={s} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 italic mb-6">"{t.comment}"</p>
                                <div>
                                    <div className="font-bold text-gray-900">{t.name}</div>
                                    <div className="text-sm text-[#1a237e] font-medium">{t.role}</div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <svg className="w-24 h-24 text-[#1a237e]" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.5693 13 5.01697 13H4.01697V21H6.017Z" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Chưa biết bắt đầu từ đâu?</h2>
                    <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                        Đội ngũ tư vấn của CIC sẵn sàng hỗ trợ bạn lựa chọn lộ trình đào tạo phù hợp nhất.
                    </p>
                    <a
                        href="#contact"
                        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-[#1a237e] font-bold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        📞 Nhận tư vấn miễn phí
                    </a>
                </div>
            </div>

            {/* Sticky CTA Button */}
            <a
                href="tel:+84123456789"
                className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 z-50 transition-all hover:scale-105"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden md:inline">Gọi ngay</span>
            </a>
        </div>
    );
};

export default TrainingList;
