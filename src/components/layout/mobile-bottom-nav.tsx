"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
    /** Live cart item count — passed down from MobileBottomNavWrapper */
    cartItemCount?: number;
}

const NAV_TABS = [
    {
        href: "/",
        label: "Home",
        Icon: Home,
        match: (p: string) => p === "/",
    },
    {
        href: "/search",
        label: "Search",
        Icon: Search,
        match: (p: string) => p.startsWith("/search"),
    },
    {
        href: "/cart",
        label: "Cart",
        Icon: ShoppingCart,
        match: (p: string) => p.startsWith("/cart"),
        badge: true,
    },
    {
        href: "/account/profile",
        label: "Account",
        Icon: User,
        match: (p: string) =>
            p.startsWith("/account") ||
            p.startsWith("/sign-in") ||
            p.startsWith("/register"),
    },
] as const;

export function MobileBottomNav({ cartItemCount = 0 }: MobileBottomNavProps) {
    /**
     * next-intl's usePathname strips the locale prefix automatically,
     * so "/en/cart" is returned as "/cart" — no manual stripping needed.
     */
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-[0_-2px_12px_-2px_rgba(0,0,0,0.08)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            aria-label="Mobile navigation"
        >
            <div className="flex items-stretch h-[56px]">
                {NAV_TABS.map(({ href, label, Icon, match, badge }) => {
                    const isActive = match(pathname);
                    const showBadge = badge && cartItemCount > 0;

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "relative flex-1 flex flex-col items-center justify-center gap-[3px]",
                                "transition-colors duration-150 select-none",
                                "active:scale-95 active:transition-none",
                                isActive
                                    ? "text-orange-500"
                                    : "text-slate-400 hover:text-slate-500"
                            )}
                        >
                            {/* Active top-edge indicator */}
                            {isActive && (
                                <span
                                    aria-hidden="true"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full bg-orange-500"
                                />
                            )}

                            {/* Icon + optional cart badge */}
                            <div className="relative mt-0.5">
                                <Icon
                                    aria-hidden="true"
                                    className={cn(
                                        "h-[21px] w-[21px] transition-transform duration-150",
                                        isActive && "scale-110"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 1.75}
                                />

                                {showBadge && (
                                    <span
                                        aria-label={`${cartItemCount} items in cart`}
                                        className="absolute -top-[7px] -right-[7px] min-w-[16px] h-4 px-[3px] flex items-center justify-center bg-orange-500 text-white text-[9px] font-bold leading-none rounded-full border-[1.5px] border-white"
                                    >
                                        {cartItemCount > 99 ? "99+" : cartItemCount}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "text-[10px] font-semibold leading-none tracking-wide",
                                    isActive ? "text-orange-500" : "text-slate-400"
                                )}
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
