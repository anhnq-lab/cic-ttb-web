// Loading Spinner Component
// Simple, reusable loading indicator

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text,
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-2',
        lg: 'h-16 w-16 border-3',
        xl: 'h-24 w-24 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`
                    animate-spin rounded-full border-blue-600 border-t-transparent
                    ${sizeClasses[size]}
                `}
            />
            {text && (
                <p className="text-gray-600 text-sm font-medium">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-12">
            {spinner}
        </div>
    );
};

export default LoadingSpinner;
