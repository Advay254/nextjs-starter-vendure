'use client';

import {useState} from 'react';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import {Loader2, Truck} from 'lucide-react';
import {useRouter} from '@/i18n/navigation';
import {useCheckout} from '../checkout-provider';
import {setShippingMethod as setShippingMethodAction} from '../actions';
import {useTranslations, useLocale} from 'next-intl';
import {toIntlLocale} from '@/i18n/locale-utils';
import {cn} from '@/lib/utils';

interface DeliveryStepProps {
    onComplete: () => void;
}

export default function DeliveryStep({onComplete}: DeliveryStepProps) {
    const t = useTranslations('Checkout');
    const locale = useLocale();
    const intlLocale = toIntlLocale(locale);
    const router = useRouter();
    const {shippingMethods, order} = useCheckout();

    /* ── All state/logic — UNCHANGED ── */
    const [selectedMethodId, setSelectedMethodId] = useState<string | null>(() => {
        if (order.shippingLines && order.shippingLines.length > 0) {
            return order.shippingLines[0].shippingMethod.id;
        }
        return shippingMethods.length === 1 ? shippingMethods[0].id : null;
    });
    const [submitting, setSubmitting] = useState(false);

    const handleContinue = async () => {
        if (!selectedMethodId) return;
        setSubmitting(true);
        try {
            await setShippingMethodAction(selectedMethodId);
            router.refresh();
            onComplete();
        } catch (error) {
            console.error('Error setting shipping method:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (shippingMethods.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400 text-sm">
                {t('noShippingMethods')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {t('selectShippingMethod')}
            </p>

            <RadioGroup value={selectedMethodId || ''} onValueChange={setSelectedMethodId} className="space-y-2">
                {shippingMethods.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    return (
                        <Label key={method.id} htmlFor={method.id} className="cursor-pointer block">
                            <div className={cn(
                                'flex items-center justify-between gap-4 rounded-xl border-2 px-4 py-3.5 transition-all duration-150',
                                isSelected
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-slate-200 bg-white hover:border-orange-200',
                            )}>
                                <div className="flex items-center gap-3 flex-1">
                                    <RadioGroupItem value={method.id} id={method.id} className="text-orange-500" />
                                    <div className={cn(
                                        'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                                        isSelected ? 'bg-orange-100' : 'bg-slate-100',
                                    )}>
                                        <Truck className={cn('h-4 w-4', isSelected ? 'text-orange-500' : 'text-slate-400')} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{method.name}</p>
                                        {method.description && (
                                            <p className="text-xs text-slate-400 mt-0.5">{method.description}</p>
                                        )}
                                    </div>
                                </div>
                                <p className={cn('text-sm font-bold shrink-0', isSelected ? 'text-orange-500' : 'text-slate-700')}>
                                    {method.priceWithTax === 0
                                        ? <span className="text-emerald-600">{t('free')}</span>
                                        : (method.priceWithTax / 100).toLocaleString(intlLocale, {style: 'currency', currency: 'USD'})}
                                </p>
                            </div>
                        </Label>
                    );
                })}
            </RadioGroup>

            <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedMethodId || submitting}
                className="w-full mt-2 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('continueToPayment')}
            </button>
        </div>
    );
}
