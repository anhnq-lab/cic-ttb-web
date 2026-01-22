import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
        </div>
    );
};

export const PageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="animate-pulse">
                {/* Hero skeleton */}
                <div className="h-96 bg-gray-200"></div>

                {/* Content skeleton */}
                <div className="container mx-auto px-4 py-12">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border rounded-lg p-6">
                                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
