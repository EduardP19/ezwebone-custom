"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { getProcessSteps } from "@/lib/site-content";

export function HowItWorks() {
  const ref = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const { locale, dictionary } = useI18n();
  const processSteps = getProcessSteps(locale);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-shell section-shift section-shift-neutral bg-[color:var(--color-bg-dark)] py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl">
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
            {dictionary.home.process.badge}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            {dictionary.home.process.title}
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-5 top-0 bottom-0 hidden w-px bg-white/8 md:left-0 md:right-0 md:top-5 md:block md:h-px md:w-auto" />
          <motion.div
            className="absolute left-5 top-0 hidden w-px bg-[linear-gradient(180deg,var(--color-primary-light),var(--color-primary))] shadow-[0_0_24px_rgba(124,58,237,0.45)] md:left-0 md:right-0 md:top-5 md:block md:h-px"
            animate={
              isVisible
                ? { width: "100%", height: 1, opacity: 1 }
                : { width: "0%", height: 1, opacity: 0.4 }
            }
            transition={{ duration: 1.1, ease: "easeOut" }}
          />

          <div className="grid gap-8 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative pl-14 md:pl-0 md:pt-12"
              >
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(124,58,237,0.4)] bg-[color:var(--color-bg-elevated)] text-sm font-semibold text-[color:var(--color-text-primary)] shadow-[0_0_16px_rgba(124,58,237,0.18)] md:left-1/2 md:-translate-x-1/2">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[color:var(--color-text-secondary)]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
