import React from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

/**
 * Lazy-loaded image component for better performance
 * Uses native browser lazy loading
 */
export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height
}) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
        />
    );
};
