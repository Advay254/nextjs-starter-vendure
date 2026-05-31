import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Price } from '@/components/commerce/price';
import { removeFromCart, adjustQuantity } from './actions';
import { getTranslations } from 'next-intl/server';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    lines: Array<{
        id: string;
        quantity: number;
        unitPriceWithTax: number;
        linePriceWithTax: number;
        productVariant: {
            id: string;
            name: string;
            sku: string;
            product: {
                name: string;
                slug: string;
                featuredAsset?: { preview: string } | null;
            };
        };
    }>;
};

export async function CartItems({ activeOrder }: { activeOrder: ActiveOrder | null }) {
    const t = await getTranslations('Cart');

    /* ── Empty state ── */
    if (!activeOrder || activeOrder.lines.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-50">
                    <ShoppingBag className="h-8 w-8 text-orange-400" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-700">{t('empty')}</h2>
                    <p className="text-sm text-slate-400">{t('emptyMessage')}</p>
                </div>
                <Button
                    render={<Link href="/" />}
                    nativeButton={false}
                    className="mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 font-semibold shadow-md shadow-orange-100"
                >
                    {t('continueShopping')}
                </Button>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 space-y-3">
            {activeOrder.lines.map((line) => (
                <div
                    key={line.id}
                    className="flex gap-3 sm:gap-4 bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    {/* Thumbnail */}
                    {line.productVariant.product.featuredAsset ? (
                        <Link
                            href={`/product/${line.productVariant.product.slug}`}
                            className="shrink-0"
                        >
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100">
                                <Image
                                    src={line.productVariant.product.featuredAsset.preview}
                                    alt={line.productVariant.name}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    sizes="96px"
                                />
                            </div>
                        </Link>
                    ) : (
                        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-slate-300" aria-hidden="true" />
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <Link
                            href={`/product/${line.productVariant.product.slug}`}
                            className="text-sm font-semibold text-slate-800 hover:text-orange-500 transition-colors line-clamp-2 leading-snug"
                        >
                            {line.productVariant.product.name}
                        </Link>

                        {line.productVariant.name !== line.productVariant.product.name && (
                            <p className="text-xs text-slate-400">{line.productVariant.name}</p>
                        )}

                        <p className="text-xs text-slate-400">{t('sku', { sku: line.productVariant.sku })}</p>

                        {/* Unit price (mobile) */}
                        <p className="text-xs text-slate-400 sm:hidden mt-0.5">
                            <Price value={line.unitPriceWithTax} currencyCode={activeOrder.currencyCode} />{' '}
                            {t('each')}
                        </p>

                        {/* Stepper + delete */}
                        <div className="flex items-center gap-2 mt-auto pt-1">
                            <div className="flex items-center border-2 border-slate-200 rounded-full overflow-hidden">
                                <form
                                    action={async () => {
                                        'use server';
                                        await adjustQuantity(line.id, Math.max(1, line.quantity - 1));
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-slate-500 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                                        disabled={line.quantity <= 1}
                                    >
                                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Button>
                                </form>
                                <span className="w-8 text-center text-sm font-bold tabular-nums text-slate-800">
                                    {line.quantity}
                                </span>
                                <form
                                    action={async () => {
                                        'use server';
                                        await adjustQuantity(line.id, line.quantity + 1);
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-slate-500 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Button>
                                </form>
                            </div>

                            <form
                                action={async () => {
                                    'use server';
                                    await removeFromCart(line.id);
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    aria-label="Remove item"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Line price (desktop) */}
                    <div className="hidden sm:flex flex-col items-end justify-between shrink-0">
                        <p className="font-bold text-base text-slate-800">
                            <Price value={line.linePriceWithTax} currencyCode={activeOrder.currencyCode} />
                        </p>
                        <p className="text-xs text-slate-400">
                            <Price value={line.unitPriceWithTax} currencyCode={activeOrder.currencyCode} />{' '}
                            {t('each')}
                        </p>
                    </div>

                    {/* Line price (mobile — bottom right) */}
                    <div className="sm:hidden flex items-end shrink-0">
                        <p className="font-bold text-sm text-orange-500">
                            <Price value={line.linePriceWithTax} currencyCode={activeOrder.currencyCode} />
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
