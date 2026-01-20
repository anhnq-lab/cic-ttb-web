
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trainingService, TrainingCourse } from '../../services/trainingService';
import LeadForm from '../../components/marketing/LeadForm';
import { Helmet } from 'react-helmet-async';

const TrainingDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<TrainingCourse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!slug) return;
            try {
                const data = await trainingService.getCourseBySlug(slug);
                setCourse(data);
            } catch (error) {
                console.error('Failed to fetch course', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    if (!course) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy khóa học</h2>
                <Link to="/dao-tao" className="text-blue-600 hover:underline mt-4 inline-block">Quay lại danh sách</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-20">
            <Helmet>
                <title>{course.title} | Đào tạo CIC</title>
                <meta name="description" content={course.description} />
            </Helmet>

            {/* Hero Section */}
            <div className="bg-blue-900 text-white">
                <div className="container mx-auto px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block bg-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                            {course.level}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
                        <p className="text-xl text-blue-100 mb-8">{course.description}</p>
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Thời lượng: <strong>{course.duration}</strong>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Học phí: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden md:block">
                        <img
                            src={course.image_url}
                            alt={course.title}
                            className="rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500 w-full object-cover h-80"
                        />
                    </div>
                </div>
            </div>

            {/* Content & Sidebar */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Nội dung chi tiết</h2>
                            <div
                                className="prose prose-blue max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: course.content }}
                            />
                        </div>

                        {/* Curriculum Accordion (Mock implementation if curriculum exists) */}
                        {course.curriculum && course.curriculum.length > 0 && (
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chương trình học</h2>
                                <div className="space-y-4">
                                    {course.curriculum.map((mod: any, idx: number) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-6 py-4 font-semibold text-gray-800">
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
                    </div>

                    {/* Sidebar Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <LeadForm courseId={course.id} courseTitle={course.title} />

                            <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <h4 className="font-bold text-blue-900 mb-2">Tại sao chọn CIC?</h4>
                                <ul className="space-y-3 text-sm text-blue-800">
                                    <li className="flex gap-2">
                                        <div className="min-w-4 text-blue-500">✓</div>
                                        <span>35+ năm kinh nghiệm công nghệ xây dựng</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="min-w-4 text-blue-500">✓</div>
                                        <span>Đối tác chiến lược của Autodesk, Bentley</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="min-w-4 text-blue-500">✓</div>
                                        <span>Giảng viên là chuyên gia thực chiến</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingDetail;
