'use client';

import Image from 'next/image';
import {ShoppingBag, Tag} from 'lucide-react';
import {Price} from '@/components/commerce/price';
import {useCheckout} from './checkout-provider';
import {useTranslations} from 'next-intl';

export default function OrderSummary() {
    const t = useTranslations('Checkout');
    const {order} = useCheckout();

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-[94px]">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <ShoppingBag className="h-4 w-4 text-orange-500" aria-hidden="true" />
                <h2 className="font-bold text-slate-800 text-sm">
                    {t('orderSummary')}
                    <span className="ml-1.5 text-xs font-normal text-slate-400">
                        ({order.totalQuantity}{' '}
                        {order.totalQuantity === 1 ? 'item' : 'items'})
                    </span>
                </h2>
            </div>

            {/* Line items */}
            <div className="divide-y divide-slate-50 max-h-[280px] overflow-y-auto">
                {order.lines.map((line) => {
                    /* Image lives at productVariant → product → featuredAsset */
                    const image =
                        line.productVariant.product?.featuredAsset?.preview;
                    const productName =
                        line.productVariant.product?.name ?? line.productVariant.name;
                    const variantName = line.productVariant.name;

                    return (
                        <div key={line.id} className="flex items-center gap-3 px-5 py-3">
                            {/* Thumbnail */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                {image ? (
                                    <Image
                                        src={image}
                                        alt={variantName}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag
                                            className="h-5 w-5 text-slate-300"
                                            aria-hidden="true"
                                        />
                                    </div>
                                )}
                                {/* Quantity badge */}
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-orange-500 text-white text-[10px] font-bold rounded-full border-2 border-white px-0.5">
                                    {line.quantity}
                                </span>
                            </div>

                            {/* Name + variant */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                                    {productName}
                                </p>
                                {variantName !== productName && (
                                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                        {variantName}
                                    </p>
                                )}
                            </div>

                            {/* Line price */}
                            <p className="text-xs font-bold text-slate-700 shrink-0">
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
            <div className="px-5 py-4 border-t border-slate-100 space-y-2.5">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('subtotal')}</span>
                    <span className="font-medium text-slate-700">
                        <Price
                            value={order.subTotalWithTax}
                            currencyCode={order.currencyCode}
                        />
                    </span>
                </div>

                {order.discounts?.map((discount, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="flex items-center gap-1 text-emerald-600">
                            <Tag className="h-3 w-3" aria-hidden="true" />
                            {discount.description}
                        </span>
                        <span className="font-medium text-emerald-600">
                            −
                            <Price
                                value={Math.abs(discount.amountWithTax)}
                                currencyCode={order.currencyCode}
                            />
                        </span>
                    </div>
                ))}

                {order.shippingLines && order.shippingLines.length > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t('shipping')}</span>
                        <span className="font-medium text-slate-700">
                            {order.shippingWithTax === 0 ? (
                                <span className="text-emerald-600 font-semibold">
                                    {t('free')}
                                </span>
                            ) : (
                                <Price
                                    value={order.shippingWithTax}
                                    currencyCode={order.currencyCode}
                                />
                            )}
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
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
    );
}
