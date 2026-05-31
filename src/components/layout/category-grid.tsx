import { getTopCollections } from '@/lib/vendure/cached';
import { getRouteLocale } from '@/i18n/server';
import { Link } from '@/i18n/navigation';
import {
    Shirt,
    Tv,
    Home,
    Sparkles,
    ShoppingBag,
    Dumbbell,
    BookOpen,
    Baby,
    Car,
    Utensils,
    Smartphone,
    Gem,
    Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** Map collection slugs → Lucide icon. Falls back to Package for unknowns. */
const SLUG_ICON_MAP: Record<string, React.ElementType> = {
    clothing: Shirt,
    fashion: Shirt,
    apparel: Shirt,
    electronics: Tv,
    phones: Smartphone,
    smartphones: Smartphone,
    home: Home,
    'home-living': Home,
    furniture: Home,
    beauty: Sparkles,
    'health-beauty': Sparkles,
    cosmetics: Sparkles,
    bags: ShoppingBag,
    accessories: Gem,
    sports: Dumbbell,
    fitness: Dumbbell,
    books: BookOpen,
    baby: Baby,
    kids: Baby,
    automotive: Car,
    food: Utensils,
    grocery: Utensils,
};

/** Warm accent colours — cycles across the grid for visual richness */
const ACCENT_COLORS = [
    { bg: 'bg-orange-50', icon: 'text-orange-500', ring: 'group-hover:ring-orange-400' },
    { bg: 'bg-amber-50',  icon: 'text-amber-500',  ring: 'group-hover:ring-amber-400'  },
    { bg: 'bg-sky-50',    icon: 'text-sky-500',    ring: 'group-hover:ring-sky-400'    },
    { bg: 'bg-emerald-50',icon: 'text-emerald-600',ring: 'group-hover:ring-emerald-400'},
    { bg: 'bg-violet-50', icon: 'text-violet-500', ring: 'group-hover:ring-violet-400' },
    { bg: 'bg-rose-50',   icon: 'text-rose-500',   ring: 'group-hover:ring-rose-400'   },
    { bg: 'bg-teal-50',   icon: 'text-teal-600',   ring: 'group-hover:ring-teal-400'   },
    { bg: 'bg-indigo-50', icon: 'text-indigo-500', ring: 'group-hover:ring-indigo-400' },
];

export async function CategoryGrid() {
    const locale = await getRouteLocale();
    const collections = await getTopCollections(locale);

    if (!collections.length) return null;

    return (
        <section className="py-6 md:py-8 bg-white">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-5">

                {/* Section header */}
                <div className="flex items-center gap-3 mb-4">
                    <span
                        className="w-1 h-5 rounded-full bg-orange-500 shrink-0"
                        aria-hidden="true"
                    />
                    <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
                        Shop by Category
                    </h2>
                </div>

                {/*
                 * Mobile: horizontal scroll (no wrap) — dense, finger-friendly
                 * Desktop: wrap in a flex row that fills the width evenly
                 */}
                <div
                    className={cn(
                        'flex gap-3',
                        'overflow-x-auto md:overflow-visible',
                        'scrollbar-none',
                        'md:flex-wrap md:justify-start',
                    )}
                    role="list"
                >
                    {collections.map((collection, i) => {
                        const Icon =
                            SLUG_ICON_MAP[collection.slug.toLowerCase()] ??
                            Package;
                        const color =
                            ACCENT_COLORS[i % ACCENT_COLORS.length];

                        return (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                role="listitem"
                                className={cn(
                                    'group flex flex-col items-center gap-2',
                                    'shrink-0',
                                    // Mobile: fixed-width pill; desktop: min-width
                                    'w-[72px] md:w-auto md:min-w-[80px]',
                                    'transition-transform duration-150',
                                    'hover:-translate-y-0.5 active:scale-95',
                                )}
                            >
                                {/* Icon circle */}
                                <div
                                    className={cn(
                                        'flex items-center justify-center',
                                        'w-14 h-14 md:w-16 md:h-16 rounded-2xl',
                                        'ring-2 ring-transparent transition-all duration-200',
                                        'shadow-sm group-hover:shadow-md',
                                        color.bg,
                                        color.ring,
                                    )}
                                >
                                    <Icon
                                        className={cn('h-6 w-6 md:h-7 md:w-7', color.icon)}
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* Label */}
                                <span className="text-[11px] md:text-xs font-medium text-slate-600 text-center leading-tight group-hover:text-orange-500 transition-colors duration-150 line-clamp-2 w-full text-center">
                                    {collection.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
