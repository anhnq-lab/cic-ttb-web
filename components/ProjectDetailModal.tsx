import React from 'react';
import Modal from './Modal';

interface ProjectDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ isOpen, onClose, project }) => {
    if (!project) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={project.title} maxWidth="sm:max-w-4xl">
            <div className="p-6">
                {/* Header Info */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 border-b pb-4">
                    <div className="flex items-center">
                        <span className="font-bold mr-2">Khách hàng:</span> {project.client}
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold mr-2">Địa điểm:</span> {project.location}
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold mr-2">Loại hình:</span> <span className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded text-xs font-bold">{project.service_type}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold mr-2">Hoàn thành:</span> {project.completion_date}
                    </div>
                </div>

                {/* Gallery */}
                {project.images && project.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {project.images.map((img: string, index: number) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Project ${index}`}
                                className={`w-full object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${index === 0 ? 'md:col-span-2 h-64 md:h-80' : 'h-40'}`}
                            />
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="space-y-6 text-gray-800">
                    <div>
                        <h3 className="text-lg font-bold text-brand-blue mb-2">Thách thức</h3>
                        <p className="leading-relaxed">{project.challenge}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-blue mb-2">Giải pháp</h3>
                        <p className="leading-relaxed">{project.solution}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-blue mb-2">Kết quả</h3>
                        <p className="leading-relaxed">{project.result}</p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProjectDetailModal;
