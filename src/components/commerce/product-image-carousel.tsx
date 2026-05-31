'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface ProductImageCarouselProps {
    images: Array<{
        id: string;
        preview: string;
        source: string;
    }>;
}

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
                <ImageOff className="h-12 w-12" aria-hidden="true" />
                <span className="text-sm">No images available</span>
            </div>
        );
    }

    const goToPrevious = () =>
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () =>
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="space-y-3">
            {/* ── Main image ── */}
            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden group">
                <Image
                    src={images[currentIndex].source}
                    alt={`Product image ${currentIndex + 1}`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={currentIndex === 0}
                />

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow border border-slate-100 text-slate-700 hover:text-orange-500 hover:border-orange-300 opacity-0 group-hover:opacity-100 transition-all duration-150"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={goToNext}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow border border-slate-100 text-slate-700 hover:text-orange-500 hover:border-orange-300 opacity-0 group-hover:opacity-100 transition-all duration-150"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </>
                )}

                {/* Counter pill */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* ── Mobile: dot indicators ── */}
            {images.length > 1 && (
                <div className="flex md:hidden items-center justify-center gap-1.5" role="tablist" aria-label="Images">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            role="tab"
                            aria-selected={i === currentIndex}
                            aria-label={`Image ${i + 1}`}
                            onClick={() => setCurrentIndex(i)}
                            className={`rounded-full transition-all duration-200 ${
                                i === currentIndex
                                    ? 'w-5 h-2 bg-orange-500'
                                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* ── Desktop: thumbnail strip ── */}
            {images.length > 1 && (
                <div className="hidden md:grid grid-cols-4 gap-2.5">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`View image ${index + 1}`}
                            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                                index === currentIndex
                                    ? 'ring-2 ring-orange-500 ring-offset-2 scale-[1.03]'
                                    : 'ring-1 ring-slate-200 opacity-60 hover:opacity-100 hover:ring-slate-400'
                            }`}
                        >
                            <Image
                                src={image.preview}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="25vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
