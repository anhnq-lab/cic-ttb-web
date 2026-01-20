
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trainingService, TrainingCourse } from '../../services/trainingService';
import LeadForm from '../../components/marketing/LeadForm';
import { Helmet } from 'react-helmet-async';

const TrainingDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<TrainingCourse | null>(null);
    const [relatedCourses, setRelatedCourses] = useState<TrainingCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                const data = await trainingService.getCourseBySlug(slug);
                setCourse(data);

                // Fetch related courses (same level or all)
                const allCourses = await trainingService.getCourses();
                const related = allCourses
                    .filter(c => c.slug !== slug)
                    .slice(0, 3);
                setRelatedCourses(related);
            } catch (error) {
                console.error('Failed to fetch course', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Schema.org Course structured data
    const schemaData = course ? {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "CIC - Công nghệ và Tư vấn CIC",
            "url": "https://cic-ttb-web.vercel.app"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "onsite",
            "duration": course.duration,
            "inLanguage": "vi"
        },
        "offers": {
            "@type": "Offer",
            "price": course.price,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock"
        },
        "image": course.image_url,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150"
        }
    } : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-blue mb-4"></div>
                    <p className="text-brand-blue font-bold animate-pulse text-sm uppercase tracking-widest">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 px-4">
                <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                    <svg className="w-24 h-24 mx-auto text-gray-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="text-3xl font-extrabold text-brand-darkBlue mb-4">Không tìm thấy khóa học</h2>
                    <p className="text-gray-500 mb-8 font-light leading-relaxed">Có vẻ như đường dẫn này không tồn tại hoặc khóa học đã bị gỡ bỏ.</p>
                    <Link to="/dao-tao" className="inline-block bg-brand-blue text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-800 transition-all shadow-lg uppercase text-xs tracking-widest">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>{course.title} | Đào tạo BIM chuyên nghiệp | CIC</title>
                <meta name="description" content={`${course.description.substring(0, 155)}...`} />
                <meta name="keywords" content={`đào tạo BIM, ${course.title}, khóa học ${course.level}, CIC, ISO 19650`} />
                <meta property="og:title" content={`${course.title} | CIC`} />
                <meta property="og:description" content={course.description} />
                <meta property="og:image" content={course.image_url} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={`https://cic-ttb-web.vercel.app/dao-tao/${course.slug}`} />
                {schemaData && (
                    <script type="application/ld+json">
                        {JSON.stringify(schemaData)}
                    </script>
                )}
            </Helmet>

            {/* Breadcrumbs - Premium Look */}
            <div className="bg-brand-lightBlue/30 border-b border-brand-blue/10">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
                        <Link to="/" className="text-gray-500 hover:text-brand-blue transition-colors">Trang chủ</Link>
                        <svg className="w-4 h-4 mx-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link to="/dao-tao" className="text-gray-500 hover:text-brand-blue transition-colors">Đào tạo</Link>
                        <svg className="w-4 h-4 mx-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-brand-blue font-bold truncate max-w-xs">{course.title}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section - Matching Home Page Design */}
            <div className="relative bg-brand-darkBlue overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-darkBlue via-brand-darkBlue/90 to-transparent"></div>
                    <img
                        src={course.image_url}
                        alt="Hero background"
                        className="w-full h-full object-cover opacity-20 filter blur-[2px]"
                    />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/20 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block bg-brand-orange text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20">
                            Khóa học {course.level}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            {course.title.split(':').map((part, i) => (
                                <span key={i} className={i === 1 ? 'block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300' : ''}>
                                    {part}{i === 0 && course.title.includes(':') ? ':' : ''}
                                </span>
                            ))}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-xl">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm mb-10">
                            <div className="flex items-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 group hover:bg-white/20 transition-all">
                                <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Thời lượng</div>
                                    <div className="text-white font-bold">{course.duration}</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 group hover:bg-white/20 transition-all">
                                <svg className="w-5 h-5 mr-3 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Học phí</div>
                                    <div className="text-white font-bold">{formatPrice(course.price)}</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 group hover:bg-white/20 transition-all">
                                <span className="text-xl mr-3">⭐</span>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Đánh giá</div>
                                    <div className="text-white font-bold">4.8/5 (150+)</div>
                                </div>
                            </div>
                        </div>

                        <a
                            href="#register"
                            className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 uppercase text-sm tracking-widest"
                        >
                            Đăng ký Tư vấn ngay
                        </a>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2rem] opacity-20 blur-2xl animate-pulse"></div>
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-3xl">
                            <img
                                src={course.image_url}
                                alt={`Khóa học ${course.title}`}
                                className="w-full h-[450px] object-cover transition-transform duration-1000 hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-darkBlue/80 via-transparent to-transparent"></div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce-slow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Trạng thái</div>
                                <div className="text-brand-darkBlue font-black">Sắp khai giảng</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Course Detail */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Overview */}
                        <article className="prose prose-blue max-w-none">
                            <h2 className="text-3xl font-extrabold text-brand-darkBlue mb-8 flex items-center">
                                <span className="w-2 h-10 bg-brand-orange mr-4 rounded-full"></span>
                                Nội dung chi tiết
                            </h2>
                            <div
                                className="text-gray-600 leading-relaxed font-light text-lg space-y-6"
                                dangerouslySetInnerHTML={{ __html: course.content }}
                            />
                        </article>

                        {/* Curriculum - Premium Cards */}
                        {course.curriculum && course.curriculum.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-extrabold text-brand-darkBlue mb-8 flex items-center">
                                    <span className="w-2 h-10 bg-brand-blue mr-4 rounded-full"></span>
                                    Chương trình Đào tạo
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    {course.curriculum.map((mod: any, idx: number) => (
                                        <div key={idx} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                            <div className="bg-brand-darkBlue p-6 flex justify-between items-center">
                                                <h3 className="text-white font-bold text-lg flex items-center">
                                                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 text-sm font-black border border-blue-500/30">
                                                        {idx + 1}
                                                    </span>
                                                    {mod.title}
                                                </h3>
                                                <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                            <div className="p-8">
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {mod.lessons?.map((lesson: string, i: number) => (
                                                        <li key={i} className="flex items-start text-gray-500 text-sm font-light hover:text-brand-blue transition-colors">
                                                            <svg className="w-5 h-5 text-brand-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {lesson}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQs - Clean Design */}
                        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-brand-blue/5">
                            <h2 className="text-3xl font-extrabold text-brand-darkBlue mb-10 text-center">Câu hỏi thường gặp</h2>
                            <div className="space-y-4">
                                {[
                                    { q: "Tôi có được cấp chứng chỉ sau khóa học không?", a: "Có. Sau khi hoàn thành khóa học và đạt bài kiểm tra cuối khóa, học viên sẽ được CIC cấp chứng chỉ hoàn thành khóa đào tạo có giá trị chuyên môn cao." },
                                    { q: "Khóa học có hỗ trợ sau khi kết thúc không?", a: "CIC hỗ trợ giải đáp thắc mắc chuyên môn qua group Zalo/Facebook trọn đời cho học viên đã tham gia khóa học." },
                                    { q: "Phương thức học là gì?", a: "Tùy khóa học sẽ có hình thức học Offline tại Hà Nội/TP.HCM hoặc Online qua Zoom có tương tác trực tiếp với giảng viên." },
                                    { q: "Có ưu đãi cho đăng ký nhóm không?", a: "Có, CIC luôn có chính sách ưu đãi hấp dẫn cho nhóm đăng ký từ 3 người trở lên hoặc học viên cũ." }
                                ].map((faq, idx) => (
                                    <details key={idx} className="group overflow-hidden rounded-2xl border border-gray-100">
                                        <summary className="flex items-center justify-between cursor-pointer list-none p-6 font-bold text-brand-darkBlue bg-gray-50/50 hover:bg-white transition-all">
                                            <span>{faq.q}</span>
                                            <span className="transition-transform group-open:rotate-180 bg-white p-2 rounded-full shadow-sm">
                                                <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                            </span>
                                        </summary>
                                        <div className="p-8 text-gray-500 font-light leading-relaxed bg-white text-lg">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                        {/* Related Courses */}
                        {relatedCourses.length > 0 && (
                            <div className="pt-8">
                                <h2 className="text-2xl font-extrabold text-brand-darkBlue mb-8">Khóa học liên quan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedCourses.map(related => (
                                        <Link
                                            key={related.id}
                                            to={`/dao-tao/${related.slug}`}
                                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full"
                                        >
                                            <div className="h-40 overflow-hidden relative">
                                                <img
                                                    src={related.image_url}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute top-3 right-3 bg-brand-darkBlue/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                                                    {related.level}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <h3 className="font-bold text-brand-darkBlue text-sm line-clamp-2 mb-3 h-10 group-hover:text-brand-blue transition-colors">
                                                    {related.title}
                                                </h3>
                                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
                                                    <span className="text-gray-400 font-bold">{related.duration}</span>
                                                    <span className="text-brand-blue font-black">{formatPrice(related.price)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-[100px] space-y-8" id="register">
                            {/* Lead Generation Form */}
                            <div className="bg-white rounded-[2.5rem] shadow-2xl p-1 border border-brand-blue/5">
                                <LeadForm courseId={course.id} courseTitle={course.title} />
                            </div>

                            {/* Why Choose CIC - Matching Home Aesthetics */}
                            <div className="bg-brand-darkBlue p-10 rounded-[2.5rem] text-white overflow-hidden relative group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl group-hover:bg-brand-orange/20 transition-all duration-700"></div>
                                <h4 className="font-extrabold mb-8 text-2xl tracking-tight">Tại sao chọn CIC?</h4>
                                <ul className="space-y-6">
                                    {[
                                        "35+ năm kinh nghiệm công nghệ",
                                        "Đối tác chiến lược Autodesk",
                                        "Giảng viên chuyên gia thực chiến",
                                        "Chứng chỉ Quốc tế uy tín"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4 group">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30 group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-gray-300 font-light group-hover:text-white transition-colors">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-2 justify-center">
                                    <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">🔒 Bảo mật tuyệt đối</div>
                                    <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">✅ Hoàn tiền 100%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="relative py-24 overflow-hidden bg-brand-darkBlue">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-darkBlue via-brand-blue/50 to-brand-darkBlue"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Kiến tạo <span className="text-brand-orange">Tương lai BIM</span> cùng CIC
                    </h2>
                    <p className="text-gray-300 mb-12 max-w-2xl mx-auto font-light text-lg">
                        Mọi thắc mắc về khóa học và lộ trình nghề nghiệp
                        sẽ được đội ngũ chuyên gia giải đáp chi tiết.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <a
                            href="#register"
                            className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-12 py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase tracking-[0.2em] text-sm"
                        >
                            Nhận tư vấn miễn phí
                        </a>
                        <a
                            href="tel:+84123456789"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-12 py-5 rounded-2xl transition-all backdrop-blur-md uppercase tracking-[0.2em] text-sm"
                        >
                            Hotline tư vấn
                        </a>
                    </div>
                </div>
            </div>

            {/* Sticky Floating Action Button */}
            <a
                href="#register"
                className="fixed bottom-8 right-8 bg-[#25d366] hover:bg-[#1ebea5] text-white font-black px-8 py-5 rounded-full shadow-3xl flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-6 h-6 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <span className="uppercase tracking-widest text-xs">Đăng ký ngay</span>
            </a>
        </div>
    );
};

export default TrainingDetail;
