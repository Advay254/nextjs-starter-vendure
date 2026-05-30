/**
 * Shimmer skeleton that matches the redesigned ProductCard proportions
 * and the 2 / 3 / 4 column ProductGrid breakpoints.
 */
export function ProductGridSkeleton() {
    return (
        <div className="space-y-5">
            {/* Toolbar skeleton */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="h-4 w-28 rounded-md bg-slate-100 animate-pulse" />
                <div className="h-9 w-36 rounded-md bg-slate-100 animate-pulse" />
            </div>

            {/* Grid skeleton — 2 / 3 / 4 cols matching ProductGrid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden"
                    >
                        {/* Image placeholder */}
                        <div className="aspect-square bg-slate-100 animate-pulse" />

                        {/* Info area */}
                        <div className="p-3 flex flex-col gap-2">
                            {/* Name — two lines */}
                            <div className="space-y-1.5">
                                <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
                                <div className="h-3 w-3/4 rounded bg-slate-100 animate-pulse" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                    <div
                                        key={j}
                                        className="h-3 w-3 rounded-sm bg-slate-100 animate-pulse"
                                    />
                                ))}
                                <div className="h-3 w-6 rounded bg-slate-100 animate-pulse ml-1" />
                            </div>

                            {/* Price */}
                            <div className="h-4 w-20 rounded bg-slate-100 animate-pulse" />

                            {/* Mobile CTA (shows on small screens only) */}
                            <div className="md:hidden h-7 w-full rounded-lg bg-slate-100 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
