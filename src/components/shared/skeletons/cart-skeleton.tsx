import { Skeleton } from '@/components/ui/skeleton';

export function CartSkeleton() {
    return (
        <div className="grid lg:grid-cols-3 gap-5">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex gap-4 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                    >
                        <Skeleton className="h-24 w-24 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/3" />
                            <div className="flex items-center gap-2 pt-2">
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-16 shrink-0" />
                    </div>
                ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="px-5 py-4 space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-14" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-100">
                            <Skeleton className="h-5 w-12" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <div className="px-5 pb-5 space-y-2.5">
                        <Skeleton className="h-11 w-full rounded-xl" />
                        <Skeleton className="h-9 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
