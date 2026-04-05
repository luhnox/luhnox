import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // For now, use original image
    // In production, you should have pre-converted WebP versions
    setImageSrc(src);
  }, [src]);

  return (
    <picture>
      {/* WebP format - modern browsers will prefer this */}
      <source 
        srcSet={src.replace(/\.(jpg|png)$/, '.webp')} 
        type="image/webp"
      />
      {/* Fallback to original format */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        decoding="async"
      />
    </picture>
  );
};

export default OptimizedImage;
