import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import ProjectDetailModal from '../components/ProjectDetailModal';
import SEO from '../components/SEO';

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setIsLoading(true);
            const data = await api.getProjects();
            setProjects(data);
            setFilteredProjects(data);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (filter === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.service_type === filter));
        }
    }, [filter, projects]);

    const handleOpenProject = (project: any) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const filters = ['All', ...Array.from(new Set(projects.map(p => p.service_type).filter(Boolean)))];

    return (
        <>
            <SEO
                title="Dự án | CIC Digital Twin"
                description="Khám phá các dự án BIM và Digital Twin tiêu biểu đã được CIC triển khai thành công cho các công trình lớn tại Việt Nam."
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#0a192f] via-[#0d1f3c] to-[#1a0a2e] overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6 tracking-wider uppercase">
                            Our Portfolio
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Dự án <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Tiêu biểu</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                            Khám phá các dự án BIM và Digital Twin tiên tiến mà chúng tôi đã triển khai thành công,
                            từ các công trình dân dụng đến hạ tầng kỹ thuật phức tạp.
                        </p>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 50L60 45.7C120 41.3 240 32.7 360 32.5C480 32.3 600 40.7 720 45.2C840 49.7 960 50.3 1080 47.2C1200 44 1320 37 1380 33.5L1440 30V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="#f9fafb" />
                    </svg>
                </div>
            </section>

            {/* Filter & Projects Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === f
                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {f === 'All' ? 'Tất cả' : f}
                            </button>
                        ))}
                    </div>

                    {/* Projects Count */}
                    <div className="text-center mb-8">
                        <span className="text-gray-500">
                            Hiển thị <span className="font-bold text-gray-800">{filteredProjects.length}</span> dự án
                            {filter !== 'All' && <span> trong danh mục <span className="font-bold text-cyan-600">{filter}</span></span>}
                        </span>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                    <div className="h-56 bg-gray-200"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects Grid */}
                    {!isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-cyan-200 hover:-translate-y-2"
                                    onClick={() => handleOpenProject(project)}
                                    style={{
                                        animation: 'fadeInUp 0.6s ease-out forwards',
                                        animationDelay: `${index * 100}ms`,
                                        opacity: 0
                                    }}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={project.images && project.images[0] ? project.images[0] : 'https://via.placeholder.com/600x400?text=Project'}
                                            alt={project.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* View Button on Hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <span className="px-6 py-2.5 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                                                Xem chi tiết →
                                            </span>
                                        </div>

                                        {/* Service Type Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                                                {project.service_type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                                            <span className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-gray-600">{project.location}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-gray-600">{project.completion_date}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredProjects.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có dự án nào</h3>
                            <p className="text-gray-500">Không tìm thấy dự án phù hợp với bộ lọc hiện tại.</p>
                            <button
                                onClick={() => setFilter('All')}
                                className="mt-6 px-6 py-2.5 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-colors"
                            >
                                Xem tất cả dự án
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <ProjectDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
            />

            {/* Animation Keyframes */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default ProjectsPage;
