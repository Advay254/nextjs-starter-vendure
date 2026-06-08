'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Field, FieldLabel, FieldError, FieldGroup} from '@/components/ui/field';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useForm} from 'react-hook-form';
import {Loader2, AlertCircle} from 'lucide-react';
import {Link, useRouter} from '@/i18n/navigation';
import {setCustomerForOrder, SetCustomerForOrderResult} from '../actions';
import {useTranslations} from 'next-intl';

interface ContactStepProps {
    onComplete: () => void;
}

interface ContactFormData {
    emailAddress: string;
    firstName: string;
    lastName: string;
}

export default function ContactStep({onComplete}: ContactStepProps) {
    const t = useTranslations('Checkout');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<SetCustomerForOrderResult | null>(null);

    const {register, handleSubmit, formState: {errors}} = useForm<ContactFormData>();

    /* ── Error message logic — UNCHANGED ── */
    function getErrorMessage(error: SetCustomerForOrderResult) {
        if (error.success) return null;
        switch (error.errorCode) {
            case 'EMAIL_CONFLICT':
                return (
                    <>
                        {t('emailConflict')}{' '}
                        <Link href="/sign-in?redirectTo=/checkout" className="underline hover:no-underline font-semibold">
                            {t('emailConflictSignIn')}
                        </Link>{' '}
                        {t('emailConflictSuffix')}
                    </>
                );
            case 'GUEST_CHECKOUT_DISABLED':
                return t('guestCheckoutDisabled');
            case 'NO_ACTIVE_ORDER':
                return (
                    <>
                        {t('cartEmpty')}{' '}
                        <Link href="/" className="underline hover:no-underline font-semibold">
                            {t('cartEmptyShop')}
                        </Link>
                    </>
                );
            default:
                return error.message;
        }
    }

    /* ── Submit logic — UNCHANGED ── */
    const onSubmit = async (data: ContactFormData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await setCustomerForOrder(data);
            if (result.success) {
                router.refresh();
                onComplete();
            } else {
                setError(result);
            }
        } catch (err) {
            console.error('Error setting customer:', err);
            setError({success: false, errorCode: 'UNKNOWN', message: t('unexpectedError')});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <p className="text-sm text-slate-500">
                {t('alreadyHaveAccount')}{' '}
                <Link href="/sign-in?redirectTo=/checkout" className="text-orange-500 font-semibold hover:underline">
                    {t('signInLink')}
                </Link>
            </p>

            {error && !error.success && (
                <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{getErrorMessage(error)}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <Field className="col-span-2">
                            <FieldLabel htmlFor="emailAddress" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                {t('emailAddress')}
                            </FieldLabel>
                            <Input
                                id="emailAddress"
                                type="email"
                                className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                {...register('emailAddress', {
                                    required: t('emailRequired'),
                                    pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t('invalidEmail')},
                                })}
                            />
                            <FieldError>{errors.emailAddress?.message}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="firstName" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                {t('firstName')}
                            </FieldLabel>
                            <Input
                                id="firstName"
                                className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                {...register('firstName', {required: t('firstNameRequired')})}
                            />
                            <FieldError>{errors.firstName?.message}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lastName" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                {t('lastName')}
                            </FieldLabel>
                            <Input
                                id="lastName"
                                className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                {...register('lastName', {required: t('lastNameRequired')})}
                            />
                            <FieldError>{errors.lastName?.message}</FieldError>
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t('continue')}
                    </button>
                </FieldGroup>
            </form>
        </div>
    );
}
