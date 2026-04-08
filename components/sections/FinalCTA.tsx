"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { ParticleNetwork } from "@/components/sections/ParticleNetwork";
import { CALENDLY_BOOKING_URL } from "@/lib/links";

interface FinalCTAProps {
  variant?: "black" | "purple" | "orange" | "glass";
}

export function FinalCTA({ variant = "black" }: FinalCTAProps) {
  void variant;
  const { dictionary } = useI18n();

  return (
    <section className="section-shell bg-[color:var(--color-bg-dark)] pt-20 pb-14 md:pt-24 md:pb-18">
      <ParticleNetwork count={46} maxDistance={130} interactive={false} className="opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_30%)]" />

      <div className="relative mx-auto max-w-5xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            {dictionary.home.finalCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[color:var(--color-text-secondary)]">
            {dictionary.home.finalCta.body}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer">
              <Button size="lg">{dictionary.common.bookFreeCall}</Button>
            </a>

            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--color-text-secondary)] backdrop-blur-xl">
              <span className="text-[color:var(--color-text-primary)]">★★★★★</span>
              <span className="mx-2">{dictionary.common.ratedGoogle}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
