'use client';

import { useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { FragmentOf } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/fragments';
import { ProductCard } from '@/components/commerce/product-card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductCarouselProps {
    title: string;
    products: Array<FragmentOf<typeof ProductCardFragment>>;
    /** Optional href for the "See All" link — defaults to /search */
    seeAllHref?: string;
}

export function ProductCarousel({
    title,
    products,
    seeAllHref = '/search',
}: ProductCarouselProps) {
    const id = useId();

    if (!products.length) return null;

    return (
        <section className="py-8 md:py-10">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-5">

                {/* ── Section header ── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Orange left-border accent */}
                        <span
                            className="w-1 h-6 rounded-full bg-orange-500 shrink-0"
                            aria-hidden="true"
                        />
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                            {title}
                        </h2>
                    </div>

                    <Link
                        href={seeAllHref}
                        className="group flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150"
                    >
                        See All
                        <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </div>

                {/* ── Carousel ── */}
                <Carousel
                    opts={{ align: 'start', loop: true }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3">
                        {products.map((product, i) => (
                            <CarouselItem
                                key={id + i}
                                /*
                                 * Mobile: 2 cards visible (50% each minus gap)
                                 * sm:     3 cards
                                 * lg:     4 cards
                                 */
                                className="pl-3 basis-1/2 sm:basis-1/3 lg:basis-1/4"
                            >
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Arrow controls — desktop only */}
                    <CarouselPrevious className="hidden md:flex -left-4 border-slate-200 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-colors" />
                    <CarouselNext className="hidden md:flex -right-4 border-slate-200 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-colors" />
                </Carousel>
            </div>
        </section>
    );
}
    
