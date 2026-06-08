'use client';

import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import {CreditCard} from 'lucide-react';
import {useCheckout} from '../checkout-provider';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';

interface PaymentStepProps {
    onComplete: () => void;
}

export default function PaymentStep({onComplete}: PaymentStepProps) {
    const t = useTranslations('Checkout');
    const {paymentMethods, selectedPaymentMethodCode, setSelectedPaymentMethodCode} = useCheckout();

    /* ── Logic — UNCHANGED ── */
    const handleContinue = () => {
        if (!selectedPaymentMethodCode) return;
        onComplete();
    };

    if (paymentMethods.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400 text-sm">
                {t('noPaymentMethods')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {t('selectPaymentMethod')}
            </p>

            <RadioGroup
                value={selectedPaymentMethodCode || ''}
                onValueChange={setSelectedPaymentMethodCode}
                className="space-y-2"
            >
                {paymentMethods.map((method) => {
                    const isSelected = selectedPaymentMethodCode === method.code;
                    return (
                        <Label key={method.code} htmlFor={method.code} className="cursor-pointer block">
                            <div className={cn(
                                'flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150',
                                isSelected
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-slate-200 bg-white hover:border-orange-200',
                            )}>
                                <RadioGroupItem value={method.code} id={method.code} className="text-orange-500" />
                                <div className={cn(
                                    'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                                    isSelected ? 'bg-orange-100' : 'bg-slate-100',
                                )}>
                                    <CreditCard className={cn('h-4 w-4', isSelected ? 'text-orange-500' : 'text-slate-400')} aria-hidden="true" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-700">{method.name}</p>
                                    {method.description && (
                                        <p className="text-xs text-slate-400 mt-0.5">{method.description}</p>
                                    )}
                                </div>
                            </div>
                        </Label>
                    );
                })}
            </RadioGroup>

            <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedPaymentMethodCode}
                className="w-full mt-2 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-orange-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t('continueToReview')}
            </button>
        </div>
    );
}
