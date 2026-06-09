'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Field, FieldLabel, FieldError, FieldGroup} from '@/components/ui/field';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import {CountrySelect} from '@/components/shared/country-select';
import {Loader2, MapPin, Plus} from 'lucide-react';
import {useRouter} from '@/i18n/navigation';
import {useCheckout} from '../checkout-provider';
import {setShippingAddress} from '../actions';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';

interface ShippingAddressStepProps {
    onComplete: () => void;
}

interface ShippingFormData {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province?: string;
    postalCode?: string;
    countryCode: string;
    phoneNumber?: string;
}

export default function ShippingAddressStep({onComplete}: ShippingAddressStepProps) {
    const t = useTranslations('Checkout');
    const router = useRouter();
    const {addresses, countries, order} = useCheckout();

    const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        addresses.length > 0
            ? (addresses.find((a) => a.defaultShippingAddress)?.id ?? addresses[0]?.id ?? null)
            : null,
    );
    const [submitting, setSubmitting] = useState(false);

    const existingAddress = order.shippingAddress;

    const defaultValues: Partial<ShippingFormData> = {
        fullName: existingAddress?.fullName || '',
        streetLine1: existingAddress?.streetLine1 || '',
        streetLine2: existingAddress?.streetLine2 || '',
        city: existingAddress?.city || '',
        province: existingAddress?.province || '',
        postalCode: existingAddress?.postalCode || '',
        /*
         * shippingAddress.country is a name string (e.g. "Kenya"), not a code.
         * Resolve back to code by matching against the available countries list —
         * same pattern as the original shipping-address-step.
         */
        countryCode:
            countries.find((c) => c.name === existingAddress?.country)?.code ||
            countries[0]?.code ||
            '',
        phoneNumber: existingAddress?.phoneNumber || '',
    };

    const {register, handleSubmit, formState: {errors}} = useForm<ShippingFormData>({defaultValues});

    const onSubmit = async (data: ShippingFormData) => {
        setSubmitting(true);
        try {
            if (!useNewAddress && selectedAddressId) {
                const addr = addresses.find((a) => a.id === selectedAddressId);
                if (addr) {
                    await setShippingAddress({
                        fullName:
                            addr.fullName?.trim() ||
                            `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
                        streetLine1: addr.streetLine1 ?? '',
                        streetLine2: addr.streetLine2 || '',
                        city: addr.city ?? '',
                        province: addr.province || '',
                        postalCode: addr.postalCode || '',
                        countryCode: addr.country?.code ?? data.countryCode,
                        phoneNumber: addr.phoneNumber || '',
                    });
                }
            } else {
                await setShippingAddress(data);
            }
            router.refresh();
            onComplete();
        } catch (error) {
            console.error('Error setting shipping address:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Saved addresses */}
            {addresses.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        {t('savedAddresses')}
                    </p>
                    <RadioGroup
                        value={useNewAddress ? 'new' : (selectedAddressId || '')}
                        onValueChange={(val) => {
                            if (val === 'new') {
                                setUseNewAddress(true);
                                setSelectedAddressId(null);
                            } else {
                                setUseNewAddress(false);
                                setSelectedAddressId(val);
                            }
                        }}
                        className="space-y-2"
                    >
                        {addresses.map((addr) => (
                            <Label key={addr.id} htmlFor={addr.id} className="cursor-pointer block">
                                <div className={cn(
                                    'flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150',
                                    !useNewAddress && selectedAddressId === addr.id
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-slate-200 bg-white hover:border-orange-200',
                                )}>
                                    <RadioGroupItem
                                        value={addr.id}
                                        id={addr.id}
                                        className="mt-0.5 text-orange-500"
                                    />
                                    <div className="flex items-start gap-2 flex-1">
                                        <MapPin className={cn(
                                            'h-4 w-4 mt-0.5 shrink-0',
                                            !useNewAddress && selectedAddressId === addr.id
                                                ? 'text-orange-500'
                                                : 'text-slate-400',
                                        )} aria-hidden="true" />
                                        <div className="text-sm">
                                            <p className="font-semibold text-slate-700">{addr.fullName}</p>
                                            <p className="text-slate-500">{addr.streetLine1}</p>
                                            {addr.streetLine2 && (
                                                <p className="text-slate-500">{addr.streetLine2}</p>
                                            )}
                                            <p className="text-slate-500">
                                                {addr.city}
                                                {addr.province ? `, ${addr.province}` : ''}{' '}
                                                {addr.postalCode}
                                            </p>
                                            <p className="text-slate-500">{addr.country?.name}</p>
                                        </div>
                                    </div>
                                    {addr.defaultShippingAddress && (
                                        <span className="text-[10px] font-bold text-orange-500 bg-orange-100 rounded-full px-2 py-0.5 shrink-0">
                                            Default
                                        </span>
                                    )}
                                </div>
                            </Label>
                        ))}

                        {/* New address option */}
                        <Label htmlFor="new" className="cursor-pointer block">
                            <div className={cn(
                                'flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150',
                                useNewAddress
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-slate-200 bg-white hover:border-orange-200',
                            )}>
                                <RadioGroupItem value="new" id="new" className="text-orange-500" />
                                <Plus className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                <span className="text-sm font-semibold text-slate-700">
                                    {t('addNewAddress')}
                                </span>
                            </div>
                        </Label>
                    </RadioGroup>
                </div>
            )}

            {/* New address form */}
            {useNewAddress && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="fullName" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('fullName')}
                                </FieldLabel>
                                <Input
                                    id="fullName"
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    {...register('fullName', {required: t('fullNameRequired')})}
                                />
                                <FieldError>{errors.fullName?.message}</FieldError>
                            </Field>

                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="streetLine1" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('streetAddress')}
                                </FieldLabel>
                                <Input
                                    id="streetLine1"
                                    placeholder={t('streetAddressPlaceholder')}
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    {...register('streetLine1', {required: t('streetAddressRequired')})}
                                />
                                <FieldError>{errors.streetLine1?.message}</FieldError>
                            </Field>

                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="streetLine2" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('apartment')}
                                </FieldLabel>
                                <Input
                                    id="streetLine2"
                                    placeholder={t('apartmentPlaceholder')}
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    {...register('streetLine2')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="city" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('city')}
                                </FieldLabel>
                                <Input
                                    id="city"
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    {...register('city', {required: t('cityRequired')})}
                                />
                                <FieldError>{errors.city?.message}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="province" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('province')}
                                </FieldLabel>
                                <Input
                                    id="province"
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    {...register('province')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="postalCode" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('postalCode')}
                                </FieldLabel>
                                <Input
                                    id="postalCode"
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    {...register('postalCode')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('phoneNumber')}
                                </FieldLabel>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    {...register('phoneNumber')}
                                />
                            </Field>

                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="countryCode" className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {t('country')}
                                </FieldLabel>
                                <CountrySelect
                                    id="countryCode"
                                    className="rounded-xl border-slate-200 focus-visible:ring-orange-400"
                                    countries={countries}
                                    {...register('countryCode', {required: t('countryRequired')})}
                                />
                                <FieldError>{errors.countryCode?.message}</FieldError>
                            </Field>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t('continueToDelivery')}
                        </button>
                    </FieldGroup>
                </form>
            )}

            {/* Continue with saved address */}
            {!useNewAddress && selectedAddressId && (
                <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={submitting}
                    className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t('continueToDelivery')}
                </button>
            )}
        </div>
    );
}
