"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { PhoneMockup } from "@/components/ui/PhoneMockup";

export function AITeaser() {
  const { dictionary } = useI18n();

  return (
    <section className="section-shell bg-[linear-gradient(180deg,#0a0a0f_0%,#120d20_100%)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(124,58,237,0.22),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-2xl"
        >
          <span className="mono-label inline-flex rounded-full border border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.1)] px-4 py-2 text-xs text-[color:var(--color-text-accent)]">
            {dictionary.home.aiTeaser.badge}
          </span>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            {dictionary.home.aiTeaser.title}
          </h2>
          <p className="mt-3 text-lg text-[color:var(--color-text-accent)]">
            {dictionary.home.aiTeaser.subtitle}
          </p>

          <p className="mt-6 text-lg leading-8 text-[color:var(--color-text-secondary)]">
            {dictionary.home.aiTeaser.body}
          </p>

          <ul className="mt-8 space-y-4">
            {dictionary.home.aiTeaser.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-[color:var(--color-text-primary)]">
                <CheckCircle2 size={18} className="mt-1 text-[color:var(--color-text-accent)]" />
                <span className="leading-7 text-[color:var(--color-text-secondary)]">{feature}</span>
              </li>
            ))}
          </ul>

          <Link href="https://resevia.co.uk" target="_blank" rel="noreferrer" className="mt-10 inline-block">
            <Button size="lg">{dictionary.common.learnMoreAboutResevia}</Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.08 }}
          className="surface-card relative overflow-hidden p-6 md:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.2),transparent_24%)]" />
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}
