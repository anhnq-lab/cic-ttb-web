import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
    compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    placeholder = 'Chọn ảnh hoặc nhập URL...',
    compact = false
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

    // Listen for paste events when component is focused or hovered
    useEffect(() => {
        const dropZone = dropZoneRef.current;
        if (!dropZone) return;

        let isFocusedOrHovered = false;

        const onMouseEnter = () => { isFocusedOrHovered = true; };
        const onMouseLeave = () => { isFocusedOrHovered = false; };
        const onFocus = () => { isFocusedOrHovered = true; };
        const onBlur = () => { isFocusedOrHovered = false; };

        const onPaste = (e: Event) => {
            // Only handle paste if this uploader is focused/hovered
            if (isFocusedOrHovered) {
                handlePaste(e as ClipboardEvent);
            }
        };

        dropZone.addEventListener('mouseenter', onMouseEnter);
        dropZone.addEventListener('mouseleave', onMouseLeave);
        dropZone.addEventListener('focusin', onFocus);
        dropZone.addEventListener('focusout', onBlur);
        document.addEventListener('paste', onPaste);

        return () => {
            dropZone.removeEventListener('mouseenter', onMouseEnter);
            dropZone.removeEventListener('mouseleave', onMouseLeave);
            dropZone.removeEventListener('focusin', onFocus);
            dropZone.removeEventListener('focusout', onBlur);
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
        <div className={compact ? 'space-y-1' : 'space-y-2'}>
            {/* Show only preview when compact and has image */}
            {compact && value ? (
                <div className="relative">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Error';
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600 shadow-md"
                        title="Xóa ảnh"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className={`flex bg-gray-100 rounded-lg ${compact ? 'p-0.5' : 'p-1 space-x-1'}`}>
                        <button
                            type="button"
                            className={`flex-1 ${compact ? 'px-1 py-0.5 text-[10px]' : 'px-3 py-1.5 text-xs'} font-medium rounded-md transition-all ${activeTab === 'upload'
                                ? 'bg-white text-brand-blue shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('upload')}
                        >
                            {compact ? '📤' : '📤 Tải ảnh lên'}
                        </button>
                        <button
                            type="button"
                            className={`flex-1 ${compact ? 'px-1 py-0.5 text-[10px]' : 'px-3 py-1.5 text-xs'} font-medium rounded-md transition-all ${activeTab === 'url'
                                ? 'bg-white text-brand-blue shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('url')}
                        >
                            {compact ? '🔗' : '🔗 Nhập URL'}
                        </button>
                    </div>

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <div
                            ref={dropZoneRef}
                            className={`
                                relative border-2 border-dashed rounded-lg text-center transition-all cursor-pointer
                                ${compact ? 'p-2' : 'p-4'}
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
                                <div className={compact ? 'py-2' : 'py-4'}>
                                    <div className={`animate-spin border-2 border-brand-blue border-t-transparent rounded-full mx-auto mb-1 ${compact ? 'w-5 h-5' : 'w-8 h-8 mb-2'}`}></div>
                                    {!compact && <p className="text-sm text-gray-500">Đang xử lý ảnh...</p>}
                                </div>
                            ) : (
                                <div className={compact ? 'py-1' : 'py-2'}>
                                    <svg className={`mx-auto text-gray-400 ${compact ? 'w-6 h-6 mb-1' : 'w-10 h-10 mb-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {compact ? (
                                        <p className="text-[10px] text-gray-500">Ctrl+V / Kéo thả</p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium text-brand-blue">Nhấn để chọn ảnh</span> hoặc kéo thả vào đây
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                💡 Mẹo: Bạn có thể <strong>Ctrl+V</strong> để dán ảnh từ clipboard
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP (max 5MB)</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* URL Tab */}
                    {activeTab === 'url' && (
                        <div>
                            <input
                                type="text"
                                className={`w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none ${compact ? 'p-1.5 text-xs' : 'p-2.5 text-sm'}`}
                                placeholder={compact ? 'URL ảnh...' : 'https://example.com/image.jpg'}
                                value={value.startsWith('data:') ? '' : value}
                                onChange={(e) => onChange(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Preview for non-compact mode */}
                    {!compact && value && (
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
                </>
            )}
        </div>
    );
};

export default ImageUploader;
