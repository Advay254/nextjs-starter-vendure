import type { Metadata } from 'next';
import { getRouteLocale } from '@/i18n/server';
import { getTranslations } from 'next-intl/server';
import { Cart } from '@/app/[locale]/cart/cart';
import { Suspense } from 'react';
import { CartSkeleton } from '@/components/shared/skeletons/cart-skeleton';
import { noIndexRobots } from '@/lib/metadata';
import { ShoppingCart } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Cart' });
    return {
        title: t('title'),
        robots: noIndexRobots(),
    };
}

export default async function CartPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Cart' });

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-5 py-6 md:py-10">

                {/* Page header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50">
                        <ShoppingCart className="h-5 w-5 text-orange-500" aria-hidden="true" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                        {t('title')}
                    </h1>
                </div>

                <Suspense fallback={<CartSkeleton />}>
                    <Cart />
                </Suspense>
            </div>
        </div>
    );
}
