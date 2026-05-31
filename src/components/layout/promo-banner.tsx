'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

/** Target time: 24 h from page load — replace with a real end date from your CMS */
function useCountdown(targetMs: number) {
    const [remaining, setRemaining] = useState(targetMs);

    useEffect(() => {
        const id = setInterval(() => {
            setRemaining((r) => Math.max(0, r - 1000));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const h = Math.floor(remaining / 3_600_000);
    const m = Math.floor((remaining % 3_600_000) / 60_000);
    const s = Math.floor((remaining % 60_000) / 1000);

    return {
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
    };
}

function Segment({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm font-black text-xl text-white tabular-nums">
                {value}
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-white/70">
                {label}
            </span>
        </div>
    );
}

export function PromoBanner() {
    const { h, m, s } = useCountdown(24 * 3_600_000);

    return (
        <section className="bg-gradient-to-r from-orange-600 to-amber-500 py-6 md:py-8">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

                    {/* Left: headline */}
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 shrink-0">
                            <Zap className="h-6 w-6 text-white fill-white" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/75">
                                Flash Sale
                            </p>
                            <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                                Up to 60% Off — Today Only
                            </h3>
                        </div>
                    </div>

                    {/* Center: countdown */}
                    <div className="flex items-end gap-2" aria-label="Time remaining">
                        <Segment value={h} label="Hrs" />
                        <span className="text-white/70 font-black text-xl mb-3">:</span>
                        <Segment value={m} label="Min" />
                        <span className="text-white/70 font-black text-xl mb-3">:</span>
                        <Segment value={s} label="Sec" />
                    </div>

                    {/* Right: CTA */}
                    <Link
                        href="/search"
                        className="shrink-0 inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-white text-orange-600 text-sm font-bold shadow-lg hover:bg-orange-50 active:scale-[0.97] transition-all duration-150"
                    >
                        Shop the Sale
                    </Link>

                </div>
            </div>
        </section>
    );
}
