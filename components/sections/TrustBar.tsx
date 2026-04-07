"use client";

import * as React from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { getStats } from "@/lib/site-content";

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;

        const start = performance.now();
        const duration = 1200;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setCount(Math.round(value * progress));
          if (progress < 1) {
            frame = window.requestAnimationFrame(tick);
          }
        };

        frame = window.requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <p className="text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="text-sm text-[color:var(--color-text-secondary)]">{label}</p>
    </div>
  );
}

export function TrustBar() {
  const { locale } = useI18n();
  const stats = getStats(locale);

  return (
    <section className="section-shell border-y border-white/8 bg-[linear-gradient(90deg,rgba(124,58,237,0.12),rgba(17,17,24,1),rgba(124,58,237,0.12))] py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-[color:var(--color-border)]">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
