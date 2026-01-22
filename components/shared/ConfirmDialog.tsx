// Confirm Dialog Component
// Replaces browser confirm() with a professional modal dialog

import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
    icon?: 'warning' | 'danger' | 'info' | 'question';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    onConfirm,
    onCancel,
    danger = false,
    icon = 'question'
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onCancel(); // Close dialog after confirmation
    };

    const iconColors = {
        warning: 'text-yellow-500',
        danger: 'text-red-500',
        info: 'text-blue-500',
        question: 'text-gray-500'
    };

    const iconPaths = {
        warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        question: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 pointer-events-auto transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 ${iconColors[icon]}`}>
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={iconPaths[icon]}
                                />
                            </svg>
                        </div>

                        <div className="flex-1">
                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {title}
                            </h3>

                            {/* Message */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium text-gray-700"
                                >
                                    {cancelText}
                                </button>

                                <button
                                    onClick={handleConfirm}
                                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${danger
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmDialog;
