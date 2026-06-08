'use client';

import {useState} from 'react';
import {Check} from 'lucide-react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import ContactStep from './steps/contact-step';
import ShippingAddressStep from './steps/shipping-address-step';
import DeliveryStep from './steps/delivery-step';
import PaymentStep from './steps/payment-step';
import ReviewStep from './steps/review-step';
import OrderSummary from './order-summary';
import {useCheckout} from './checkout-provider';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';

type CheckoutStep = 'contact' | 'shipping' | 'delivery' | 'payment' | 'review';

export default function CheckoutFlow() {
    const t = useTranslations('Checkout');
    const {order, isGuest} = useCheckout();

    /* ── All step logic — UNCHANGED ── */
    const getStepOrder = (): CheckoutStep[] => {
        if (isGuest) return ['contact', 'shipping', 'delivery', 'payment', 'review'];
        return ['shipping', 'delivery', 'payment', 'review'];
    };

    const stepOrder = getStepOrder();

    const getInitialState = () => {
        const completed = new Set<CheckoutStep>();
        let current: CheckoutStep = stepOrder[0];

        if (isGuest) {
            if (order.customer?.emailAddress) {
                completed.add('contact');
                current = 'shipping';
            }
        }

        if (order.shippingAddress?.streetLine1 && order.shippingAddress?.country) {
            if (!isGuest || completed.has('contact')) {
                completed.add('shipping');
                current = 'delivery';
            }
        }

        if (order.shippingLines && order.shippingLines.length > 0) {
            if (completed.has('shipping')) {
                completed.add('delivery');
                current = 'payment';
            }
        }

        return {completed, current};
    };

    const initialState = getInitialState();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialState.current);
    const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(initialState.completed);

    const handleStepComplete = (step: CheckoutStep) => {
        setCompletedSteps((prev) => new Set([...prev, step]));
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const canAccessStep = (step: CheckoutStep): boolean => {
        const stepIndex = stepOrder.indexOf(step);
        if (stepIndex === 0) return true;
        const previousStep = stepOrder[stepIndex - 1];
        return completedSteps.has(previousStep);
    };

    const getStepNumber = (step: CheckoutStep): number => stepOrder.indexOf(step) + 1;

    const stepLabels: Record<CheckoutStep, string> = {
        contact:  t('steps.contact'),
        shipping: t('steps.address'),
        delivery: t('steps.delivery'),
        payment:  t('steps.payment'),
        review:   t('steps.review'),
    };

    /* ── Step circle helper ── */
    function StepCircle({step, size = 'lg'}: {step: CheckoutStep; size?: 'sm' | 'lg'}) {
        const done    = completedSteps.has(step);
        const active  = currentStep === step;
        const dim     = size === 'lg' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs';

        return (
            <div className={cn(
                'flex items-center justify-center rounded-full font-bold shrink-0 transition-all duration-300',
                dim,
                done  && 'bg-emerald-500 text-white',
                active && !done && 'bg-orange-500 text-white ring-4 ring-orange-100',
                !done && !active && 'bg-slate-100 text-slate-400',
            )}>
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : getStepNumber(step)}
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-8">

            {/* ── Left: Steps ── */}
            <div className="lg:col-span-2 space-y-4">

                {/* Progress bar — desktop only */}
                <div className="hidden sm:flex items-center mb-6">
                    {stepOrder.map((step, index) => (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <StepCircle step={step} />
                                <span className={cn(
                                    'text-[11px] font-semibold whitespace-nowrap',
                                    (completedSteps.has(step) || currentStep === step)
                                        ? 'text-slate-700'
                                        : 'text-slate-400',
                                )}>
                                    {stepLabels[step]}
                                </span>
                            </div>
                            {index < stepOrder.length - 1 && (
                                <div className="flex-1 mx-2 mb-5">
                                    <div className={cn(
                                        'h-0.5 w-full rounded-full transition-colors duration-300',
                                        completedSteps.has(step) ? 'bg-emerald-400' : 'bg-slate-200',
                                    )} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Accordion steps */}
                <Accordion
                    value={[currentStep]}
                    onValueChange={(value) => {
                        const step = value[0] as CheckoutStep | undefined;
                        if (step && canAccessStep(step)) setCurrentStep(step);
                    }}
                    className="space-y-3"
                >
                    {/* Contact (guest only) */}
                    {isGuest && (
                        <AccordionItem
                            value="contact"
                            className="bg-white border border-slate-100 rounded-2xl px-5 shadow-sm overflow-hidden"
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <StepCircle step="contact" size="sm" />
                                    <span className="text-sm font-bold text-slate-700">{t('contactInformation')}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-5">
                                <ContactStep onComplete={() => handleStepComplete('contact')} />
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Shipping */}
                    <AccordionItem
                        value="shipping"
                        className={cn(
                            'bg-white border border-slate-100 rounded-2xl px-5 shadow-sm overflow-hidden',
                            !canAccessStep('shipping') && 'opacity-50 pointer-events-none',
                        )}
                        disabled={!canAccessStep('shipping')}
                    >
                        <AccordionTrigger className="hover:no-underline py-4" disabled={!canAccessStep('shipping')}>
                            <div className="flex items-center gap-3">
                                <StepCircle step="shipping" size="sm" />
                                <span className="text-sm font-bold text-slate-700">{t('shippingAddress')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                            <ShippingAddressStep onComplete={() => handleStepComplete('shipping')} />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Delivery */}
                    <AccordionItem
                        value="delivery"
                        className={cn(
                            'bg-white border border-slate-100 rounded-2xl px-5 shadow-sm overflow-hidden',
                            !canAccessStep('delivery') && 'opacity-50 pointer-events-none',
                        )}
                        disabled={!canAccessStep('delivery')}
                    >
                        <AccordionTrigger className="hover:no-underline py-4" disabled={!canAccessStep('delivery')}>
                            <div className="flex items-center gap-3">
                                <StepCircle step="delivery" size="sm" />
                                <span className="text-sm font-bold text-slate-700">{t('deliveryMethod')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                            <DeliveryStep onComplete={() => handleStepComplete('delivery')} />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Payment */}
                    <AccordionItem
                        value="payment"
                        className={cn(
                            'bg-white border border-slate-100 rounded-2xl px-5 shadow-sm overflow-hidden',
                            !canAccessStep('payment') && 'opacity-50 pointer-events-none',
                        )}
                        disabled={!canAccessStep('payment')}
                    >
                        <AccordionTrigger className="hover:no-underline py-4" disabled={!canAccessStep('payment')}>
                            <div className="flex items-center gap-3">
                                <StepCircle step="payment" size="sm" />
                                <span className="text-sm font-bold text-slate-700">{t('paymentMethod')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                            <PaymentStep onComplete={() => handleStepComplete('payment')} />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Review */}
                    <AccordionItem
                        value="review"
                        className={cn(
                            'bg-white border border-slate-100 rounded-2xl px-5 shadow-sm overflow-hidden',
                            !canAccessStep('review') && 'opacity-50 pointer-events-none',
                        )}
                        disabled={!canAccessStep('review')}
                    >
                        <AccordionTrigger className="hover:no-underline py-4" disabled={!canAccessStep('review')}>
                            <div className="flex items-center gap-3">
                                <StepCircle step="review" size="sm" />
                                <span className="text-sm font-bold text-slate-700">{t('reviewAndPlaceOrder')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                            <ReviewStep onEditStep={setCurrentStep} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* ── Right: Order summary ── */}
            <div className="lg:col-span-1">
                <OrderSummary />
            </div>
        </div>
    );
}
