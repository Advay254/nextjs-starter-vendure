'use client';

import {useState} from 'react';
import {Loader2, MapPin, Truck, CreditCard, Edit2, Mail, ShieldCheck} from 'lucide-react';
import {useCheckout} from '../checkout-provider';
import {placeOrder as placeOrderAction} from '../actions';
import {Price} from '@/components/commerce/price';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';

interface ReviewStepProps {
    onEditStep: (step: 'contact' | 'shipping' | 'delivery' | 'payment') => void;
}

function ReviewCard({
    icon: Icon,
    title,
    onEdit,
    editLabel,
    children,
}: {
    icon: React.ElementType;
    title: string;
    onEdit: () => void;
    editLabel: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-100 shrink-0">
                        <Icon className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600">{title}</h4>
                </div>
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                >
                    <Edit2 className="h-3 w-3" aria-hidden="true" />
                    {editLabel}
                </button>
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
        </div>
    );
}

export default function ReviewStep({onEditStep}: ReviewStepProps) {
    const t = useTranslations('Checkout');
    const {order, paymentMethods, selectedPaymentMethodCode, isGuest} = useCheckout();
    const [loading, setLoading] = useState(false);

    const selectedPaymentMethod = paymentMethods.find(
        (m) => m.code === selectedPaymentMethodCode,
    );

    /* ── Place order — UNCHANGED ── */
    const handlePlaceOrder = async () => {
        if (!selectedPaymentMethodCode) return;
        setLoading(true);
        try {
            await placeOrderAction(selectedPaymentMethodCode);
        } catch (error) {
            if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
            console.error('Error placing order:', error);
            setLoading(false);
        }
    };

    const canPlace =
        !!order.shippingAddress &&
        !!order.shippingLines?.length &&
        !!selectedPaymentMethodCode;

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {t('reviewYourOrder')}
            </p>

            {/* Summary cards */}
            <div className={cn('grid gap-3', isGuest ? 'sm:grid-cols-2' : 'sm:grid-cols-2')}>
                {/* Contact — guest only */}
                {isGuest && order.customer && (
                    <ReviewCard icon={Mail} title={t('contact')} onEdit={() => onEditStep('contact')} editLabel={t('edit')}>
                        <p className="font-semibold text-slate-700">
                            {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-slate-500">{order.customer.emailAddress}</p>
                    </ReviewCard>
                )}

                {/* Shipping address */}
                {order.shippingAddress && (
                    <ReviewCard icon={MapPin} title={t('shippingAddress')} onEdit={() => onEditStep('shipping')} editLabel={t('edit')}>
                        <p className="font-semibold text-slate-700">{order.shippingAddress.fullName}</p>
                        <p className="text-slate-500">
                            {order.shippingAddress.streetLine1}
                            {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
                        </p>
                        <p className="text-slate-500">
                            {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                            {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-slate-500">{order.shippingAddress.country}</p>
                        {order.shippingAddress.phoneNumber && (
                            <p className="text-slate-500">{order.shippingAddress.phoneNumber}</p>
                        )}
                    </ReviewCard>
                )}

                {/* Delivery method */}
                {order.shippingLines && order.shippingLines.length > 0 && (
                    <ReviewCard icon={Truck} title={t('deliveryMethod')} onEdit={() => onEditStep('delivery')} editLabel={t('edit')}>
                        <p className="font-semibold text-slate-700">
                            {order.shippingLines[0].shippingMethod.name}
                        </p>
                        <p className="text-slate-500">
                            {order.shippingLines[0].priceWithTax === 0
                                ? <span className="text-emerald-600 font-semibold">{t('free')}</span>
                                : <Price value={order.shippingLines[0].priceWithTax} currencyCode={order.currencyCode} />}
                        </p>
                    </ReviewCard>
                )}

                {/* Payment method */}
                {selectedPaymentMethod && (
                    <ReviewCard icon={CreditCard} title={t('paymentMethod')} onEdit={() => onEditStep('payment')} editLabel={t('edit')}>
                        <p className="font-semibold text-slate-700">{selectedPaymentMethod.name}</p>
                        {selectedPaymentMethod.description && (
                            <p className="text-slate-500">{selectedPaymentMethod.description}</p>
                        )}
                    </ReviewCard>
                )}
            </div>

            {/* Place order CTA */}
            <div className="pt-2 space-y-3">
                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading || !canPlace}
                    className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <ShieldCheck className="h-5 w-5" aria-hidden="true" />}
                    {t('placeOrder')}
                </button>

                {!canPlace && (
                    <p className="text-xs text-center text-red-500 font-medium">
                        {t('completeAllSteps')}
                    </p>
                )}

                <p className="text-[11px] text-center text-slate-400">
                    By placing your order you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
