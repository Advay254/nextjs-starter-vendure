'use client';

import { useState, useMemo, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, CheckCircle2, Star, Minus, Plus } from 'lucide-react';
import { addToCart } from '@/app/[locale]/product/[slug]/actions';
import { toast } from 'sonner';
import { Price } from '@/components/commerce/price';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        description: string;
        variants: Array<{
            id: string;
            name: string;
            sku: string;
            priceWithTax: number;
            stockLevel: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
                groupId: string;
                group: {
                    id: string;
                    code: string;
                    name: string;
                };
            }>;
        }>;
        optionGroups: Array<{
            id: string;
            code: string;
            name: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
            }>;
        }>;
    };
    searchParams: { [key: string]: string | string[] | undefined };
    currencyCode: string;
}

export function ProductInfo({ product, searchParams, currencyCode }: ProductInfoProps) {
    const t = useTranslations('Product');
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // ── All logic below is UNCHANGED from original ──

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {};
        product.optionGroups.forEach((group) => {
            const paramValue = searchParams[group.code];
            if (typeof paramValue === 'string') {
                const option = group.options.find((opt) => opt.code === paramValue);
                if (option) initialOptions[group.id] = option.id;
            }
        });
        return initialOptions;
    });

    const selectedVariant = useMemo(() => {
        if (product.variants.length === 1) return product.variants[0];
        if (Object.keys(selectedOptions).length !== product.optionGroups.length) return null;
        return product.variants.find((variant) => {
            const variantOptionIds = variant.options.map((opt) => opt.id);
            const selectedOptionIds = Object.values(selectedOptions);
            return selectedOptionIds.every((optId) => variantOptionIds.includes(optId));
        });
    }, [selectedOptions, product.variants, product.optionGroups]);

    const handleOptionChange = (groupId: string, optionId: string) => {
        setSelectedOptions((prev) => ({ ...prev, [groupId]: optionId }));
        const group = product.optionGroups.find((g) => g.id === groupId);
        const option = group?.options.find((opt) => opt.id === optionId);
        if (group && option) {
            const params = new URLSearchParams(currentSearchParams);
            params.set(group.code, option.code);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;
        startTransition(async () => {
            const result = await addToCart(selectedVariant.id, quantity);
            if (result.success) {
                setIsAdded(true);
                toast.success(t('addedToCartMessage'), {
                    description: t('addedToCartDescription', { name: product.name }),
                });
                setTimeout(() => setIsAdded(false), 2000);
            } else {
                toast.error(t('errorTitle'), {
                    description: result.error || t('errorAddToCart'),
                });
            }
        });
    };

    const isInStock = selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK';
    const canAddToCart = selectedVariant && isInStock;

    return (
        <div className="space-y-5">

            {/* ── Product name ── */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug tracking-tight">
                    {product.name}
                </h1>

                {/* Static stars — swap for real rating data when available */}
                <div className="flex items-center gap-1.5 mt-2">
                    {[1,2,3,4].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                    <Star className="h-4 w-4 fill-slate-200 text-slate-200" aria-hidden="true" />
                    <span className="text-xs text-slate-400 ml-0.5">(24 reviews)</span>
                </div>
            </div>

            {/* ── Price ── */}
            {selectedVariant && (
                <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-orange-500">
                        <Price value={selectedVariant.priceWithTax} currencyCode={currencyCode} />
                    </span>
                    {/* Placeholder strikethrough — replace with real original price when fragment exposes it */}
                </div>
            )}

            <Separator className="bg-slate-100" />

            {/* ── Short description ── */}
            <div
                className="prose prose-sm max-w-none text-slate-500 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* ── Option groups ── */}
            {product.optionGroups.length > 0 && (
                <div className="space-y-5">
                    {product.optionGroups.map((group) => (
                        <div key={group.id} className="space-y-2.5">
                            <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                {group.name}
                            </Label>
                            <RadioGroup
                                value={selectedOptions[group.id] || ''}
                                onValueChange={(value) => handleOptionChange(group.id, value)}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {group.options.map((option) => (
                                        <div key={option.id}>
                                            <RadioGroupItem
                                                value={option.id}
                                                id={option.id}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={option.id}
                                                className={cn(
                                                    'flex items-center justify-center min-w-[48px] px-4 py-2 rounded-full border-2 text-sm font-semibold cursor-pointer transition-all duration-150',
                                                    'border-slate-200 text-slate-600 bg-white hover:border-orange-300 hover:text-orange-500',
                                                    'peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-600 peer-data-[state=checked]:bg-orange-50 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-orange-200',
                                                )}
                                            >
                                                {option.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Stock badge ── */}
            {selectedVariant && (
                <div>
                    {isInStock ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                            {t('inStock')}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
                            {t('outOfStock')}
                        </span>
                    )}
                </div>
            )}

            {/* ── Quantity stepper + Add to Cart ── */}
            <div className="space-y-3 pt-1">
                {/* Quantity stepper */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-600">Qty:</span>
                    <div className="flex items-center border-2 border-slate-200 rounded-full overflow-hidden">
                        <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            className="flex items-center justify-center w-9 h-9 text-slate-500 hover:text-orange-500 disabled:opacity-30 transition-colors"
                        >
                            <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center font-bold text-slate-800 tabular-nums text-sm">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="flex items-center justify-center w-9 h-9 text-slate-500 hover:text-orange-500 transition-colors"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Add to Cart */}
                <button
                    type="button"
                    disabled={!canAddToCart || isPending}
                    onClick={handleAddToCart}
                    className={cn(
                        'w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150',
                        'active:scale-[0.98]',
                        canAddToCart && !isPending
                            ? isAdded
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                    )}
                >
                    {isAdded ? (
                        <>
                            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                            {t('addedToCart')}
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                            {isPending
                                ? t('adding')
                                : !selectedVariant && product.optionGroups.length > 0
                                    ? t('selectOptions')
                                    : !isInStock
                                        ? t('outOfStock')
                                        : t('addToCart')}
                        </>
                    )}
                </button>
            </div>

            {/* ── SKU ── */}
            {selectedVariant && (
                <p className="text-[11px] text-slate-400">
                    {t('sku', { sku: selectedVariant.sku })}
                </p>
            )}
        </div>
    );
}
