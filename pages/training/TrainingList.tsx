
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trainingService, TrainingCourse } from '../../services/trainingService';
import { Helmet } from 'react-helmet-async';
import TrainingLayout from '../../components/training/TrainingLayout';

const TrainingList: React.FC = () => {
    const [courses, setCourses] = useState<TrainingCourse[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <TrainingLayout activeSection="courses">
            <div className="bg-gray-50 min-h-screen">
                <Helmet>
                    <title>Chương trình Đào tạo BIM | CIC</title>
                    <meta name="description" content="Các khóa học BIM chuyên sâu từ cơ bản đến nâng cao, chuẩn ISO 19650 do CIC tổ chức đào tạo." />
                </Helmet>

                {/* Header Banner - Navy Blue matching website */}
                <div className="bg-gradient-to-r from-[#1a237e] to-[#2c3e9e] text-white py-16 shadow-lg">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Chương trình Đào tạo BIM</h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">Nâng cao năng lực đội ngũ với các khóa học BIM chuyên sâu, thực chiến từ các chuyên gia hàng đầu của CIC.</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse bg-white rounded-lg h-96 shadow"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map(course => (
                                <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={course.image_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        <div className="absolute top-4 right-4 bg-[#1a237e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                            {course.level}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                                            <Link to={`/dao-tao/${course.slug}`} className="hover:text-[#1a237e]">
                                                {course.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {course.duration}
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {formatPrice(course.price)}
                                            </div>
                                        </div>

                                        <Link
                                            to={`/dao-tao/${course.slug}`}
                                            className="block w-full text-center bg-gray-50 hover:bg-[#1a237e] hover:text-white text-[#1a237e] font-semibold py-3 rounded-lg border border-[#1a237e] transition-all"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </TrainingLayout>
    );
};

export default TrainingList;
