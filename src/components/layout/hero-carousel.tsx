'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroSlide {
    id: string;
    headline: string;
    sub: string;
    cta: string;
    ctaHref: string;
    secondaryCta?: string;
    secondaryHref?: string;
    /** Tailwind gradient — no external image required, swap for real images later */
    gradient: string;
    accentColor: string;
}

interface HeroCarouselProps {
    slides: HeroSlide[];
    autoPlayMs?: number;
}

export function HeroCarousel({ slides, autoPlayMs = 5000 }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    const prev = useCallback(
        () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
        [slides.length],
    );
    const next = useCallback(
        () => setCurrent((c) => (c + 1) % slides.length),
        [slides.length],
    );

    useEffect(() => {
        if (paused || slides.length <= 1) return;
        const id = setInterval(next, autoPlayMs);
        return () => clearInterval(id);
    }, [paused, next, autoPlayMs, slides.length]);

    const slide = slides[current];

    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Promotional banners"
        >
            {/* ── Slides ── */}
            <div
                className="flex transition-transform duration-500 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((s, i) => (
                    <div
                        key={s.id}
                        aria-roledescription="slide"
                        aria-label={`Slide ${i + 1} of ${slides.length}`}
                        aria-hidden={i !== current}
                        className={cn(
                            'relative min-w-full flex items-center',
                            'min-h-[320px] md:min-h-[420px] lg:min-h-[480px]',
                            s.gradient,
                        )}
                    >
                        {/* Decorative pattern overlay */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '28px 28px',
                            }}
                        />

                        {/* Bottom fade for readability */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
                        />

                        {/* Content */}
                        <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-10 py-10 md:py-16 w-full">
                            <div className="max-w-lg space-y-4 md:space-y-5">
                                <p className="inline-block text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-white/80 bg-white/15 rounded-full px-3 py-1 backdrop-blur-sm">
                                    Limited Offer
                                </p>

                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                                    {s.headline}
                                </h2>

                                <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-sm">
                                    {s.sub}
                                </p>

                                <div className="flex flex-wrap gap-3 pt-1">
                                    <Link
                                        href={s.ctaHref}
                                        className={cn(
                                            'inline-flex items-center justify-center gap-2',
                                            'px-6 py-2.5 rounded-full',
                                            'text-sm font-bold text-white shadow-lg',
                                            'active:scale-[0.97] transition-all duration-150',
                                            s.accentColor,
                                        )}
                                    >
                                        {s.cta}
                                    </Link>

                                    {s.secondaryCta && s.secondaryHref && (
                                        <Link
                                            href={s.secondaryHref}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white border border-white/50 hover:bg-white/15 active:scale-[0.97] transition-all duration-150 backdrop-blur-sm"
                                        >
                                            {s.secondaryCta}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Prev / Next arrows — desktop only ── */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white border border-white/20 transition-all duration-150 active:scale-95"
                    >
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white border border-white/20 transition-all duration-150 active:scale-95"
                    >
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                </>
            )}

            {/* ── Dot indicators ── */}
            {slides.length > 1 && (
                <div
                    role="tablist"
                    aria-label="Slides"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
                >
                    {slides.map((s, i) => (
                        <button
                            key={s.id}
                            role="tab"
                            aria-selected={i === current}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => setCurrent(i)}
                            className={cn(
                                'rounded-full transition-all duration-300',
                                i === current
                                    ? 'w-6 h-2 bg-white'
                                    : 'w-2 h-2 bg-white/45 hover:bg-white/70',
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
