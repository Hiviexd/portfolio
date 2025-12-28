import { useEffect, useRef } from "react";

const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

export function AgeCounter({
    startDate,
    decimals = 10,
    className,
}: {
    startDate: Date;
    decimals?: number;
    className?: string;
}) {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const startMs = startDate.getTime();

    useEffect(() => {
        let rafId = 0;

        const tick = () => {
            const years = (Date.now() - startMs) / MS_PER_YEAR;
            if (spanRef.current) spanRef.current.textContent = years.toFixed(decimals);
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [startMs, decimals]);

    return <span ref={spanRef} className={className} style={{ fontVariantNumeric: "tabular-nums" }} />;
}
