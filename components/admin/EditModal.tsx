import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import ImageUploader from '../ImageUploader';

export interface Field {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'url' | 'email' | 'checkbox' | 'json' | 'image' | 'images';
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    rows?: number;
    helpText?: string;
    maxImages?: number; // For images type
}

interface EditModalProps {
    isOpen: boolean;
    title: string;
    fields: Field[];
    data: any;
    onSubmit: (data: any) => Promise<void>;
    onClose: () => void;
    loading?: boolean;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    title,
    fields,
    data,
    onSubmit,
    onClose,
    loading = false
}) => {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(data || {});
            setErrors({});
        }
    }, [isOpen, data]);

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
        // Clear error when user starts typing
        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        fields.forEach((field) => {
            if (field.required && !formData[field.key]) {
                newErrors[field.key] = `${field.label} là bắt buộc`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error: any) {
            alert(error.message || 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field: Field) => {
        const value = formData[field.key] ?? '';
        const error = errors[field.key];

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={field.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        <textarea
                            value={value}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={field.rows || 4}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                error ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        {field.helpText && !error && (
                            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <div key={field.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        <select
                            value={value}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                error ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">-- Chọn --</option>
                            {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={field.key} className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={!!value}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {field.label}
                                {field.required && <span className="text-red-500"> *</span>}
                            </span>
                        </label>
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>
                );

            case 'image':
                return (
                    <div key={field.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        <ImageUploader
                            value={value || ''}
                            onChange={(url) => handleChange(field.key, url)}
                            placeholder={field.placeholder || 'Chọn ảnh hoặc nhập URL...'}
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        {field.helpText && !error && (
                            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
                        )}
                    </div>
                );

            case 'images':
                const imagesArray = Array.isArray(value) ? value : (value ? [value] : []);
                const maxImages = field.maxImages || 4;
                return (
                    <div key={field.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {Array.from({ length: maxImages }).map((_, index) => (
                                <div key={index} className="relative">
                                    <span className="absolute -top-1 -left-1 z-10 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">
                                        {index + 1}
                                    </span>
                                    <ImageUploader
                                        value={imagesArray[index] || ''}
                                        onChange={(url) => {
                                            const newImages = [...imagesArray];
                                            if (url) {
                                                newImages[index] = url;
                                            } else {
                                                newImages.splice(index, 1);
                                            }
                                            // Remove empty slots
                                            const filtered = newImages.filter(img => img);
                                            handleChange(field.key, filtered);
                                        }}
                                        compact={true}
                                    />
                                </div>
                            ))}
                        </div>
                        {field.helpText && (
                            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
                        )}
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>
                );

            case 'json':
                return (
                    <div key={field.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        <textarea
                            value={typeof value === 'string' ? value : (Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value || [], null, 2) : '[]')}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    handleChange(field.key, parsed);
                                } catch {
                                    // Keep as string if invalid JSON, user can fix it
                                    handleChange(field.key, e.target.value);
                                }
                            }}
                            placeholder={field.placeholder || '[]'}
                            rows={6}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                                error ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        {field.helpText && !error && (
                            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
                        )}
                    </div>
                );

            default:
                return (
                    <div key={field.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        <input
                            type={field.type}
                            value={value}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                error ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        {field.helpText && !error && (
                            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm:max-w-2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {fields.map((field) => renderField(field))}
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={submitting}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting || loading}
                    >
                        {submitting ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditModal;
