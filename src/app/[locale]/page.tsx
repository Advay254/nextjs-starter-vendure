import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getRouteLocale } from '@/i18n/server';
import { getTranslations } from 'next-intl/server';
import { toOgLocale } from '@/i18n/locale-utils';
import { BadgeCheck, Tag, Zap, Truck, RotateCcw, Shield } from 'lucide-react';
import { HeroSection } from '@/components/layout/hero-section';
import { FeaturedProducts } from '@/components/commerce/featured-products';
import { CategoryGrid } from '@/components/layout/category-grid';
import { PromoBanner } from '@/components/layout/promo-banner';
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from '@/lib/metadata';

/* ─────────────────────────────────────────────
   generateMetadata — UNCHANGED from original
───────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Home' });
    const ogLocale = toOgLocale(locale);

    return {
        title: {
            absolute: `${SITE_NAME} - ${t('pageTitle')}`,
        },
        description: t('description'),
        alternates: {
            canonical: buildCanonicalUrl('/'),
        },
        openGraph: {
            title: `${SITE_NAME} - ${t('pageTitle')}`,
            description: t('ogDescription'),
            type: 'website',
            locale: ogLocale,
            url: SITE_URL,
        },
    };
}

/* ─────────────────────────────────────────────
   Feature card data — same keys as original
───────────────────────────────────────────── */
const featureKeys = [
    { icon: BadgeCheck, key: 'highQuality' },
    { icon: Tag,        key: 'bestPrices'  },
    { icon: Zap,        key: 'fastDelivery'},
] as const;

/** Trust-badge strip (separate from the feature cards below the fold) */
const TRUST_BADGES = [
    { icon: Truck,      label: 'Fast Delivery',    sub: 'Free over KES 5,000' },
    { icon: RotateCcw,  label: 'Easy Returns',     sub: '30-day return policy' },
    { icon: Shield,     label: 'Secure Checkout',  sub: '256-bit SSL encryption' },
    { icon: BadgeCheck, label: 'Genuine Products', sub: '100% authentic goods'  },
] as const;

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default async function Home() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Home' });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* 1 ── Hero carousel */}
            <HeroSection />

            {/* 2 ── Trust-badge strip */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
                        {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 px-4 py-3.5"
                            >
                                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-50 shrink-0">
                                    <Icon
                                        className="h-4.5 w-4.5 text-orange-500"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] font-bold text-slate-700 leading-tight truncate">
                                        {label}
                                    </p>
                                    <p className="text-[11px] text-slate-400 leading-tight truncate">
                                        {sub}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3 ── Category grid — real data from getTopCollections */}
            <Suspense
                fallback={
                    <div className="py-6 bg-white">
                        <div className="max-w-screen-xl mx-auto px-3 sm:px-5">
                            <div className="flex gap-3 overflow-hidden">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="shrink-0 w-[72px] flex flex-col items-center gap-2"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 animate-pulse" />
                                        <div className="h-3 w-12 rounded bg-slate-100 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            >
                <CategoryGrid />
            </Suspense>

            {/* 4 ── Featured products — unchanged FeaturedProducts component */}
            <div className="bg-white pt-2 pb-4">
                <Suspense>
                    <FeaturedProducts />
                </Suspense>
            </div>

            {/* 5 ── Flash sale promo banner */}
            <PromoBanner />

            {/* 6 ── "Why Shop With Us" — same keys as original, restyled */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-5">
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                            {t('whyShopWithUs')}
                        </h2>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-orange-500" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {featureKeys.map((feature) => (
                            <div
                                key={feature.key}
                                className="group relative flex flex-col items-center text-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white p-7 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-250"
                            >
                                {/* Icon */}
                                <div className="flex items-center justify-center w-13 h-13 rounded-xl bg-orange-50 group-hover:bg-orange-100 transition-colors duration-200">
                                    <feature.icon
                                        className="h-6 w-6 text-orange-500"
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="text-[15px] font-bold text-slate-800">
                                    {t(`features.${feature.key}.title`)}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {t(`features.${feature.key}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
