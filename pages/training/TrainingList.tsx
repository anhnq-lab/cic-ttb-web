
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

            {/* Breadcrumbs - Styled like Home menu */}
            <div className="bg-brand-lightBlue/30 border-b border-brand-blue/10">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center text-sm">
                        <Link to="/" className="text-gray-500 hover:text-brand-blue transition-colors">
                            Trang chủ
                        </Link>
                        <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-brand-blue font-semibold">Đào tạo BIM</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section - Matching Home Page Style */}
            <div className="relative bg-brand-darkBlue py-20 overflow-hidden">
                {/* Background Overlay with Gradient */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://picsum.photos/seed/training/1920/1080"
                        alt="BIM Training Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-darkBlue/90 via-brand-darkBlue/80 to-brand-blue/90"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm animate-fade-in-up">
                        <span className="text-blue-200 font-bold uppercase tracking-wider text-xs md:text-sm flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                            Chương trình Đào tạo BIM chuẩn Quốc tế
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Đào tạo BIM <span className="text-brand-orange">Chuyên nghiệp</span> <br className="hidden md:block" />
                        cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">CIC Platform</span>
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Nâng cao năng lực đội ngũ với các khóa học BIM chuyên sâu,
                        thực chiến từ các chuyên gia hàng đầu của CIC.
                    </p>

                    {/* Stats - Premium Look */}
                    <div className="flex justify-center gap-8 md:gap-16 mt-8">
                        <div className="text-center group">
                            <div className="text-3xl md:text-4xl font-bold text-brand-orange group-hover:scale-110 transition-transform duration-300">500+</div>
                            <div className="text-sm text-blue-200 uppercase tracking-widest font-medium mt-1">Học viên</div>
                        </div>
                        <div className="text-center group">
                            <div className="text-3xl md:text-4xl font-bold text-brand-orange group-hover:scale-110 transition-transform duration-300">4.8★</div>
                            <div className="text-sm text-blue-200 uppercase tracking-widest font-medium mt-1">Đánh giá</div>
                        </div>
                        <div className="text-center group">
                            <div className="text-3xl md:text-4xl font-bold text-brand-orange group-hover:scale-110 transition-transform duration-300">{courses.length}</div>
                            <div className="text-sm text-blue-200 uppercase tracking-widest font-medium mt-1">Khóa học</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar - Sticky Premium */}
            <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-[80px] z-30 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {filterButtons.map(btn => (
                            <button
                                key={btn.id}
                                onClick={() => setActiveFilter(btn.id as typeof activeFilter)}
                                className={`px-5 py-2 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${activeFilter === btn.id
                                        ? 'bg-brand-blue text-white shadow-lg shadow-blue-900/20'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {btn.label} {btn.count > 0 && <span className="opacity-60 ml-1">[{btn.count}]</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white rounded-2xl h-[450px] shadow-sm border border-gray-100"></div>
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        <p className="text-xl font-light">Không tìm thấy khóa học phù hợp</p>
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="mt-4 text-brand-blue font-bold hover:underline uppercase text-sm tracking-widest"
                        >
                            Xem tất cả khóa học
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCourses.map(course => (
                            <article key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group">
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={course.image_url}
                                        alt={`Khóa học ${course.title}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-4 right-4 bg-brand-darkBlue/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">
                                        {course.level}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-brand-darkBlue mb-3 line-clamp-2 min-h-[56px] group-hover:text-brand-blue transition-colors leading-tight">
                                        <Link to={`/dao-tao/${course.slug}`}>
                                            {course.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-500 mb-6 line-clamp-3 text-sm flex-1 font-light leading-relaxed">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm mb-6 pt-6 border-t border-gray-50">
                                        <div className="flex items-center text-gray-400">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium tracking-tight text-gray-500">{course.duration}</span>
                                        </div>
                                        <div className="font-extrabold text-brand-blue text-lg">
                                            {formatPrice(course.price)}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/dao-tao/${course.slug}`}
                                        className="block w-full text-center bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 uppercase text-xs tracking-[0.2em]"
                                    >
                                        Khám phá ngay
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Testimonials Section */}
            <div className="bg-brand-lightBlue/30 py-24 border-y border-brand-blue/5">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em]">
                        Social Proof
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-brand-darkBlue mb-4">Cảm nhận từ Học viên</h2>
                    <div className="w-16 h-1 bg-brand-orange mx-auto rounded-full mb-16"></div>

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
                            <div key={i} className="bg-white p-10 rounded-3xl border border-brand-blue/5 shadow-sm hover:shadow-xl transition-all text-left group">
                                <div className="text-brand-orange flex gap-1 mb-6">
                                    {[...Array(t.stars)].map((_, s) => (
                                        <svg key={s} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 font-light italic mb-8 leading-relaxed text-lg">"{t.comment}"</p>
                                <div>
                                    <div className="font-bold text-brand-darkBlue text-lg">{t.name}</div>
                                    <div className="text-xs text-brand-blue font-bold uppercase tracking-wider mt-1">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section - Matching Home Look */}
            <div className="relative py-24 overflow-hidden bg-brand-darkBlue">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-darkBlue via-brand-blue/50 to-brand-darkBlue"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Chinh phục lộ trình <span className="text-brand-orange">Sự nghiệp BIM</span> <br className="hidden md:block" />
                        cùng đội ngũ chuyên gia hàng đầu
                    </h2>
                    <p className="text-gray-300 mb-12 max-w-2xl mx-auto font-light text-lg leading-relaxed">
                        Đội ngũ tư vấn của CIC sẵn sàng hỗ trợ bạn phát triển năng lực
                        và làm chủ công nghệ Digital Twin tương lai.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <a
                            href="#contact"
                            className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase tracking-widest text-sm"
                        >
                            Đăng ký Tư vấn ngay
                        </a>
                        <a
                            href="tel:+84123456789"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-10 py-5 rounded-2xl transition-all backdrop-blur-md uppercase tracking-widest text-sm"
                        >
                            Hotline: 0123 456 789
                        </a>
                    </div>
                </div>
            </div>

            {/* Sticky CTA - Matching Brand Green or Orange */}
            <a
                href="tel:+84123456789"
                className="fixed bottom-8 right-8 bg-[#25d366] hover:bg-[#1ebea5] text-white font-bold p-5 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95 group"
            >
                <svg className="w-8 h-8 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                <span className="absolute right-full mr-4 bg-white text-brand-darkBlue whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Hỗ trợ qua Zalo ngay!</span>
            </a>
        </div>
    );
};

export default TrainingList;
