
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
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a237e]"></div></div>;
    }

    if (!course) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy khóa học</h2>
                <Link to="/dao-tao" className="text-[#1a237e] hover:underline mt-4 inline-block">← Quay lại danh sách</Link>
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

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
                        <Link to="/" className="text-gray-500 hover:text-[#1a237e]">Trang chủ</Link>
                        <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link to="/dao-tao" className="text-gray-500 hover:text-[#1a237e]">Đào tạo</Link>
                        <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#1a237e] font-semibold truncate max-w-xs">{course.title}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section - Navy Blue Theme */}
            <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white">
                <div className="container mx-auto px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block bg-yellow-400 text-[#1a237e] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                            {course.level}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
                        <p className="text-xl text-blue-100 mb-8">{course.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm mb-8">
                            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {course.duration}
                            </div>
                            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                                {formatPrice(course.price)}
                            </div>
                            <div className="flex items-center bg-yellow-400 text-[#1a237e] px-4 py-2 rounded-full font-bold">
                                ⭐ 4.8/5 (150+ đánh giá)
                            </div>
                        </div>

                        <a href="#register" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-[#1a237e] font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                            Đăng ký ngay →
                        </a>
                    </div>
                    <div className="relative hidden md:block">
                        <img
                            src={course.image_url}
                            alt={`Khóa học ${course.title}`}
                            className="rounded-xl shadow-2xl w-full object-cover h-80"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            {/* Content & Sidebar */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <article className="bg-white p-8 rounded-xl shadow-sm mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Nội dung chi tiết</h2>
                            <div
                                className="prose prose-blue max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: course.content }}
                            />
                        </article>

                        {/* Curriculum Accordion */}
                        {course.curriculum && course.curriculum.length > 0 && (
                            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chương trình học</h2>
                                <div className="space-y-4">
                                    {course.curriculum.map((mod: any, idx: number) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-[#1a237e] px-6 py-4 font-semibold text-white">
                                                {mod.title}
                                            </div>
                                            <ul className="px-6 py-4 space-y-2 bg-white">
                                                {mod.lessons?.map((lesson: string, i: number) => (
                                                    <li key={i} className="flex items-start text-gray-600">
                                                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        {lesson}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQ Section */}
                        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp (FAQ)</h2>
                            <div className="space-y-2">
                                {[
                                    { q: "Tôi có được cấp chứng chỉ sau khóa học không?", a: "Có. Sau khi hoàn thành khóa học và đạt bài kiểm tra cuối khóa, học viên sẽ được CIC cấp chứng chỉ hoàn thành khóa đào tạo có giá trị chuyên môn cao." },
                                    { q: "Khóa học có hỗ trợ sau khi kết thúc không?", a: "CIC hỗ trợ giải đáp thắc mắc chuyên môn qua group Zalo/Facebook trọn đời cho học viên đã tham gia khóa học." },
                                    { q: "Phương thức học là gì?", a: "Tùy khóa học sẽ có hình thức học Offline tại Hà Nội/TP.HCM hoặc Online qua Zoom có tương tác trực tiếp với giảng viên." },
                                    { q: "Có ưu đãi cho đăng ký nhóm không?", a: "Có, CIC luôn có chính sách ưu đãi hấp dẫn cho nhóm đăng ký từ 3 người trở lên hoặc học viên cũ." }
                                ].map((faq, idx) => (
                                    <details key={idx} className="group border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <summary className="flex items-center justify-between cursor-pointer list-none py-3 pr-4 font-bold text-gray-800 hover:text-[#1a237e] transition-colors">
                                            <span>{faq.q}</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                            </span>
                                        </summary>
                                        <p className="mt-2 text-gray-600 leading-relaxed pr-8">
                                            {faq.a}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>

                        {/* Related Courses - Internal Linking for SEO */}
                        {relatedCourses.length > 0 && (
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Khóa học liên quan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {relatedCourses.map(related => (
                                        <Link
                                            key={related.id}
                                            to={`/dao-tao/${related.slug}`}
                                            className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all"
                                        >
                                            <div className="h-32 overflow-hidden">
                                                <img
                                                    src={related.image_url}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <span className="text-xs text-[#1a237e] font-semibold uppercase">{related.level}</span>
                                                <h3 className="font-bold text-gray-900 text-sm mt-1 line-clamp-2 group-hover:text-[#1a237e]">
                                                    {related.title}
                                                </h3>
                                                <p className="text-xs text-green-600 font-semibold mt-2">{formatPrice(related.price)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8" id="register">
                            <LeadForm courseId={course.id} courseTitle={course.title} />

                            <div className="mt-8 bg-[#1a237e] p-6 rounded-lg text-white">
                                <h4 className="font-bold mb-4 text-lg">Tại sao chọn CIC?</h4>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex gap-3">
                                        <span className="text-yellow-400 text-lg">✓</span>
                                        <span>35+ năm kinh nghiệm công nghệ xây dựng</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-400 text-lg">✓</span>
                                        <span>Đối tác chiến lược của Autodesk, Bentley</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-400 text-lg">✓</span>
                                        <span>Giảng viên là chuyên gia thực chiến</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-400 text-lg">✓</span>
                                        <span>Chứng chỉ được doanh nghiệp công nhận</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-4 flex gap-2 justify-center">
                                <div className="bg-white px-3 py-2 rounded shadow text-xs font-medium text-gray-600">🔒 Thanh toán an toàn</div>
                                <div className="bg-white px-3 py-2 rounded shadow text-xs font-medium text-gray-600">✅ Hoàn tiền 100%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Sẵn sàng nâng cao kỹ năng BIM?</h2>
                    <p className="text-blue-100 mb-6">Liên hệ ngay để được tư vấn lộ trình học phù hợp</p>
                    <a
                        href="tel:+84123456789"
                        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-[#1a237e] font-bold px-8 py-4 rounded-lg shadow-lg"
                    >
                        📞 Gọi ngay: 0123 456 789
                    </a>
                </div>
            </div>

            {/* Sticky CTA */}
            <a
                href="#register"
                className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 z-50 transition-all hover:scale-105"
            >
                🎓 Đăng ký ngay
            </a>
        </div>
    );
};

export default TrainingDetail;
