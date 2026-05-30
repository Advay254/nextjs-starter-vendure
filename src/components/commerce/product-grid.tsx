import { ResultOf } from '@/graphql';
import { ProductCard } from './product-card';
import { Pagination } from '@/components/shared/pagination';
import { SortDropdown } from './sort-dropdown';
import { SearchProductsQuery } from '@/lib/vendure/queries';
import { getRouteLocale } from '@/i18n/server';
import { getTranslations } from 'next-intl/server';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    currentPage: number;
    take: number;
}

export async function ProductGrid({
    productDataPromise,
    currentPage,
    take,
}: ProductGridProps) {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Product' });
    const result = await productDataPromise;

    const searchResult = result.data.search;
    const totalPages = Math.ceil(searchResult.totalItems / take);

    /* ── Empty state ── */
    if (!searchResult.items.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-50">
                    <PackageSearch
                        className="h-8 w-8 text-orange-400"
                        aria-hidden="true"
                    />
                </div>
                <div className="space-y-1">
                    <p className="font-semibold text-slate-700">
                        {t('noProductsFound')}
                    </p>
                    <p className="text-sm text-slate-400">
                        Try adjusting your search or filters
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* ── Toolbar: count + sort ── */}
            <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                    <span className="font-bold text-slate-800">
                        {searchResult.totalItems}
                    </span>{' '}
                    {t('productCount', { count: searchResult.totalItems })}
                </p>
                <SortDropdown />
            </div>

            {/* ── Product grid ── */}
            {/*
             * 2 columns on mobile (tight marketplace density),
             * 3 on sm/tablet, 4 on lg/desktop.
             * Gap scales from 3 (12 px) on mobile to 4 (16 px) on desktop.
             */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                {searchResult.items.map((product, i) => (
                    <ProductCard
                        key={'product-grid-item-' + i}
                        product={product}
                    />
                ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="pt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </div>
    );
}
