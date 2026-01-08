import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import ProjectDetailModal from './ProjectDetailModal';

const PortfolioSection: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);
            setFilteredProjects(data);
        } catch (error) {
            console.error('Failed to load projects', error);
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

    const filters = ['All', ...Array.from(new Set(projects.map(p => p.service_type)))];

    return (
        <section id="portfolio" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        Dự án <span className="text-brand-blue">Tiêu biểu</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Khám phá các dự án BIM/Digital Twin chúng tôi đã triển khai thành công
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                    ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {f === 'All' ? 'Tất cả' : f}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                            onClick={() => handleOpenProject(project)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={project.images && project.images[0] ? project.images[0] : 'https://via.placeholder.com/600x400?text=Project'}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <span className="text-white font-medium">Xem chi tiết &rarr;</span>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-brand-blue">
                                    {project.service_type}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-4">
                                    <span>{project.location}</span>
                                    <span>{project.completion_date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Chưa có dự án nào trong danh mục này.
                    </div>
                )}
            </div>

            <ProjectDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
            />
        </section>
    );
};

export default PortfolioSection;
