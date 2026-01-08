import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    placeholder = 'Chọn ảnh hoặc nhập URL...'
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    // Convert file to base64 data URL
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle file selection
    const handleFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh (jpg, png, gif, webp)');
            return;
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('Ảnh không được vượt quá 5MB');
            return;
        }

        setIsUploading(true);
        try {
            const base64 = await fileToBase64(file);
            onChange(base64);
        } catch (error) {
            console.error('Error converting image:', error);
            alert('Lỗi khi xử lý ảnh');
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    // Handle drag events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    // Handle paste from clipboard
    const handlePaste = useCallback(async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    await handleFile(file);
                }
                return;
            }
        }
    }, [handleFile]);

    // Listen for paste events when component is focused
    useEffect(() => {
        const dropZone = dropZoneRef.current;
        if (!dropZone) return;

        const onPaste = (e: Event) => handlePaste(e as ClipboardEvent);

        // Listen for paste on the document when drop zone is in view
        document.addEventListener('paste', onPaste);

        return () => {
            document.removeEventListener('paste', onPaste);
        };
    }, [handlePaste]);

    // Clear image
    const handleClear = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                    type="button"
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'upload'
                            ? 'bg-white text-brand-blue shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('upload')}
                >
                    📤 Tải ảnh lên
                </button>
                <button
                    type="button"
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'url'
                            ? 'bg-white text-brand-blue shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('url')}
                >
                    🔗 Nhập URL
                </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
                <div
                    ref={dropZoneRef}
                    className={`
                        relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer
                        ${isDragging ? 'border-brand-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {isUploading ? (
                        <div className="py-4">
                            <div className="animate-spin w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Đang xử lý ảnh...</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-brand-blue">Nhấn để chọn ảnh</span> hoặc kéo thả vào đây
                            </p>
                            <p className="text-xs text-gray-400">
                                💡 Mẹo: Bạn có thể <strong>Ctrl+V</strong> để dán ảnh từ clipboard
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP (max 5MB)</p>
                        </div>
                    )}
                </div>
            )}

            {/* URL Tab */}
            {activeTab === 'url' && (
                <div>
                    <input
                        type="text"
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                        placeholder="https://example.com/image.jpg"
                        value={value.startsWith('data:') ? '' : value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            )}

            {/* Preview */}
            {value && (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Error';
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                        title="Xóa ảnh"
                    >
                        ✕
                    </button>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                        {value.startsWith('data:') ? 'Ảnh đã tải lên' : 'URL'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
