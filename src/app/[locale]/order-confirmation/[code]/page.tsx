import type {Metadata} from 'next';
import {Link} from '@/i18n/navigation';
import {query} from '@/lib/vendure/api';
import {GetOrderDetailQuery} from '@/lib/vendure/queries';
import {notFound} from 'next/navigation';
import {CheckCircle2, Package, MapPin, ShoppingBag, ArrowRight} from 'lucide-react';
import {Price} from '@/components/commerce/price';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/i18n/server';
import {noIndexRobots} from '@/lib/metadata';
import Image from 'next/image';

/* ── generateMetadata — UNCHANGED ── */
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'OrderConfirmation'});
    return {
        title: t('pageTitle'),
        robots: noIndexRobots(),
    };
}

export default async function OrderConfirmationPage({
    params,
}: PageProps<'/[locale]/order-confirmation/[code]'>) {
    const {code} = await params;
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'OrderConfirmation'});

    /* ── Data fetching — UNCHANGED ── */
    const result = await query(
        GetOrderDetailQuery,
        {code},
        {useAuthToken: true},
    );

    const order = result.data.orderByCode;
    if (!order) notFound();

    return (
        <div className="min-h-screen bg-slate-50 py-8 md:py-14">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                {/* ── Success hero ── */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50">
                            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
                            <CheckCircle2
                                className="h-10 w-10 text-emerald-500 relative z-10"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="mt-2 text-slate-500 text-sm">{t('thankYou')}</p>
                    <div className="inline-flex items-center gap-2 mt-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-full px-4 py-1.5 text-sm font-semibold">
                        <Package className="h-4 w-4" aria-hidden="true" />
                        {t('orderNumber', {code: order.code})}
                    </div>
                </div>

                {/* ── Order items card ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                        <ShoppingBag className="h-4 w-4 text-orange-500" aria-hidden="true" />
                        <h2 className="font-bold text-slate-700 text-sm">{t('orderItems')}</h2>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {order.lines.map((line) => {
                            const image = line.productVariant.product?.featuredAsset?.preview;
                            const productName = line.productVariant.product?.name ?? line.productVariant.name;
                            const variantName = line.productVariant.name;

                            return (
                                <div key={line.id} className="flex items-center gap-3 px-5 py-3.5">
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                        {image ? (
                                            <Image
                                                src={image}
                                                alt={variantName}
                                                fill
                                                className="object-cover"
                                                sizes="56px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag
                                                    className="h-5 w-5 text-slate-300"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 line-clamp-1">
                                            {productName}
                                        </p>
                                        {variantName !== productName && (
                                            <p className="text-xs text-slate-400 mt-0.5">{variantName}</p>
                                        )}
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {t('qty')}: {line.quantity}
                                        </p>
                                    </div>

                                    <p className="text-sm font-bold text-slate-700 shrink-0">
                                        <Price
                                            value={line.linePriceWithTax}
                                            currencyCode={order.currencyCode}
                                        />
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="px-5 py-4 border-t border-slate-100 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">{t('subtotal')}</span>
                            <span className="font-medium">
                                <Price
                                    value={order.subTotalWithTax}
                                    currencyCode={order.currencyCode}
                                />
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">{t('shipping')}</span>
                            <span className="font-medium">
                                {order.shippingWithTax === 0 ? (
                                    <span className="text-emerald-600 font-semibold">{t('free')}</span>
                                ) : (
                                    <Price
                                        value={order.shippingWithTax}
                                        currencyCode={order.currencyCode}
                                    />
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                            <span className="font-bold text-slate-800">{t('total')}</span>
                            <span className="text-xl font-black text-orange-500">
                                <Price
                                    value={order.totalWithTax}
                                    currencyCode={order.currencyCode}
                                />
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Shipping address card ── */}
                {order.shippingAddress && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                            <MapPin className="h-4 w-4 text-orange-500" aria-hidden="true" />
                            <h2 className="font-bold text-slate-700 text-sm">{t('deliveryAddress')}</h2>
                        </div>
                        <div className="px-5 py-4 text-sm text-slate-600 space-y-0.5">
                            <p className="font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.streetLine1}</p>
                            {order.shippingAddress.streetLine2 && (
                                <p>{order.shippingAddress.streetLine2}</p>
                            )}
                            <p>
                                {order.shippingAddress.city}
                                {order.shippingAddress.province
                                    ? `, ${order.shippingAddress.province}`
                                    : ''}
                                {order.shippingAddress.postalCode
                                    ? ` ${order.shippingAddress.postalCode}`
                                    : ''}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                            {order.shippingAddress.phoneNumber && (
                                <p>{order.shippingAddress.phoneNumber}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── CTAs ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/account/orders"
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-500 font-semibold text-sm transition-all duration-150"
                    >
                        {t('viewOrders')}
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-100 active:scale-[0.98] transition-all duration-150"
                    >
                        {t('continueShopping')}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
