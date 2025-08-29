'use client';

import Image, { ImageProps } from 'next/image';
import PlaceholderImage from '@/assets/placeholder-image.png';

export default function ProductImage({ src, alt, ...props }: ImageProps) {

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src = PlaceholderImage.src;
        (e.target as HTMLImageElement).onerror = null;
    };

    return (
        <Image
            alt={alt}
            src={src || PlaceholderImage.src}
            {...props}
            onError={handleError}
        />
    );
}