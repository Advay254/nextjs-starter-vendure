'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { FragmentOf, readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/fragments';
import { Price } from '@/components/commerce/price';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
}

/** Five static stars — replace with real rating data when available in the fragment */
function StaticStars() {
    return (
        <div className="flex items-center gap-0.5" aria-label="4 out of 5 stars">
            {[1, 2, 3, 4].map((i) => (
                <Star
                    key={i}
                    className="h-3 w-3 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                />
            ))}
            <Star
                className="h-3 w-3 fill-slate-200 text-slate-200"
                aria-hidden="true"
            />
            <span className="ml-1 text-[11px] text-slate-400 leading-none">(24)</span>
        </div>
    );
}

export function ProductCard({ product: productProp }: ProductCardProps) {
    const t = useTranslations('Product');
    const product = readFragment(ProductCardFragment, productProp);

    /**
     * Detect a price range where min ≠ max — used to show the "from" prefix.
     * Swap in real discount/sale data here once the fragment exposes it.
     */
    const isPriceRange =
        product.priceWithTax.__typename === 'PriceRange' &&
        product.priceWithTax.min !== product.priceWithTax.max;

    const priceValue =
        product.priceWithTax.__typename === 'PriceRange'
            ? product.priceWithTax.min
            : product.priceWithTax.__typename === 'SinglePrice'
              ? product.priceWithTax.value
              : null;

    return (
        /**
         * <article> wrapper — NOT a link itself, so we can place both
         * <Link> and <button> elements as siblings without nesting
         * interactive elements (which is invalid HTML).
         */
        <article className="group relative flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200">

            {/* ── Wishlist button — absolutely positioned, sibling to links ── */}
            <button
                type="button"
                aria-label="Save to wishlist"
                onClick={(e) => {
                    // Placeholder: wire to wishlist mutation when available
                    e.preventDefault();
                }}
                className="absolute top-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm text-slate-300 hover:text-red-500 hover:bg-white border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150"
            >
                <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            {/* ── Image area — the link for product navigation ── */}
            <Link
                href={`/product/${product.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-square overflow-hidden bg-slate-50 shrink-0"
            >
                {product.productAsset ? (
                    <Image
                        src={product.productAsset.preview}
                        alt={product.productName}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-10 w-10 text-slate-200" aria-hidden="true" />
                    </div>
                )}

                {/* Hover overlay — "View Product" slide-up (desktop) */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out bg-orange-500/95 backdrop-blur-sm py-2.5 text-center text-[11px] font-bold uppercase tracking-widest text-white hidden md:block"
                >
                    View Product
                </div>
            </Link>

            {/* ── Product info ── */}
            <div className="flex flex-col gap-2 p-3 flex-1">

                {/* Name — separate link so it's independently focusable */}
                <Link
                    href={`/product/${product.slug}`}
                    className="group/name outline-none"
                >
                    <h3 className="text-[13px] font-medium text-slate-700 line-clamp-2 leading-snug group-hover/name:text-orange-500 transition-colors duration-150">
                        {product.productName}
                    </h3>
                </Link>

                {/* Static star rating — swap for real data when fragment exposes it */}
                <StaticStars />

                {/* Price */}
                <Suspense
                    fallback={
                        <div className="h-5 w-24 rounded bg-slate-100 animate-pulse" />
                    }
                >
                    <p className="text-[15px] font-bold text-orange-500 leading-none mt-auto">
                        {priceValue !== null ? (
                            <>
                                {isPriceRange && (
                                    <span className="text-[11px] font-normal text-slate-400 mr-1">
                                        {t('from')}
                                    </span>
                                )}
                                <Price
                                    value={priceValue}
                                    currencyCode={product.currencyCode}
                                />
                            </>
                        ) : null}
                    </p>
                </Suspense>

                {/* Mobile CTA — always visible; navigates to PDP where real add-to-cart lives */}
                <Link
                    href={`/product/${product.slug}`}
                    className="md:hidden mt-1 flex items-center justify-center gap-1.5 w-full rounded-lg border border-orange-500 text-orange-500 text-[11px] font-bold py-1.5 hover:bg-orange-500 hover:text-white active:scale-[0.97] transition-all duration-150"
                    aria-label={`View ${product.productName}`}
                >
                    <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('addToCart')}
                </Link>
            </div>
        </article>
    );
              }
