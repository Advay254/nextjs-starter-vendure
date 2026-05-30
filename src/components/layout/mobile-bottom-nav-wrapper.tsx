import { cacheLife, cacheTag } from "next/cache";
import { query } from "@/lib/vendure/api";
import { GetActiveOrderQuery } from "@/lib/vendure/queries";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

/**
 * Server component — mirrors NavbarCart exactly.
 * Fetches active order quantity and passes it to MobileBottomNav for the badge.
 * Already wired into layout.tsx — no manual steps needed.
 */
export async function MobileBottomNavWrapper() {
    "use cache: private";
    cacheLife("minutes");
    cacheTag("cart");
    cacheTag("active-order");

    const orderResult = await query(GetActiveOrderQuery, undefined, {
        useAuthToken: true,
        tags: ["cart"],
    });

    const cartItemCount =
        orderResult.data.activeOrder?.totalQuantity ?? 0;

    return <MobileBottomNav cartItemCount={cartItemCount} />;
}
