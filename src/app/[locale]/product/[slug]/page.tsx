import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { query } from '@/lib/vendure/api';
import { GetProductDetailQuery } from '@/lib/vendure/queries';
import { ProductImageCarousel } from '@/components/commerce/product-image-carousel';
import { ProductInfo } from '@/components/commerce/product-info';
import { RelatedProducts } from '@/components/commerce/related-products';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import { routing } from '@/i18n/routing';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/metadata';
import { getTranslations } from 'next-intl/server';
import { toOgLocale } from '@/i18n/locale-utils';
import { getActiveCurrencyCode } from '@/lib/currency-server';
import { getRouteLocale } from '@/i18n/server';

/* ─── Data fetching — UNCHANGED ───────────────────────────────────── */
async function getProductData(slug: string, currencyCode: string) {
    'use cache';
    cacheLife('hours');
    const locale = await getRouteLocale();
    cacheTag(`product-${slug}-${locale}-${currencyCode}`);
    cacheTag('products');
    return await query(GetProductDetailQuery, { slug }, { languageCode: locale, currencyCode });
}

/* ─── generateMetadata — UNCHANGED ────────────────────────────────── */
export async function generateMetadata({
    params,
}: PageProps<'/[locale]/product/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const result = await getProductData(slug, currencyCode);
    const product = result.data.product;
    const t = await getTranslations({ locale, namespace: 'Product' });

    if (!product) return { title: t('notFound') };

    const description = truncateDescription(product.description);
    const fallbackDescription = t('shopProductAt', { name: product.name, siteName: SITE_NAME });
    const ogImage = product.assets?.[0]?.preview;
    const ogLocale = toOgLocale(locale);
    const productPath = `/product/${product.slug}`;

    return {
        title: product.name,
        description: description || fallbackDescription,
        alternates: {
            canonical: buildCanonicalUrl(`/${locale}${productPath}`),
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, buildCanonicalUrl(`/${l}${productPath}`)])
            ),
        },
        openGraph: {
            title: product.name,
            description: description || fallbackDescription,
            type: 'website',
            locale: ogLocale,
            url: buildCanonicalUrl(`/${locale}${productPath}`),
            images: buildOgImages(ogImage, product.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description || fallbackDescription,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default async function ProductDetailPage({
    params,
    searchParams,
}: PageProps<'/[locale]/product/[slug]'>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({ locale, namespace: 'Product' });

    const result = await getProductData(slug, currencyCode);
    const product = result.data.product;

    if (!product) notFound();

    const primaryCollection =
        product.collections?.find((c) => c.parent?.id) ?? product.collections?.[0];

    const TRUST_BADGES = [
        { icon: Truck,       label: t('trustBadges.fastShipping')  },
        { icon: RotateCcw,   label: t('trustBadges.freeReturns')   },
        { icon: ShieldCheck, label: t('trustBadges.secureCheckout') },
        { icon: Clock,       label: t('trustBadges.guarantee')      },
    ] as const;

    return (
        <>
            {/* ── Main product section ── */}
            <div className="max-w-screen-xl mx-auto px-3 sm:px-5 py-5 md:py-8">

                {/* Breadcrumb */}
                <Breadcrumb className="mb-5">
                    <BreadcrumbList className="text-xs">
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/" />} className="text-slate-400 hover:text-orange-500 transition-colors">
                                {t('home')}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {primaryCollection && (
                            <>
                                <BreadcrumbSeparator className="text-slate-300" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        render={<Link href={`/collection/${primaryCollection.slug}`} />}
                                        className="text-slate-400 hover:text-orange-500 transition-colors"
                                    >
                                        {primaryCollection.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </>
                        )}
                        <BreadcrumbSeparator className="text-slate-300" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-slate-600 font-medium line-clamp-1">
                                {product.name}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Image carousel */}
                    <div className="lg:sticky lg:top-[94px] lg:self-start">
                        <ProductImageCarousel images={product.assets} />
                    </div>

                    {/* Product info */}
                    <div>
                        <ProductInfo
                            product={product}
                            searchParams={searchParamsResolved}
                            currencyCode={currencyCode}
                        />
                    </div>
                </div>
            </div>

            {/* ── Trust badge strip ── */}
            <section className="border-y border-slate-100 bg-slate-50 py-5">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TRUST_BADGES.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2.5 bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm"
                            >
                                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-50 shrink-0">
                                    <Icon className="h-4.5 w-4.5 text-orange-500" aria-hidden="true" />
                                </div>
                                <span className="text-xs font-semibold text-slate-600 leading-tight">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ accordion ── */}
            <section className="py-10 md:py-14 bg-white">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-5 max-w-2xl">
                    <div className="text-center mb-7">
                        <h2 className="text-xl font-bold text-slate-800">{t('faq.title')}</h2>
                        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-orange-500" />
                    </div>
                    <Accordion className="w-full divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                        {[
                            { value: 'shipping',      q: t('faq.shipping.question'),      a: t('faq.shipping.answer')      },
                            { value: 'returns',       q: t('faq.returns.question'),       a: t('faq.returns.answer')       },
                            { value: 'tracking',      q: t('faq.tracking.question'),      a: t('faq.tracking.answer')      },
                            { value: 'international', q: t('faq.international.question'), a: t('faq.international.answer') },
                        ].map((item) => (
                            <AccordionItem key={item.value} value={item.value} className="bg-white px-5">
                                <AccordionTrigger className="text-sm font-semibold text-slate-700 hover:text-orange-500 py-4">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-4">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* ── Related products ── */}
            {primaryCollection && (
                <RelatedProducts
                    collectionSlug={primaryCollection.slug}
                    currentProductId={product.id}
                />
            )}
        </>
    );
}
