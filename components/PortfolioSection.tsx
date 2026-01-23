import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ProjectDetailModal from './ProjectDetailModal';
import { LazyImage } from './shared/LazyImage';

const PortfolioSection: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await api.getProjects();
            // Only take first 4 featured projects for homepage
            setProjects(data.slice(0, 4));
        } catch (error) {
            console.error('Failed to load projects', error);
        }
    };

    const handleOpenProject = (project: any) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 400;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="portfolio" className="py-24 bg-gradient-to-br from-[#0a192f] via-[#0d1f3c] to-[#1a0a2e] relative overflow-hidden">
            {/* Tech Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4 tracking-wider uppercase">
                        Portfolio
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Dự án <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Tiêu biểu</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Khám phá các dự án BIM/Digital Twin tiên tiến chúng tôi đã triển khai thành công
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    {/* Navigation Arrows */}
                    <button
                        onClick={() => scrollCarousel('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 group-hover:-translate-x-6"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scrollCarousel('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-6"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className="flex-shrink-0 w-[350px] md:w-[400px] snap-start group/card cursor-pointer"
                                onClick={() => handleOpenProject(project)}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] hover:-translate-y-2">
                                    {/* Image Container */}
                                    <div className="relative h-56 overflow-hidden">
                                        <LazyImage
                                            src={project.images && project.images[0] ? project.images[0] : 'https://via.placeholder.com/600x400?text=Project'}
                                            alt={`Dự án ${project.title} - ${project.service_type}`}
                                            className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-700"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent"></div>

                                        {/* Service Type Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/80 to-purple-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg">
                                                {project.service_type}
                                            </span>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover/card:text-cyan-400 transition-colors line-clamp-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {project.location}
                                            </span>
                                            <span>{project.completion_date}</span>
                                        </div>
                                    </div>

                                    {/* Bottom Glow Line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All CTA */}
                <div className="text-center mt-12">
                    <Link
                        to="/du-an"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 hover:-translate-y-1 group"
                    >
                        <span>Xem tất cả dự án</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        Chưa có dự án nào.
                    </div>
                )}
            </div>

            <ProjectDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
            />

            {/* Hide scrollbar CSS */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default PortfolioSection;
