import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/i18n/server';
import { HeroCarousel, HeroSlide } from '@/components/layout/hero-carousel';

/**
 * Slide definitions live here so they can be swapped for CMS data later.
 * Gradients use only Tailwind classes — no external images required.
 * When real product images are available, add a `bgImage` field and
 * render it as an absolutely-positioned <Image fill> behind the gradient.
 */
const SLIDES: Omit<HeroSlide, 'cta' | 'ctaHref'>[] = [
    {
        id: 'slide-flash',
        headline: 'Flash Sale — Up to 60% Off',
        sub: 'Unbeatable prices on electronics, fashion, and home essentials. Today only.',
        secondaryCta: 'View All Deals',
        secondaryHref: '/search',
        gradient: 'bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400',
        accentColor: 'bg-slate-900 hover:bg-slate-800',
    },
    {
        id: 'slide-new',
        headline: 'New Season Arrivals',
        sub: 'Fresh styles landing every week. Be the first to shop the latest trends.',
        secondaryCta: 'Explore Now',
        secondaryHref: '/search',
        gradient: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600',
        accentColor: 'bg-orange-500 hover:bg-orange-600',
    },
    {
        id: 'slide-delivery',
        headline: 'Free Delivery Nationwide',
        sub: 'Orders over KES 5,000 ship free to your door — fast, tracked, and insured.',
        secondaryCta: 'See How It Works',
        secondaryHref: '/search',
        gradient: 'bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600',
        accentColor: 'bg-orange-500 hover:bg-orange-600',
    },
];

export async function HeroSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Hero' });

    /**
     * First slide headline + CTA use the existing Hero translation keys
     * so nothing in en.json needs to change.
     */
    const slides: HeroSlide[] = SLIDES.map((s, i) => ({
        ...s,
        headline: i === 0 ? t('title') + ' — Up to 60% Off' : s.headline,
        cta: t('shopNow'),
        ctaHref: '/search',
    }));

    return <HeroCarousel slides={slides} autoPlayMs={5000} />;
}
