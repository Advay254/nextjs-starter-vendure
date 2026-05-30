import Image from "next/image";
import { Suspense } from "react";
import { Search, Truck } from "lucide-react";
import { NavigationLink } from "@/components/shared/navigation-link";
import { NavbarCollections } from "@/components/layout/navbar/navbar-collections";
import { NavbarCart } from "@/components/layout/navbar/navbar-cart";
import { NavbarUser } from "@/components/layout/navbar/navbar-user";
import { ThemeSwitcher } from "@/components/layout/navbar/theme-switcher";
import { LanguagePicker } from "@/components/layout/navbar/language-picker";
import { CurrencyPickerWrapper } from "@/components/layout/navbar/currency-picker-wrapper";
import { MobileNavWrapper } from "@/components/layout/navbar/mobile-nav-wrapper";
import { SearchInput } from "@/components/layout/search-input";
import { NavbarUserSkeleton } from "@/components/shared/skeletons/navbar-user-skeleton";
import { SearchInputSkeleton } from "@/components/shared/skeletons/search-input-skeleton";
import { SITE_NAME } from "@/lib/metadata";

/**
 * Split the site name so the first word gets the dark-slate treatment
 * and the remainder gets the orange accent — works for any store name.
 * e.g. "Jumia Africa" → "Jumia" + "Africa"
 *      "MyShop"       → "MyShop" (all dark, orange lives on the icon)
 */
function SiteWordmark() {
    const [firstWord, ...rest] = SITE_NAME.split(" ");
    const remainder = rest.join(" ");

    return (
        <div className="hidden sm:flex flex-col leading-none select-none">
            <span className="font-black text-[15px] tracking-tight">
                <span className="text-slate-800">{firstWord}</span>
                {remainder && (
                    <span className="text-orange-500">{remainder}</span>
                )}
            </span>
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-slate-400 mt-[2px]">
                Marketplace
            </span>
        </div>
    );
}

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* ── Promo strip — desktop only ── */}
            <div className="hidden md:flex items-center justify-center gap-2 bg-orange-500 text-white text-[11px] font-medium py-1.5 px-4 tracking-wide">
                <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                    Free delivery on orders over{" "}
                    <strong className="font-bold">KES 5,000</strong>
                    {" · "}
                    Use code{" "}
                    <strong className="font-bold underline underline-offset-2">
                        SAVE10
                    </strong>{" "}
                    for 10% off your first order
                </span>
            </div>

            {/* ── Main nav row ── */}
            <div className="bg-white border-b border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-5">
                    <div className="flex items-center h-14 gap-2 sm:gap-3">

                        {/* ── Left: hamburger + logo ── */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Slide-out hamburger (visible on mobile, hidden md+) */}
                            <Suspense>
                                <MobileNavWrapper />
                            </Suspense>

                            <NavigationLink
                                href="/"
                                className="flex items-center gap-2 group shrink-0"
                            >
                                {/* Icon badge */}
                                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-sm group-hover:shadow-md group-hover:shadow-orange-200/60 transition-shadow duration-200 shrink-0">
                                    <Image
                                        src="/vendure.svg"
                                        alt={SITE_NAME}
                                        width={18}
                                        height={18}
                                        className="invert"
                                        priority
                                    />
                                </div>

                                <SiteWordmark />
                            </NavigationLink>
                        </div>

                        {/* ── Center: collection links (desktop) ── */}
                        <nav className="hidden md:flex items-center shrink-0 pl-2">
                            <Suspense>
                                <NavbarCollections />
                            </Suspense>
                        </nav>

                        {/* ── Search bar (desktop, grows to fill space) ── */}
                        <div className="hidden lg:flex flex-1 max-w-[420px] mx-auto">
                            <Suspense fallback={<SearchInputSkeleton />}>
                                <SearchInput />
                            </Suspense>
                        </div>

                        {/* ── Right cluster ── */}
                        <div className="flex items-center gap-0.5 ml-auto">
                            {/* Mobile/tablet search shortcut (hidden on lg where bar is visible) */}
                            <NavigationLink
                                href="/search"
                                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-150"
                                aria-label="Search"
                            >
                                <Search className="h-[18px] w-[18px]" aria-hidden="true" />
                            </NavigationLink>

                            {/* Language + currency pickers — desktop only */}
                            <div className="hidden md:flex items-center">
                                <Suspense>
                                    <LanguagePicker />
                                </Suspense>
                                <Suspense>
                                    <CurrencyPickerWrapper />
                                </Suspense>
                            </div>

                            {/* Theme toggle — desktop only */}
                            <div className="hidden md:block">
                                <Suspense>
                                    <ThemeSwitcher />
                                </Suspense>
                            </div>

                            {/* Cart — desktop only; mobile uses bottom nav */}
                            <div className="hidden md:block">
                                <Suspense>
                                    <NavbarCart />
                                </Suspense>
                            </div>

                            {/* User account — desktop only; mobile uses bottom nav */}
                            <div className="hidden md:block">
                                <Suspense fallback={<NavbarUserSkeleton />}>
                                    <NavbarUser />
                                </Suspense>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}
