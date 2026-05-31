import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Tag } from 'lucide-react';
import { Price } from '@/components/commerce/price';
import { getTranslations } from 'next-intl/server';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    discounts?: Array<{
        description: string;
        amountWithTax: number;
    }> | null;
};

export async function OrderSummary({ activeOrder }: { activeOrder: ActiveOrder }) {
    const t = await getTranslations('Cart');

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-[94px]">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">{t('orderSummary')}</h2>
            </div>

            {/* Line items */}
            <div className="px-5 py-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('subtotal')}</span>
                    <span className="font-medium text-slate-700">
                        <Price value={activeOrder.subTotalWithTax} currencyCode={activeOrder.currencyCode} />
                    </span>
                </div>

                {activeOrder.discounts?.map((discount, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="flex items-center gap-1 text-emerald-600">
                            <Tag className="h-3 w-3" aria-hidden="true" />
                            {discount.description}
                        </span>
                        <span className="font-medium text-emerald-600">
                            −<Price value={Math.abs(discount.amountWithTax)} currencyCode={activeOrder.currencyCode} />
                        </span>
                    </div>
                ))}

                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('shipping')}</span>
                    <span className="font-medium text-slate-700">
                        {activeOrder.shippingWithTax > 0
                            ? <Price value={activeOrder.shippingWithTax} currencyCode={activeOrder.currencyCode} />
                            : <span className="text-xs text-slate-400">{t('calculatedAtCheckout')}</span>
                        }
                    </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 mt-1">
                    <span className="font-bold text-slate-800">{t('total')}</span>
                    <span className="text-xl font-black text-orange-500">
                        <Price value={activeOrder.totalWithTax} currencyCode={activeOrder.currencyCode} />
                    </span>
                </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5 space-y-2.5">
                <Button
                    render={<Link href="/checkout" />}
                    nativeButton={false}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-100 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98]"
                    size="lg"
                >
                    {t('proceedToCheckout')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    {t('secureCheckout')}
                </div>

                <Button
                    render={<Link href="/" />}
                    nativeButton={false}
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-colors"
                >
                    {t('continueShopping')}
                </Button>
            </div>
        </div>
    );
}
